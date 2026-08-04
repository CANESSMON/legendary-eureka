import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useJobs } from '../../context/JobContext';
import { API_BASE_URL } from '../../config';
import {
  Users, Briefcase, Copy, Share2, LogOut, CheckCircle2,
  AlertTriangle, Play, Pause, ExternalLink, ShieldCheck, IndianRupee, X,
  User, CreditCard, Shield, ChevronRight
} from 'lucide-react';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('referrals'); // 'referrals', 'profile'
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Dashboard stats
  const [stats, setStats] = useState({
    referral_code: '...',
    total_referrals: 0,
    active_referrals: 0,
    total_jobs_posted: 0,
    earnings: 0
  });

  // Referrals table data
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState('');
  const [linkFeedback, setLinkFeedback] = useState('');

  // Suspension modal state
  const [suspendingId, setSuspendingId] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    phone: '',
    dob: '',
    profilePic: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    docType: 'Aadhar', // Aadhar, PAN, Voter ID, Passport
    docNumber: '',
    payoutType: 'UPI', // UPI or Bank
    upiId: '',
    confirmUpiId: '',
    bankName: '',
    accountHolder: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    micrCode: ''
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  const { token, userRole, logout } = useJobs();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch stats
      const statsRes = await fetch(`${API_BASE_URL}/api/agent/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      // Fetch referrals
      const referralsRes = await fetch(`${API_BASE_URL}/api/agent/referrals`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (referralsRes.ok) {
        const referralsData = await referralsRes.json();
        setReferrals(referralsData);
      }
    } catch (err) {
      console.error('Error fetching agent dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfileForm({
          phone: data.phone || '',
          dob: data.dob || '',
          profilePic: data.profile_pic || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          docType: data.doc_type || 'Aadhar',
          docNumber: data.doc_number || '',
          payoutType: data.payout_type || 'UPI',
          upiId: data.upi_id || '',
          confirmUpiId: data.upi_id || '',
          bankName: data.bank_name || '',
          accountHolder: data.account_holder || '',
          accountNumber: data.account_number || '',
          confirmAccountNumber: data.account_number || '',
          ifscCode: data.ifsc_code || '',
          micrCode: data.micr_code || ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate('/auth');
      return;
    }
    if (userRole !== 'AGENT') {
      navigate(userRole === 'EMPLOYER' ? '/employer' : '/');
      return;
    }
    fetchDashboardData();
    fetchAgentProfile();
  }, [token, userRole, navigate]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(stats.referral_code);
    setCopyFeedback('Copied!');
    setTimeout(() => setCopyFeedback(''), 2000);
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/auth?referral=${stats.referral_code}`;
    navigator.clipboard.writeText(link);
    setLinkFeedback('Copied Link!');
    setTimeout(() => setLinkFeedback(''), 2000);
  };

  const handleOpenSuspendModal = (id) => {
    setSuspendingId(id);
    setSuspensionReason('');
  };

  const handleSuspend = async (e) => {
    e.preventDefault();
    if (!suspensionReason.trim()) return;

    setActionLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/referrals/${suspendingId}/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason: suspensionReason })
      });
      if (response.ok) {
        setSuspendingId(null);
        fetchDashboardData();
      } else {
        alert('Failed to suspend employer');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnsuspend = async (id) => {
    if (!window.confirm('Are you sure you want to restore this employer?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/referrals/${id}/unsuspend`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        fetchDashboardData();
      } else {
        alert('Failed to unsuspend employer');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Profile Form Handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePastePrevent = (e) => {
    e.preventDefault();
    alert('Security Alert: Copying & pasting sensitive payout fields is disabled to prevent mistakes. Please type manually!');
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    // Double check confirmation values to prevent errors
    if (profileForm.payoutType === 'UPI') {
      if (profileForm.upiId !== profileForm.confirmUpiId) {
        alert('Validation Error: UPI IDs do not match. Please verify and type again.');
        return;
      }
    } else {
      if (profileForm.accountNumber !== profileForm.confirmAccountNumber) {
        alert('Validation Error: Bank Account Numbers do not match. Please verify and type again.');
        return;
      }
    }

    setProfileSaving(true);
    setProfileSuccessMsg('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/agent/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          phone: profileForm.phone,
          dob: profileForm.dob,
          profile_pic: profileForm.profilePic,
          doc_type: profileForm.docType,
          doc_number: profileForm.docNumber,
          payout_type: profileForm.payoutType,
          upi_id: profileForm.payoutType === 'UPI' ? profileForm.upiId : null,
          bank_name: profileForm.payoutType === 'Bank' ? profileForm.bankName : null,
          account_holder: profileForm.payoutType === 'Bank' ? profileForm.accountHolder : null,
          account_number: profileForm.payoutType === 'Bank' ? profileForm.accountNumber : null,
          ifsc_code: profileForm.payoutType === 'Bank' ? profileForm.ifscCode : null,
          micr_code: profileForm.payoutType === 'Bank' ? profileForm.micrCode : null
        })
      });

      if (response.ok) {
        setProfileSuccessMsg('Profile and verified payout details updated successfully!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        alert('Failed to update agent profile settings');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const logoPresets = [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col md:flex-row">

      {/* Sidebar Panel */}
      <aside className="w-full md:w-64 bg-[#f0f3ff] text-slate-700 flex flex-col justify-between border-r border-indigo-100/90 shadow-md md:sticky md:top-0 md:h-screen shrink-0 p-4">
        <div className="space-y-6">
          {/* Brand header */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-indigo-100/80 shadow-2xs">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-primary text-white flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0 border border-slate-100">
              {profileForm.profilePic ? (
                <img src={profileForm.profilePic} alt="Agent Avatar" className="w-full h-full object-cover" />
              ) : (
                'A'
              )}
            </div>
            <div className="overflow-hidden flex-1">
              <h4 className="font-bold text-xs text-slate-900 truncate">Partner Console</h4>
              <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1 truncate">
                <ShieldCheck size={12} className="shrink-0" />
                Affiliate Dashboard
              </span>
            </div>
          </div>

          {/* Tab Navigation links */}
          <nav className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveTab('referrals')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all border-0 cursor-pointer ${activeTab === 'referrals'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-2.5">
                <Users size={16} />
                <span>My Referrals</span>
              </div>
              <ChevronRight size={13} className={activeTab === 'referrals' ? 'opacity-100' : 'opacity-40'} />
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all border-0 cursor-pointer ${activeTab === 'profile'
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                }`}
            >
              <div className="flex items-center gap-2.5">
                <User size={16} />
                <span>Identity & Payout</span>
              </div>
              <ChevronRight size={13} className={activeTab === 'profile' ? 'opacity-100' : 'opacity-40'} />
            </button>
          </nav>

          {/* Quick Stats sidebar widget */}
          <div className="p-3.5 rounded-xl bg-white border border-indigo-100/80 space-y-2.5 shadow-2xs">
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold text-indigo-900/60 uppercase tracking-wider block">
                Your Referral Code
              </span>
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                <span className="font-mono text-xs font-bold text-slate-900 select-all">{stats.referral_code}</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1 text-slate-400 hover:text-slate-900 bg-transparent border-0 cursor-pointer"
                >
                  <Copy size={13} />
                </button>
              </div>
              {copyFeedback && <span className="text-[9px] text-emerald-600 font-bold block mt-1">{copyFeedback}</span>}
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all border-0 shadow-md shadow-primary/20 cursor-pointer"
            >
              <Share2 size={13} />
              {linkFeedback || 'Copy Invite Link'}
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="space-y-2 pt-4 border-t border-indigo-100/80">
          <Link
            to="/jobs"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 text-xs font-bold transition-all no-underline border border-indigo-200/80 shadow-2xs"
          >
            <ExternalLink size={13} />
            Public Job Board
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            style={{ fontSize: '12px', fontFamily: 'var(--font-body)' }}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 font-bold transition-all border border-rose-200/80 shadow-2xs cursor-pointer"
          >
            <LogOut size={13} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="hidden md:flex h-14 bg-white border-b border-slate-200/90 px-6 items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="text-slate-400">Agent Portal</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-extrabold">
              {activeTab === 'referrals' ? 'Overview & Referrals' : 'Identity & Payout Settings'}
            </span>
          </div>
        </header>

        {/* Dynamic content view */}
        <main className="flex-1 p-4 md:p-8 animate-fade-in">
          <div className="max-w-7xl mx-auto space-y-6">

            {activeTab === 'referrals' && (
              <>
                {/* KPI Stats Widgets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-slate-500 font-bold text-xs">Total Referrals</span>
                      <div className="p-2 bg-indigo-50 text-primary rounded-xl"><Users size={16} /></div>
                    </div>
                    <h3 className="h2 text-slate-900">{stats.total_referrals}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Referred business accounts</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-slate-500 font-bold text-xs">Active Affiliates</span>
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 size={16} /></div>
                    </div>
                    <h3 className="h2 text-slate-900">{stats.active_referrals}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Non-suspended companies</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-slate-500 font-bold text-xs">Jobs Published</span>
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Briefcase size={16} /></div>
                    </div>
                    <h3 className="h2 text-slate-900">{stats.total_jobs_posted}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Referred jobs active on platform</p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-slate-500 font-bold text-xs">Referred Earnings</span>
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><IndianRupee size={16} /></div>
                    </div>
                    <h3 className="h2 text-slate-900">₹{stats.earnings}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">Affiliate payout accrued</p>
                  </div>
                </div>

                {/* Referred Employers List */}
                <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                  <div className="p-5 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900">Associated Employers</h3>
                    <p className="text-xs text-slate-500">Track company metrics, posting volume, and moderate referred company profile statuses.</p>
                  </div>

                  {loading ? (
                    <div className="p-12 text-center text-xs text-slate-400 font-bold">Loading dashboard metrics...</div>
                  ) : referrals.length === 0 ? (
                    <div className="p-12 text-center text-xs text-slate-400 font-bold space-y-1">
                      <p>No referred employers registered yet.</p>
                      <p className="font-normal text-slate-400">Share your invite link above to get started!</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                            <th className="p-4 pl-6">Company Name</th>
                            <th className="p-4">Contact</th>
                            <th className="p-4">Date Joined</th>
                            <th className="p-4 text-center">Jobs Published</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 pr-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                          {referrals.map((ref) => (
                            <tr key={ref.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 pl-6 font-bold text-slate-900">{ref.company_name || 'Generic Company'}</td>
                              <td className="p-4">
                                <div>{ref.contact_person}</div>
                                <div className="text-[10px] text-slate-400">{ref.email}</div>
                              </td>
                              <td className="p-4 text-slate-500">{ref.joined_date}</td>
                              <td className="p-4 text-center font-extrabold">{ref.jobs_count}</td>
                              <td className="p-4">
                                {ref.status === 'Active' ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Active
                                  </span>
                                ) : (
                                  <span
                                    title={`Reason: ${ref.suspension_reason}`}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 cursor-help"
                                  >
                                    <AlertTriangle size={11} />
                                    Suspended
                                  </span>
                                )}
                              </td>
                              <td className="p-4 pr-6 text-right">
                                {ref.status === 'Active' ? (
                                  <button
                                    type="button"
                                    onClick={() => handleOpenSuspendModal(ref.id)}
                                    className="px-3.5 py-1.5 text-xs font-bold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200/80 rounded-xl shadow-2xs cursor-pointer transition-all inline-flex items-center"
                                  >
                                    Suspend
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => handleUnsuspend(ref.id)}
                                    className="px-3.5 py-1.5 text-xs font-bold text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-200/80 rounded-xl shadow-2xs cursor-pointer transition-all flex items-center gap-1 inline-flex"
                                  >
                                    <Play size={10} className="fill-emerald-700" />
                                    Unsuspend
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-slate-200/90">
                  <h2 className="h2 text-slate-900">Identity & Payout settings</h2>
                  <p className="body-text text-xs text-slate-500 font-medium mt-0.5">
                    Maintain personal details, configure verified identity papers, and manage secure bank payouts.
                  </p>
                </div>

                {profileSuccessMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 font-semibold text-sm animate-fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    {profileSuccessMsg}
                  </div>
                )}

                <form onSubmit={handleProfileSubmit} className="space-y-6">

                  {/* Personal Identity Details card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-2">
                      <User size={14} className="text-indigo-600" />
                      1. Personal Profile Details
                    </h3>

                    {/* Profile Picture Selector */}
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-slate-700">Choose Profile Photo</label>
                      <div className="flex flex-wrap items-center gap-4">
                        <img
                          src={profileForm.profilePic}
                          alt="Agent Profile avatar"
                          className="w-16 h-16 rounded-full border border-slate-200 object-cover shadow-2xs bg-slate-50"
                        />
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            {logoPresets.map((pic, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setProfileForm(p => ({ ...p, profilePic: pic }))}
                                className={`w-8 h-8 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${profileForm.profilePic === pic ? 'border-primary scale-105 shadow-sm' : 'border-transparent hover:border-slate-300'
                                  }`}
                              >
                                <img src={pic} alt="preset" className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                          <input
                            type="text"
                            name="profilePic"
                            value={profileForm.profilePic}
                            onChange={handleProfileChange}
                            placeholder="Or paste custom image URL..."
                            className="w-72 max-w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-primary text-[10px] font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={profileForm.phone}
                          onChange={handleProfileChange}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Date of Birth (DOB)</label>
                        <input
                          type="date"
                          name="dob"
                          value={profileForm.dob}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Document Verification card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-2">
                      <Shield size={14} className="text-indigo-600" />
                      2. KYC / Document Verification
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Select ID Document Type</label>
                        <select
                          name="docType"
                          value={profileForm.docType}
                          onChange={handleProfileChange}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-bold text-slate-900 bg-white"
                        >
                          <option value="Aadhar">Aadhar Card</option>
                          <option value="PAN">PAN Card</option>
                          <option value="Voter ID">Voter ID</option>
                          <option value="Passport">Passport</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {profileForm.docType} Document Number
                        </label>
                        <input
                          type="text"
                          name="docNumber"
                          value={profileForm.docNumber}
                          onChange={handleProfileChange}
                          placeholder={`Enter your ${profileForm.docType} number`}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bank / Payout Settings card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                    <h3 className="text-xs font-bold text-slate-500 border-b border-slate-100 pb-2 flex items-center gap-2">
                      <CreditCard size={14} className="text-indigo-600" />
                      3. Bank Payout / Payout Details
                    </h3>

                    {/* Payout Type Switcher */}
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setProfileForm(p => ({ ...p, payoutType: 'UPI' }))}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${profileForm.payoutType === 'UPI'
                          ? 'bg-indigo-50 border-primary text-primary'
                          : 'bg-white border-slate-200 text-slate-600'
                          }`}
                      >
                        UPI Address Payout
                      </button>
                      <button
                        type="button"
                        onClick={() => setProfileForm(p => ({ ...p, payoutType: 'Bank' }))}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${profileForm.payoutType === 'Bank'
                          ? 'bg-indigo-50 border-primary text-primary'
                          : 'bg-white border-slate-200 text-slate-600'
                          }`}
                      >
                        Bank Account Transfer
                      </button>
                    </div>

                    {profileForm.payoutType === 'UPI' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-scale-in">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">UPI ID</label>
                          <input
                            type="text"
                            name="upiId"
                            value={profileForm.upiId}
                            onChange={handleProfileChange}
                            onPaste={handlePastePrevent}
                            placeholder="e.g. name@upi"
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm UPI ID</label>
                          <input
                            type="text"
                            name="confirmUpiId"
                            value={profileForm.confirmUpiId}
                            onChange={handleProfileChange}
                            onPaste={handlePastePrevent}
                            placeholder="Re-type UPI ID for confirmation"
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 animate-scale-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Bank Name</label>
                            <input
                              type="text"
                              name="bankName"
                              value={profileForm.bankName}
                              onChange={handleProfileChange}
                              placeholder="e.g. HDFC Bank, ICICI Bank"
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Account Holder Name</label>
                            <input
                              type="text"
                              name="accountHolder"
                              value={profileForm.accountHolder}
                              onChange={handleProfileChange}
                              placeholder="Name as printed on bank passbook"
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Bank Account Number</label>
                            <input
                              type="text"
                              name="accountNumber"
                              value={profileForm.accountNumber}
                              onChange={handleProfileChange}
                              onPaste={handlePastePrevent}
                              placeholder="Enter bank account number"
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Bank Account Number</label>
                            <input
                              type="text"
                              name="confirmAccountNumber"
                              value={profileForm.confirmAccountNumber}
                              onChange={handleProfileChange}
                              onPaste={handlePastePrevent}
                              placeholder="Re-type bank account number"
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Bank IFSC Code</label>
                            <input
                              type="text"
                              name="ifscCode"
                              value={profileForm.ifscCode}
                              onChange={handleProfileChange}
                              placeholder="11-character alphanumeric code"
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">MICR Code (Optional)</label>
                            <input
                              type="text"
                              name="micrCode"
                              value={profileForm.micrCode}
                              onChange={handleProfileChange}
                              placeholder="9-digit numeric bank code"
                              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Form Submission Actions */}
                  <div className="flex justify-end gap-3">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold border-0 shadow-md shadow-primary/20 cursor-pointer disabled:opacity-50"
                    >
                      {profileSaving ? 'Saving details...' : 'Save Settings'}
                    </button>
                  </div>

                </form>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Suspension Reason Prompt Modal */}
      {suspendingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs px-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4 animate-scale-in">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="text-rose-600 animate-pulse" size={18} />
                Confirm Suspension
              </h3>
              <button
                type="button"
                onClick={() => setSuspendingId(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-0"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSuspend} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Reason for Suspension <span className="text-rose-500">*</span></label>
                <textarea
                  required
                  rows={4}
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  placeholder="e.g. Terms of Service violation, suspicious job postings, or payment delinquency..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 text-xs font-medium text-slate-900"
                ></textarea>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Suspending this employer will restrict their workspace operations. This action is tracked under your affiliate account.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSuspendingId(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer transition-all shadow-2xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 text-xs font-bold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200/85 rounded-xl cursor-pointer transition-all shadow-2xs disabled:opacity-50"
                >
                  {actionLoading ? 'Suspending...' : 'Confirm Suspension'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs px-4">
          <div className="bg-white max-w-sm w-full rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5 animate-scale-in text-center">
            <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut size={22} className="ml-0.5" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-slate-900">Confirm Log Out</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed px-2">
                Are you sure you want to end your current session? You will need to enter your credentials to log back in.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer transition-all shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 border-0 rounded-xl cursor-pointer transition-all shadow-md shadow-rose-600/20"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AgentDashboard;
