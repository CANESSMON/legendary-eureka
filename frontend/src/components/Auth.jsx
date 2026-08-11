import React, { useState } from 'react';
import { Briefcase, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { API_BASE_URL } from '../config';

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useJobs();
  const [isLogin, setIsLogin] = useState(true);
  const [accountType, setAccountType] = useState('employer');
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('referral') || '';
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [otpRequired, setOtpRequired] = useState(false);
  const [otp, setOtp] = useState('');

  const getTitle = () => {
    if (isForgotPassword) return 'Reset Password';
    if (otpRequired) return 'Security Verification';
    return isLogin ? 'Welcome back' : 'Create an account';
  };

  const getSubtitle = () => {
    if (isForgotPassword) return 'Enter your email to receive a password reset link.';
    if (otpRequired) return 'Enter the verification code sent to your email to verify your identity.';
    return isLogin
      ? 'Enter your details to access your workspace.'
      : 'Join thousands of professionals finding their next role.';
  };

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
    setIsForgotPassword(false);
    setErrorMsg('');
    setSuccessMsg('');
    setOtpRequired(false);
    setOtp('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isForgotPassword) {
        const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Reset failed');
        }

        setSuccessMsg('Password reset link has been sent to your email.');
        setIsForgotPassword(false);
        setIsLogin(true);
      } else if (isLogin) {
        const payload = { email, password };
        if (otpRequired) {
          payload.otp = otp;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Login failed');
        }

        if (data.status === 'otp_required') {
          setOtpRequired(true);
          setSuccessMsg('An OTP code has been sent to your registered email. Please enter it to verify.');
          setLoading(false);
          return;
        }

        if (data.access_token && data.user) {
          login(data.access_token, data.user.role, data.user);
        }

        // Redirect employer to dashboard, agent to agent dashboard, admin to admin dashboard, others to home page
        if (data.user?.role === 'SUPER_USER' || email.toLowerCase().includes('admin')) {
          navigate('/admin');
        } else if (data.user?.role === 'EMPLOYER' || email.toLowerCase().includes('employer')) {
          navigate('/employer');
        } else if (data.user?.role === 'AGENT' || email.toLowerCase().includes('agent')) {
          navigate('/agent');
        } else {
          navigate('/');
        }
      } else {
        const payload = {
          email,
          password,
          full_name: fullName,
          account_type: accountType,
          ...(accountType === 'employer' && referralCode ? { referral_code: referralCode } : {})
        };
        if (otpRequired) {
          payload.otp = otp;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Registration failed');
        }

        if (data.status === 'otp_required') {
          setOtpRequired(true);
          setSuccessMsg('An OTP code has been sent to your email. Please enter it to verify and complete signup.');
          setLoading(false);
          return;
        }

        setSuccessMsg('Account created successfully! You can now log in.');
        setIsLogin(true);
        setOtpRequired(false);
        setOtp('');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row">
      {/* Left Panel - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 pt-28 pb-12">
        <div className="max-w-md w-full mx-auto">
          <h2 className="mb-2">{getTitle()}</h2>
          <p className="body-text text-slate-500 mb-8">{getSubtitle()}</p>

          {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">{errorMsg}</div>}
          {successMsg && <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-medium">{successMsg}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>

            {otpRequired ? (
              <div className="animate-fade-in space-y-4">
                <div className="text-center pb-2">
                  <p className="text-sm text-slate-600">
                    We've sent a 6-digit verification code to
                  </p>
                  <p className="text-sm font-semibold text-slate-800 break-all">
                    {email}
                  </p>
                </div>
                <div>
                  <label className="form-label tracking-wider mb-2 block text-slate-500 text-center">One-Time Password (OTP)</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                    placeholder=" XXXXXX"
                    className="w-full text-center bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-xl font-bold tracking-[0.5em] text-slate-900 outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={async () => {
                      setOtp('');
                      setErrorMsg('');
                      setSuccessMsg('');
                      setLoading(true);
                      try {
                        const endpoint = isLogin ? 'login' : 'register';
                        const payload = isLogin
                          ? { email, password }
                          : {
                            email,
                            password,
                            full_name: fullName,
                            account_type: accountType,
                            ...(accountType === 'employer' && referralCode ? { referral_code: referralCode } : {})
                          };
                        const response = await fetch(`${API_BASE_URL}/api/auth/${endpoint}`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(payload)
                        });
                        const data = await response.json();
                        if (!response.ok) {
                          throw new Error(data.detail || 'Resend failed');
                        }
                        setSuccessMsg('A new OTP code has been sent successfully.');
                      } catch (err) {
                        setErrorMsg(err.message);
                      } finally {
                        setLoading(false);
                      }
                    }}
                    className="text-primary hover:underline font-semibold bg-transparent border-0 cursor-pointer p-0"
                  >
                    Resend Code
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOtpRequired(false);
                      setOtp('');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-slate-500 hover:text-slate-700 bg-transparent border-0 cursor-pointer p-0 font-medium"
                  >
                    Change details
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Full Name - Only on Sign Up */}
                {!isLogin && !isForgotPassword && (
                  <div className="animate-fade-in">
                    <label className="form-label tracking-wider mb-2 block text-slate-500">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      placeholder="Rahul Sharma"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-900 outline-none focus:border-primary focus:bg-white transition-colors"
                    />
                  </div>
                )}

                {/* Account Type - Only on Sign Up */}
                {!isLogin && !isForgotPassword && (
                  <div className="animate-fade-in [animation-delay:25ms]">
                    <label className="form-label tracking-wider mb-2 block text-slate-500">I am a...</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setAccountType('employer')}
                        className={`py-2 text-sm rounded-lg border font-medium transition-colors ${accountType === 'employer' ? 'bg-primary border-primary text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >Employer</button>
                      <button
                        type="button"
                        onClick={() => setAccountType('agent')}
                        className={`py-2 text-sm rounded-lg border font-medium transition-colors ${accountType === 'agent' ? 'bg-primary border-primary text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >Agent</button>
                    </div>
                  </div>
                )}

                {/* Email - Always visible */}
                <div className="animate-fade-in [animation-delay:50ms]">
                  <label className="form-label tracking-wider mb-2 block text-slate-500">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="rahul@startup.in"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-900 outline-none focus:border-primary focus:bg-white transition-colors"
                  />
                </div>

                {/* Password - Only on Login / Sign Up */}
                {!isForgotPassword && (
                  <div className="animate-fade-in [animation-delay:100ms]">
                    <label className="form-label tracking-wider mb-2 block text-slate-500">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 pl-4 pr-11 text-sm text-slate-900 outline-none focus:border-primary focus:bg-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-1 focus:outline-none flex items-center justify-center"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Employer specific fields */}
                {!isLogin && !isForgotPassword && accountType === 'employer' && (
                  <div className="animate-fade-in [animation-delay:125ms]">
                    <label className="form-label tracking-wider mb-2 block text-slate-500">Agent Referral Code (Optional)</label>
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      placeholder="e.g. AGENT-IND-123"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-900 outline-none focus:border-primary focus:bg-white transition-colors"
                    />
                    <p className="text-[x-small] text-amber-600 mt-1.5 font-medium text-left">
                      * Admin verification required to post jobs.
                    </p>
                  </div>
                )}

                {/* Forgot Password Link - Only on Login */}
                {isLogin && !isForgotPassword && (
                  <div className="flex justify-end animate-fade-in [animation-delay:150ms]">
                    <span
                      onClick={() => setIsForgotPassword(true)}
                      className="form-label text-primary hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </span>
                  </div>
                )}
              </>
            )}

            {/* Submit Button */}
            <div className="pt-2 animate-fade-in [animation-delay:200ms]">
              <button disabled={loading} type="submit" className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white py-3 rounded-lg transition-all font-bold tracking-wide shadow-sm shadow-primary/20 flex items-center justify-center gap-2 hover:-translate-y-0.5">
                {loading ? 'Processing...' : (otpRequired ? 'Verify & Continue' : (isForgotPassword ? 'Send Reset Link' : (isLogin ? 'Sign In' : 'Create Account')))}
                {!loading && !isForgotPassword && <ArrowRight size={18} />}
              </button>
            </div>
          </form>

          {/* Toggle Login/Signup/Back */}
          <div className="mt-8 text-center animate-fade-in [animation-delay:250ms]">
            {isForgotPassword ? (
              <span
                onClick={() => setIsForgotPassword(false)}
                className="form-label text-primary hover:underline cursor-pointer font-bold tracking-wider flex items-center justify-center gap-1"
              >
                <ArrowLeft size={14} /> Back to Log in
              </span>
            ) : (
              <>
                <span className="body-text text-slate-500">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <span
                  onClick={handleToggleMode}
                  className="form-label text-primary hover:underline cursor-pointer font-bold tracking-wider ml-1"
                >
                  {isLogin ? 'Sign up' : 'Log in'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right Panel - Branding/Image */}
      <div className="hidden md:flex w-full md:w-1/2 p-6 pt-28">
        <div className="w-full h-full bg-slate-900 rounded-2xl overflow-hidden relative flex flex-col justify-end p-12 shadow-2xl">
          <img src="/office.png" alt="Office environment" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>

          <div className="relative z-10 animate-fade-in">
            <h2 className="text-white mb-4 leading-tight">
              "The structural engine for the modern workforce."
            </h2>
            <p className="body-text text-slate-300 max-w-md">
              Join JobPortal India to organize your professional landscape with clarity and structural integrity.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Auth;
