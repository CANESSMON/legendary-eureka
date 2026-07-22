import React from 'react';
import { useJobs } from '../../context/JobContext';
import { 
  TrendingUp, Users, Eye, Briefcase, Zap, ArrowUpRight, 
  CheckCircle2, Clock, BarChart3, AlertCircle 
} from 'lucide-react';

const EmployerAnalytics = ({ onNavigateToCreate, onNavigateToManage }) => {
  const { getAnalytics, getEmployerJobs, employerProfile } = useJobs();
  const analytics = getAnalytics();
  const employerJobs = getEmployerJobs();

  // Find top performing jobs by views
  const topJobs = [...employerJobs]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  // Calculate max views for chart bar scaling
  const maxViews = Math.max(...employerJobs.map(j => j.views || 0), 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 backdrop-blur-3xl transform skew-x-12 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-indigo-500/30 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-400/30 flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-indigo-400" />
                Verified Employer
              </span>
              <span className="text-slate-400 text-sm font-medium">{employerProfile.industry}</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">{employerProfile.companyName} Workspace</h2>
            <p className="text-indigo-200 mt-1 max-w-xl text-sm">
              Manage your hiring workflow, track candidate engagement, and broadcast high-priority posts.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onNavigateToCreate}
              className="bg-primary hover:bg-primary-hover text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/40 flex items-center gap-2 text-sm border-0 cursor-pointer"
            >
              <Zap size={16} fill="currentColor" />
              Post New Job
            </button>
            <button
              onClick={onNavigateToManage}
              className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl font-semibold transition-all border border-white/20 text-sm cursor-pointer"
            >
              Manage Postings
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Job Postings</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase size={20} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">{analytics.activeJobs}</h3>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight size={12} />
              {analytics.totalJobs} Total
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-2 font-medium">Live openings visible on job board</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">WhatsApp Apply Leads</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">{analytics.totalApplyClicks}</h3>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-2 py-0.5 rounded-full">
              <TrendingUp size={12} />
              Direct Contacts
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-2 font-medium">Verified candidate WhatsApp clicks</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Priority Urgent Posts</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Zap size={20} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="text-3xl font-extrabold text-slate-900">{analytics.urgentCount}</h3>
            <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full uppercase font-bold">
              Urgent
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-2 font-medium">Badged with red urgency highlight</p>
        </div>
      </div>

      {/* Main Analytics Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Visual Performance Chart / Breakdown */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Direct Contact Lead Breakdown</h3>
              <p className="text-xs text-slate-500 font-medium">Verified WhatsApp apply interactions per active job listing</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Users size={14} /> WhatsApp Direct Leads
            </div>
          </div>

          <div className="space-y-5">
            {employerJobs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-medium">
                No job postings created yet. Click "Post New Job" to launch your first opening!
              </div>
            ) : (
              employerJobs.map((job) => {
                const maxClicks = Math.max(...employerJobs.map(j => j.applyClicks || 0), 10);
                const clickPercentage = Math.min(Math.round(((job.applyClicks || 0) / maxClicks) * 100), 100);

                return (
                  <div key={job.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-all">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">{job.title}</span>
                        {job.isUrgent && (
                          <span className="bg-rose-100 text-rose-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wide">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                            Urgent
                          </span>
                        )}
                        {job.isFeatured && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                        <span>{job.applyClicks || 0} WhatsApp Clicks</span>
                      </div>
                    </div>

                    {/* Progress Bar for WhatsApp Clicks */}
                    <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(clickPercentage, 4)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sidebar: Top Posts & Quick Health Check */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="text-amber-500" size={18} />
              Top Contacted Openings
            </h3>
            <div className="space-y-4">
              {topJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{job.title}</h4>
                    <span className="text-xs text-slate-500 font-medium">{job.location} • {job.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-emerald-700">{job.applyClicks || 0} Clicks</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200/60">
            <div className="flex gap-3">
              <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 text-sm">Hiring Tip: Urgent Badges</h4>
                <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                  Adding the <strong className="text-rose-700">"Urgent"</strong> badge to listings increases direct candidate WhatsApp inquiries by up to <strong>45%</strong>!
                </p>
                <button
                  onClick={onNavigateToManage}
                  className="mt-3 text-xs font-extrabold text-amber-900 underline bg-transparent border-0 cursor-pointer hover:text-amber-700"
                >
                  Manage Badges in My Postings →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default EmployerAnalytics;
