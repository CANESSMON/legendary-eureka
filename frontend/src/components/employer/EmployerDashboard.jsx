import React, { useState } from 'react';
import { useJobs } from '../../context/JobContext';
import EmployerAnalytics from './EmployerAnalytics';
import ManagePostings from './ManagePostings';
import JobPostForm from './JobPostForm';
import CompanyProfile from './CompanyProfile';
import EmployerPlans from './EmployerPlans';
import { 
  LayoutDashboard, Briefcase, PlusCircle, 
  UserCheck, ChevronRight, ExternalLink, Menu, X,
  CreditCard, LogOut, AlertTriangle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'postings', 'create', 'plans', 'profile'
  const [editingJob, setEditingJob] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { employerProfile, getEmployerJobs } = useJobs();
  const employerJobs = getEmployerJobs();
  const navigate = useNavigate();

  // Completion calculation for popup warning prompt
  const profileFields = [
    employerProfile.fullName,
    employerProfile.companyName,
    employerProfile.logo,
    employerProfile.establishmentYear,
    employerProfile.city,
    employerProfile.address,
    employerProfile.whatsappNumber
  ];
  const filledFieldsCount = profileFields.filter(f => f && String(f).trim().length > 0).length;
  const completionPercentage = Math.round((filledFieldsCount / profileFields.length) * 100);

  const [showProfilePrompt, setShowProfilePrompt] = useState(() => {
    const dismissed = sessionStorage.getItem('profile_prompt_dismissed');
    return dismissed !== 'true';
  });

  const handleDismissPrompt = () => {
    sessionStorage.setItem('profile_prompt_dismissed', 'true');
    setShowProfilePrompt(false);
  };

  const handleNavigateToProfile = () => {
    handleDismissPrompt();
    setActiveTab('profile');
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setActiveTab('create');
    setMobileMenuOpen(false);
  };

  const handleCreateNew = () => {
    setEditingJob(null);
    setActiveTab('create');
    setMobileMenuOpen(false);
  };

  const handleTabChange = (tab) => {
    if (tab !== 'create') setEditingJob(null);
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'analytics': return 'Overview & Analytics';
      case 'postings': return 'My Job Postings';
      case 'create': return editingJob ? 'Edit Job Posting' : 'Create Job Posting';
      case 'plans': return 'Employer Subscription & Plans';
      case 'profile': return 'Company Profile Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col md:flex-row">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#f0f3ff] text-slate-900 px-4 py-3 flex items-center justify-between shrink-0 shadow-xs border-b border-indigo-100/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-extrabold text-sm overflow-hidden shrink-0 shadow-xs">
            {employerProfile.logo ? (
              <img src={employerProfile.logo} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              employerProfile.companyName.charAt(0)
            )}
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900 truncate max-w-[160px]">
              {employerProfile.companyName}
            </h4>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Verified Employer
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 cursor-pointer"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-700 hover:text-slate-900 bg-white rounded-xl border border-indigo-100 shadow-2xs cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#f0f3ff] text-slate-700 flex flex-col justify-between border-r border-indigo-100/90 shadow-md md:shadow-none transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen shrink-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="p-4 border-b border-indigo-100/80">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/80 border border-indigo-100/80 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-primary text-white flex items-center justify-center font-extrabold text-sm shadow-sm overflow-hidden shrink-0">
                {employerProfile.logo ? (
                  <img src={employerProfile.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  employerProfile.companyName.charAt(0)
                )}
              </div>
              <div className="overflow-hidden flex-1">
                <h4 className="font-bold text-xs text-slate-900 truncate">
                  {employerProfile.companyName}
                </h4>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Verified Business
                </span>
              </div>
            </div>
          </div>

          <div className="p-3">
            <span className="px-3 text-[10px] font-extrabold text-indigo-900/60 tracking-wide block mb-2 uppercase">
              Employer Console
            </span>
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => handleTabChange('analytics')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all border-0 cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard size={16} />
                  <span>Overview & Analytics</span>
                </div>
                <ChevronRight size={13} className={activeTab === 'analytics' ? 'opacity-100' : 'opacity-40'} />
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('postings')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all border-0 cursor-pointer ${
                  activeTab === 'postings'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase size={16} />
                  <span>My Job Postings</span>
                </div>
                <ChevronRight size={13} className={activeTab === 'postings' ? 'opacity-100' : 'opacity-40'} />
              </button>

              <button
                type="button"
                onClick={handleCreateNew}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all border-0 cursor-pointer ${
                  activeTab === 'create'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <PlusCircle size={16} />
                  <span>{editingJob ? 'Edit Job Post' : 'Create Job Post'}</span>
                </div>
                <ChevronRight size={13} className={activeTab === 'create' ? 'opacity-100' : 'opacity-40'} />
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('plans')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all border-0 cursor-pointer ${
                  activeTab === 'plans'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <CreditCard size={16} />
                  <span>Buy Plans</span>
                </div>
                <ChevronRight size={13} className={activeTab === 'plans' ? 'opacity-100' : 'opacity-40'} />
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('profile')}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all border-0 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck size={16} />
                  <span>Company Profile</span>
                </div>
                <ChevronRight size={13} className={activeTab === 'profile' ? 'opacity-100' : 'opacity-40'} />
              </button>
            </nav>
          </div>
        </div>

        <div className="p-3 border-t border-indigo-100/80 space-y-2">
          <div className="p-3 rounded-xl bg-white/80 border border-indigo-100/80 text-slate-600 text-[11px] font-medium space-y-1.5 shadow-2xs">
            <div className="flex justify-between items-center text-slate-900 font-bold">
              <span>Employer Quick Stats</span>
              <span className="text-emerald-600 flex items-center gap-1 text-[10px]">● Active</span>
            </div>
            <p className="text-[10px] leading-relaxed text-slate-500">
              {employerJobs.length} Job Postings • Direct WhatsApp candidate redirection enabled
            </p>
          </div>

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

      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 md:hidden"
        ></div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Top Header Navbar */}
        <header className="hidden md:flex h-14 bg-white border-b border-slate-200/90 px-6 items-center justify-between shadow-2xs">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span className="text-slate-400">Employer Portal</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-extrabold">{getBreadcrumbTitle()}</span>
          </div>
        </header>

        {/* Dynamic View Container */}
        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {employerProfile.status === 'Suspended' && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-start gap-3 font-semibold text-xs animate-fade-in shadow-2xs">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <h4 className="font-extrabold text-rose-950 text-sm">Account Moderated / Suspended</h4>
                  <p className="text-rose-850 font-medium">
                    This business workspace has been suspended by your affiliate partner agent. Reason: <strong>{employerProfile.suspension_reason || 'Terms of Service violation'}</strong>. Please connect with your referral manager for resolution.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <EmployerAnalytics
                onNavigateToCreate={handleCreateNew}
                onNavigateToManage={() => handleTabChange('postings')}
              />
            )}

            {activeTab === 'postings' && (
              <ManagePostings
                onEditJob={handleEditJob}
                onCreateNew={handleCreateNew}
              />
            )}

            {activeTab === 'create' && (
              <JobPostForm
                initialJob={editingJob}
                onCancel={() => handleTabChange('postings')}
                onSuccess={() => {
                  setEditingJob(null);
                  handleTabChange('postings');
                }}
              />
            )}

            {activeTab === 'plans' && (
              <EmployerPlans />
            )}

            {activeTab === 'profile' && (
              <CompanyProfile />
            )}
          </div>
        </main>
      </div>

      {/* Incomplete Profile Popup Warning Prompt */}
      {showProfilePrompt && completionPercentage < 100 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs px-4">
          <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200/90 shadow-2xl p-6 space-y-4 animate-scale-in text-center">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto border border-amber-100">
              <UserCheck size={22} />
            </div>
            
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">Complete Your Profile</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed px-2">
                Your company profile is only <span className="text-amber-600 font-bold">{completionPercentage}%</span> complete. Fill in your details to build trust and post jobs.
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 px-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span>Profile Completion</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleDismissPrompt}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-500 text-xs font-bold transition-all bg-white hover:bg-slate-50 cursor-pointer"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={handleNavigateToProfile}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all border-0 shadow-md shadow-primary/20 cursor-pointer"
              >
                Complete Profile
              </button>
            </div>
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
                Are you sure you want to log out of the Employer Console? You will need to enter your credentials to log back in.
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
                  sessionStorage.removeItem('profile_prompt_dismissed');
                  localStorage.removeItem('token');
                  localStorage.removeItem('userRole');
                  window.location.href = '/';
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

export default EmployerDashboard;
