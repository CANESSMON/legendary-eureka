import React from 'react';
import { useJobs } from '../../context/JobContext';
import { 
  TrendingUp, Users, Briefcase, Zap, ArrowUpRight, 
  CheckCircle2, AlertCircle, Building2, Flame
} from 'lucide-react';

const EmployerAnalytics = ({ onNavigateToCreate, onNavigateToManage }) => {
  const { getAnalytics, getEmployerJobs, employerProfile } = useJobs();
  const analytics = getAnalytics();
  const employerJobs = getEmployerJobs();

  // Find top performing jobs by WhatsApp apply clicks
  const topJobs = [...employerJobs]
    .sort((a, b) => (b.applyClicks || 0) - (a.applyClicks || 0))
    .slice(0, 4);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Summary Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
              <CheckCircle2 size={12} className="text-indigo-600" />
              Employer Overview
            </span>
            <span className="text-slate-400 text-xs font-semibold">• {employerProfile.industry}</span>
          </div>
          <h2 className="h2 text-slate-900">
            {employerProfile.companyName} Analytics
          </h2>
          <p className="body-text text-slate-500 text-xs mt-0.5">
            Real-time direct WhatsApp candidate lead tracking and job posting metrics.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={onNavigateToCreate}
            className="btn bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1.5 text-xs border-0 cursor-pointer flex-1 sm:flex-initial"
          >
            <Zap size={14} fill="currentColor" />
            Post New Job
          </button>
          <button
            onClick={onNavigateToManage}
            className="btn bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl transition-all text-xs border border-slate-200/80 cursor-pointer flex-1 sm:flex-initial"
          >
            Manage Postings
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Active Job Postings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="meta-text text-slate-500 text-xs font-bold">Active Job Postings</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Briefcase size={20} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="h3 text-slate-900 text-2xl">{analytics.activeJobs}</h3>
            <span className="meta-text text-xs font-bold text-indigo-700 flex items-center gap-0.5 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              <ArrowUpRight size={12} />
              {analytics.totalJobs} Total
            </span>
          </div>
          <p className="body-text text-slate-400 text-xs mt-2 font-medium">Published on public search feed</p>
        </div>

        {/* WhatsApp Apply Leads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="meta-text text-slate-500 text-xs font-bold">WhatsApp Candidate Leads</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="h3 text-slate-900 text-2xl">{analytics.totalApplyClicks}</h3>
            <span className="meta-text text-xs font-bold text-emerald-700 flex items-center gap-0.5 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              <TrendingUp size={12} />
              Direct Contacts
            </span>
          </div>
          <p className="body-text text-slate-400 text-xs mt-2 font-medium">Candidates redirected to WhatsApp contact</p>
        </div>

        {/* Urgent Badged Listings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="meta-text text-slate-500 text-xs font-bold">Urgent Badged Listings</span>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Flame size={20} />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <h3 className="h3 text-slate-900 text-2xl">{analytics.urgentCount}</h3>
            <span className="meta-text text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              Urgent Active
            </span>
          </div>
          <p className="body-text text-slate-400 text-xs mt-2 font-medium">Highlighted with priority urgency tags</p>
        </div>
      </div>

      {/* Main Analytics Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Direct Contact Lead Breakdown */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="h3 text-slate-900 text-lg">Direct WhatsApp Lead Breakdown</h3>
              <p className="body-text text-slate-500 text-xs mt-0.5">Verified candidate apply clicks per active job listing</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shrink-0 w-fit">
              <Users size={14} /> WhatsApp Direct Leads
            </div>
          </div>

          <div className="space-y-4">
            {employerJobs.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-medium text-sm">
                No job postings created yet. Click "Post New Job" to launch your first opening!
              </div>
            ) : (
              employerJobs.map((job) => {
                const maxClicks = Math.max(...employerJobs.map(j => j.applyClicks || 0), 10);
                const clickPercentage = Math.min(Math.round(((job.applyClicks || 0) / maxClicks) * 100), 100);

                return (
                  <div key={job.id} className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 hover:border-slate-300 transition-all">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{job.title}</span>
                        {job.isUrgent && (
                          <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-pulse"></span>
                            Urgent
                          </span>
                        )}
                        {job.isFeatured && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700">
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
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs">
            <h3 className="h3 text-slate-900 text-base mb-4 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Zap className="text-amber-500" size={16} fill="currentColor" />
              Top Inquired Job Openings
            </h3>
            <div className="space-y-3">
              {topJobs.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium">No job postings yet.</p>
              ) : (
                topJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{job.title}</h4>
                      <span className="meta-text text-[11px] text-slate-400 font-medium">{job.location} • {job.type}</span>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <div className="text-xs font-extrabold text-emerald-700">{job.applyClicks || 0} Clicks</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200/70">
            <div className="flex gap-3">
              <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-amber-950 text-xs">Hiring Tip: Urgency Badges</h4>
                <p className="body-text text-[11px] text-amber-900/90 mt-1 leading-relaxed font-medium">
                  Adding the <strong className="text-rose-700">"Urgent"</strong> badge to listings increases direct candidate WhatsApp inquiries by up to <strong>45%</strong>!
                </p>
                <button
                  onClick={onNavigateToManage}
                  className="btn mt-2.5 text-xs font-extrabold text-amber-950 underline bg-transparent border-0 cursor-pointer hover:text-amber-800 p-0"
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

