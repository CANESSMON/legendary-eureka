import React, { useState } from 'react';
import { useJobs } from '../../context/JobContext';
import EmployerAnalytics from './EmployerAnalytics';
import ManagePostings from './ManagePostings';
import JobPostForm from './JobPostForm';
import CompanyProfile from './CompanyProfile';
import { 
  LayoutDashboard, Briefcase, PlusCircle, Settings, 
  Building2, CheckCircle2, ChevronRight, Bell, Sparkles, UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'postings', 'create', 'profile'
  const [editingJob, setEditingJob] = useState(null);
  const { employerProfile } = useJobs();

  const handleEditJob = (job) => {
    setEditingJob(job);
    setActiveTab('create');
  };

  const handleCreateNew = () => {
    setEditingJob(null);
    setActiveTab('create');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Nav */}
          <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sticky top-24">
            
            {/* Employer Profile Card */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 mb-6 text-center">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md mb-2 overflow-hidden">
                {employerProfile.logo ? (
                  <img src={employerProfile.logo} alt="Company logo" className="w-full h-full object-cover" />
                ) : (
                  employerProfile.companyName.charAt(0)
                )}
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm line-clamp-1">{employerProfile.companyName}</h3>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold mt-1">
                <CheckCircle2 size={12} /> Verified Company
              </span>
            </div>

            {/* Nav Menu Items */}
            <nav className="space-y-1">
              <button
                onClick={() => { setEditingJob(null); setActiveTab('analytics'); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all border-0 cursor-pointer ${
                  activeTab === 'analytics'
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <LayoutDashboard size={18} />
                  <span>Overview & Analytics</span>
                </div>
                <ChevronRight size={14} className={activeTab === 'analytics' ? 'opacity-100' : 'opacity-40'} />
              </button>

              <button
                onClick={() => { setEditingJob(null); setActiveTab('postings'); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all border-0 cursor-pointer ${
                  activeTab === 'postings'
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Briefcase size={18} />
                  <span>My Job Postings</span>
                </div>
                <ChevronRight size={14} className={activeTab === 'postings' ? 'opacity-100' : 'opacity-40'} />
              </button>

              <button
                onClick={handleCreateNew}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all border-0 cursor-pointer ${
                  activeTab === 'create'
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <PlusCircle size={18} />
                  <span>{editingJob ? 'Edit Job Post' : 'Create Job Post'}</span>
                </div>
                <ChevronRight size={14} className={activeTab === 'create' ? 'opacity-100' : 'opacity-40'} />
              </button>

              <button
                onClick={() => { setEditingJob(null); setActiveTab('profile'); }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all border-0 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'bg-primary text-white shadow-md shadow-primary/30'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <UserCheck size={18} />
                  <span>Company Profile</span>
                </div>
                <ChevronRight size={14} className={activeTab === 'profile' ? 'opacity-100' : 'opacity-40'} />
              </button>
            </nav>

            {/* Quick Links */}
            <div className="mt-8 pt-6 border-t border-slate-200/80 space-y-2">
              <Link
                to="/jobs"
                className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-500 hover:text-primary transition-colors no-underline"
              >
                <Sparkles size={14} /> View Public Job Board
              </Link>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-9">
            {activeTab === 'analytics' && (
              <EmployerAnalytics
                onNavigateToCreate={handleCreateNew}
                onNavigateToManage={() => setActiveTab('postings')}
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
                onCancel={() => setActiveTab('postings')}
                onSuccess={() => {
                  setEditingJob(null);
                  setActiveTab('postings');
                }}
              />
            )}

            {activeTab === 'profile' && (
              <CompanyProfile />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};


export default EmployerDashboard;

