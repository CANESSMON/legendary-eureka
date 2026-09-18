import React, { useState, useEffect } from 'react';
import { Briefcase, ArrowRight, ArrowLeft, Eye, EyeOff, Check, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { API_BASE_URL } from '../config';

const parseErrorMessage = (detail, defaultMsg = 'An error occurred') => {
  if (!detail) return defaultMsg;
  let msgStr = '';
  if (typeof detail === 'string') {
    msgStr = detail;
  } else if (Array.isArray(detail)) {
    msgStr = detail
      .map((err) => {
        if (typeof err === 'string') return err;
        if (err.msg) return err.msg;
        return JSON.stringify(err);
      })
      .join(', ');
  } else if (typeof detail === 'object') {
    if (detail.msg) msgStr = detail.msg;
    else if (detail.message) msgStr = detail.message;
    else msgStr = JSON.stringify(detail);
  } else {
    msgStr = String(detail);
  }
  return msgStr.replace(/^Value error,\s*/i, '');
};

const WEAK_PASSWORDS_SET = new Set([
  '12345678', '123456789', '1234567890', '87654321', '12341234', '11111111', '00000000',
  'password', 'password1', 'password123', 'pass1234', 'p@ssword', 'p@ssword1',
  'qwerty123', 'qwerty1234', 'qwerty12', 'qwertyuiop', 'qwert123',
  'admin123', 'admin1234', 'administrator', 'adminpass',
  'welcome1', 'welcome123', 'welcome2023', 'welcome2024', 'welcome2025', 'welcome2026',
  'letmein123', 'abc12345', 'abcd1234', 'abc123456', 'abcdefgh',
  'iloveyou1', 'monkey123', 'dragon123', 'master123', 'login123',
  'princess1', 'football1', 'charlie1', 'shadow123', 'sunshine1', 'superman1',
  'user1234', 'guest1234', 'change123', 'testing123', 'test1234'
]);

const checkPasswordRules = (pw) => {
  if (!pw) {
    return {
      hasLength: false,
      hasLowercase: false,
      hasUppercase: false,
      hasNumber: false,
      hasSpecial: false,
      isNotCommon: true,
      hasNoEdgeSpaces: true,
      isValid: false,
      score: 0
    };
  }

  const hasNoEdgeSpaces = !pw.startsWith(' ') && !pw.endsWith(' ');
  const lower = pw.toLowerCase();

  const hasLength = pw.length >= 8 && pw.length <= 64;
  const hasLowercase = /[a-z]/.test(pw);
  const hasUppercase = /[A-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^a-zA-Z0-9\s]/.test(pw);

  let isNotCommon = true;
  if (WEAK_PASSWORDS_SET.has(lower.trim())) {
    isNotCommon = false;
  } else if (new Set(lower.trim()).size === 1 && lower.trim().length >= 1) {
    isNotCommon = false;
  } else {
    const commonBases = ['password', 'p@ssword', 'admin', 'welcome', 'qwerty', 'abc123', 'login', 'letmein', 'pass', 'user', 'guest'];
    for (const base of commonBases) {
      if (lower.trim().startsWith(base)) {
        const rest = lower.trim().slice(base.length);
        if (/^[\d!@#$%^&*()_+\-=\[\]{};:\'",.<>?]*$/.test(rest)) {
          isNotCommon = false;
          break;
        }
      }
    }
  }

  const isValid = hasNoEdgeSpaces && hasLength && hasLowercase && hasUppercase && hasNumber && hasSpecial && isNotCommon;

  let score = 0;
  if (hasLength) score++;
  if (hasLowercase) score++;
  if (hasUppercase) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;
  if (hasNoEdgeSpaces) score++;
  if (isNotCommon && pw.length >= 8) score++;

  return { hasLength, hasLowercase, hasUppercase, hasNumber, hasSpecial, isNotCommon, hasNoEdgeSpaces, isValid, score };
};

const PasswordValidationCriteria = ({ rules, password = '' }) => {
  if (!password) return null;

  const criteria = [
    { label: '8-64 characters long', met: rules.hasLength },
    { label: '1 lowercase letter (a-z)', met: rules.hasLowercase },
    { label: '1 uppercase letter (A-Z)', met: rules.hasUppercase },
    { label: '1 number (0-9)', met: rules.hasNumber },
    { label: '1 symbol (!@#$...)', met: rules.hasSpecial },
    { label: 'No leading/trailing space', met: rules.hasNoEdgeSpaces },
  ];

  return (
    <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2.5 animate-fade-in text-left">
      {!rules.hasNoEdgeSpaces && (
        <div className="flex items-center gap-1.5 text-red-600 font-semibold bg-red-50 p-2 rounded border border-red-200">
          <X size={14} className="shrink-0 stroke-[2.5]" />
          <span>Password must not contain leading or trailing spaces.</span>
        </div>
      )}

      {!rules.isNotCommon && rules.hasNoEdgeSpaces && (
        <div className="flex items-center gap-1.5 text-red-600 font-semibold bg-red-50 p-2 rounded border border-red-200">
          <X size={14} className="shrink-0 stroke-[2.5]" />
          <span>This password is too common. Please choose a stronger password.</span>
        </div>
      )}

      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[11px] font-medium text-slate-500">
          <span>Password strength</span>
          <span className={rules.isValid ? "text-emerald-600 font-bold" : (!rules.isNotCommon || !rules.hasNoEdgeSpaces) ? "text-red-500 font-bold" : "text-slate-500"}>
            {!rules.hasNoEdgeSpaces ? "Invalid Space" : !rules.isNotCommon ? "Too Weak" : rules.isValid ? "Strong" : rules.score >= 4 ? "Moderate" : "Weak"}
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
          <div
            className={`h-full transition-all duration-300 ${
              !rules.hasNoEdgeSpaces || !rules.isNotCommon
                ? "bg-red-500 w-1/4"
                : rules.isValid
                ? "bg-emerald-500 w-full"
                : rules.score >= 4
                ? "bg-amber-400 w-2/3"
                : "bg-red-400 w-1/3"
            }`}
          />
        </div>
      </div>

      {/* Rules list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-0.5">
        {criteria.map((item, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-slate-600">
            {item.met ? (
              <Check size={13} className="text-emerald-600 shrink-0 stroke-[3]" />
            ) : (
              <span className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0 inline-block" />
            )}
            <span className={item.met ? "text-slate-800 font-medium" : "text-slate-400"}>
              {item.label}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-slate-600">
          {rules.isNotCommon ? (
            <Check size={13} className={password ? "text-emerald-600 shrink-0 stroke-[3]" : "opacity-0"} />
          ) : (
            <X size={13} className="text-red-600 shrink-0 stroke-[3]" />
          )}
          <span className={!rules.isNotCommon ? "text-red-600 font-medium" : password && rules.isNotCommon ? "text-slate-800 font-medium" : "text-slate-400"}>
            Not a common password
          </span>
        </div>
      </div>
    </div>
  );
};

const Auth = ({ initialMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useJobs();

  const [isLogin, setIsLogin] = useState(() => {
    if (initialMode === 'register') return false;
    if (initialMode === 'login') return true;
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'register' || location.pathname.includes('/register')) return false;
    return true;
  });

  useEffect(() => {
    if (initialMode === 'register' || location.pathname.includes('/register')) {
      setIsLogin(false);
    } else if (initialMode === 'login' || location.pathname.includes('/login')) {
      setIsLogin(true);
    }
  }, [initialMode, location.pathname]);

  const [accountType, setAccountType] = useState('employer');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState(1); // 1: Send Code, 2: Verify Code, 3: Set New Password

  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
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

  const passwordRules = checkPasswordRules(password);
  const newPasswordRules = checkPasswordRules(newPassword);

  const getTitle = () => {
    if (isForgotPassword) {
      if (resetStep === 3) return 'Set New Password';
      if (resetStep === 2) return 'Verify Reset Code';
      return 'Reset Password';
    }
    if (otpRequired) return 'Security Verification';
    return isLogin ? 'Welcome back' : 'Create an account';
  };

  const getSubtitle = () => {
    if (isForgotPassword) {
      if (resetStep === 3) return 'Choose a new password for your account.';
      if (resetStep === 2) return 'Enter the code sent to your email to verify your identity.';
      return 'Enter your email to receive a password reset code.';
    }
    if (otpRequired) return 'Enter the verification code sent to your email to verify your identity.';
    return isLogin
      ? 'Enter your details to access your workspace.'
      : 'Join thousands of professionals finding their next role.';
  };

  const handleToggleMode = () => {
    const newLoginMode = !isLogin;
    setIsLogin(newLoginMode);
    setIsForgotPassword(false);
    setResetStep(1);
    setErrorMsg('');
    setSuccessMsg('');
    setOtpRequired(false);
    setOtp('');
    setNewPassword('');
    setCompanyName('');
    navigate(newLoginMode ? '/login' : '/register', { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Pre-validate password on registration or reset
    if (!isLogin && !isForgotPassword && !passwordRules.isValid) {
      if (!passwordRules.isNotCommon) {
        setErrorMsg('This password is too common. Please choose a stronger password.');
      } else {
        setErrorMsg('Please ensure your password meets all requirements.');
      }
      return;
    }

    if (isForgotPassword && resetStep === 3 && !newPasswordRules.isValid) {
      if (!newPasswordRules.isNotCommon) {
        setErrorMsg('This password is too common. Please choose a stronger password.');
      } else {
        setErrorMsg('Please ensure your password meets all requirements.');
      }
      return;
    }

    setLoading(true);

    const trimmedEmail = email.trim();
    const trimmedFullName = fullName.trim();
    const trimmedCompanyName = companyName.trim();
    const trimmedReferral = referralCode.trim();

    try {
      if (isForgotPassword) {
        if (resetStep === 1) {
          const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: trimmedEmail })
          });
          const data = await response.json();

          if (!response.ok) {
            throw new Error(parseErrorMessage(data.detail, 'No account found with this email address'));
          }

          setResetStep(2);
          setSuccessMsg(data.message || 'Password reset code sent to your email address.');
        } else if (resetStep === 2) {
          if (!otp || otp.trim().length !== 6) {
            throw new Error('Please enter the 6-digit reset code');
          }

          const response = await fetch(`${API_BASE_URL}/api/auth/verify-reset-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: trimmedEmail,
              otp: otp.trim()
            })
          });
          const data = await response.json();

          if (!response.ok) {
            throw new Error(parseErrorMessage(data.detail, 'Invalid reset code'));
          }

          setResetStep(3);
          setErrorMsg('');
          setSuccessMsg('');
        } else if (resetStep === 3) {
          const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: trimmedEmail,
              otp: otp.trim(),
              new_password: newPassword.trim()
            })
          });
          const data = await response.json();

          if (!response.ok) {
            throw new Error(parseErrorMessage(data.detail, 'Password reset failed'));
          }

          setSuccessMsg(data.message || 'Password has been reset successfully. You can now log in with your new password.');
          setIsForgotPassword(false);
          setResetStep(1);
          setOtp('');
          setNewPassword('');
          setPassword('');
          setIsLogin(true);
        }
      } else if (isLogin) {
        const payload = { email: trimmedEmail, password };
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
          throw new Error(parseErrorMessage(data.detail, 'Login failed'));
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

        if (data.user?.role === 'SUPER_USER' || trimmedEmail.toLowerCase().includes('admin')) {
          navigate('/admin');
        } else if (data.user?.role === 'EMPLOYER' || trimmedEmail.toLowerCase().includes('employer')) {
          navigate('/employer');
        } else if (data.user?.role === 'AGENT' || trimmedEmail.toLowerCase().includes('agent')) {
          navigate('/agent');
        } else {
          navigate('/');
        }
      } else {
        const payload = {
          email: trimmedEmail,
          password,
          full_name: trimmedFullName,
          account_type: accountType,
          ...(accountType === 'employer' ? { company_name: trimmedCompanyName } : {}),
          ...(accountType === 'employer' && trimmedReferral ? { referral_code: trimmedReferral } : {})
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
          throw new Error(parseErrorMessage(data.detail, 'Registration failed'));
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

  const isSubmitDisabled = loading || (
    !isLogin && !isForgotPassword && !otpRequired
      ? (!passwordRules.isValid || !fullName.trim() || !email.trim() || (accountType === 'employer' && !companyName.trim()))
      : isForgotPassword && resetStep === 3
      ? !newPasswordRules.isValid
      : false
  );

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
            ) : isForgotPassword && resetStep === 2 ? (
              <div className="animate-fade-in space-y-4">
                <div className="text-center pb-1">
                  <span className="text-xs text-slate-500 font-medium">Sent to: <strong className="text-slate-800 break-all">{email}</strong></span>
                </div>
                <div>
                  <label className="form-label tracking-wider mb-2 block text-slate-500 text-center">Reset Code (OTP)</label>
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
                        const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ email: email.trim() })
                        });
                        const data = await response.json();
                        if (!response.ok) {
                          throw new Error(data.detail || 'Resend failed');
                        }
                        setSuccessMsg('A new reset code has been sent to your email.');
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
                      setResetStep(1);
                      setOtp('');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-slate-500 hover:text-slate-700 bg-transparent border-0 cursor-pointer p-0 font-medium"
                  >
                    Change Email
                  </button>
                </div>
              </div>
            ) : isForgotPassword && resetStep === 3 ? (
              <div className="animate-fade-in space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <span>✓ Reset code verified for <strong className="break-all">{email}</strong></span>
                </div>

                <div>
                  <label className="form-label tracking-wider mb-2 block text-slate-500">New Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="At least 8 characters"
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
                  <PasswordValidationCriteria rules={newPasswordRules} password={newPassword} />
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

                {/* Company Name - Only for Employer on Sign Up */}
                {!isLogin && !isForgotPassword && accountType === 'employer' && (
                  <div className="animate-fade-in [animation-delay:35ms]">
                    <label className="form-label tracking-wider mb-2 block text-slate-500">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                      placeholder="e.g. Acme Tech Solutions"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2.5 px-4 text-sm text-slate-900 outline-none focus:border-primary focus:bg-white transition-colors"
                    />
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

                    {/* Real-time inline password criteria checklist (Only during Sign Up) */}
                    {!isLogin && (
                      <PasswordValidationCriteria rules={passwordRules} password={password} />
                    )}
                  </div>
                )}

                {/* Employer specific fields */}
                {!isLogin && !isForgotPassword && accountType === 'employer' && (
                  <div className="animate-fade-in [animation-delay:125ms]">
                    <label className="form-label tracking-wider mb-2 block text-slate-500">Agent Referral Code (Optional)</label>
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
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
              <button
                disabled={isSubmitDisabled}
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg transition-all font-bold tracking-wide shadow-sm shadow-primary/20 flex items-center justify-center gap-2 hover:-translate-y-0.5"
              >
                {loading
                  ? 'Processing...'
                  : otpRequired
                  ? 'Verify & Continue'
                  : isForgotPassword
                  ? resetStep === 1
                    ? 'Send Reset Code'
                    : resetStep === 2
                    ? 'Verify Code'
                    : 'Set New Password'
                  : isLogin
                  ? 'Sign In'
                  : 'Create Account'}
                {!loading && (!isForgotPassword || resetStep !== 1) && <ArrowRight size={18} />}
              </button>
            </div>
          </form>

          {/* Toggle Login/Signup/Back */}
          <div className="mt-8 text-center animate-fade-in [animation-delay:250ms]">
            {isForgotPassword ? (
              <span
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetStep(1);
                  setOtp('');
                  setNewPassword('');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
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
