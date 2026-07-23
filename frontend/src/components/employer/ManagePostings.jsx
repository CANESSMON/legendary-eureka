import React, { useState } from 'react';
import { useJobs } from '../../context/JobContext';
import { 
  Briefcase, MapPin, DollarSign, Flame, Zap, Edit, Trash2, 
  Users, Play, Pause, Plus, Search, CheckCircle2
} from 'lucide-react';

const ManagePostings = ({ onEditJob, onCreateNew }) => {
  const { getEmployerJobs, toggleJobStatus, toggleUrgentBadge, toggleFeaturedBadge, deleteJob } = useJobs();
  const jobs = getEmployerJobs();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Active, Paused, Closed

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (jobId, title) => {
    if (window.confirm(`Are you sure you want to delete the job posting for "${title}"?`)) {
      deleteJob(jobId);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200/90">
        <div>
          <h2 className="h2 text-slate-900">My Job Postings</h2>
          <p className="body-text text-xs text-slate-500 font-medium mt-0.5">
            Manage your active openings, update urgency badges, and track direct WhatsApp leads.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="btn bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 text-xs border-0 cursor-pointer w-full md:w-auto justify-center"
        >
          <Plus size={16} />
          Create Job Post
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-2.5 text-slate-400" size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location, category..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['All', 'Active', 'Paused'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {status} {status === 'All' ? `(${jobs.length})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Job Postings List */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-2xs">
          <Briefcase size={36} className="mx-auto text-slate-300 mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Job Postings Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-5">
            {searchQuery || statusFilter !== 'All'
              ? 'Try adjusting your search query or status filter.'
              : 'You have not posted any jobs yet. Create your first opening to attract top candidates.'}
          </p>
          <button
            onClick={onCreateNew}
            className="bg-primary text-white font-bold px-5 py-2.5 rounded-xl text-xs border-0 cursor-pointer shadow-md shadow-primary/20"
          >
            Post a Job Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className={`bg-white rounded-2xl border transition-all p-5 shadow-2xs hover:shadow-md relative ${
                job.isUrgent ? 'border-l-4 border-l-rose-500 border-slate-200' : 'border-slate-200/90'
              }`}
            >
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                {/* Left Info */}
                <div className="space-y-2.5 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="job-title text-slate-900 text-base">{job.title}</h3>
                    
                    {/* Status Badge */}
                    <span className={`meta-text text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      job.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {job.status === 'Active' ? <CheckCircle2 size={11} /> : <Pause size={11} />}
                      {job.status}
                    </span>

                    {/* Urgent Badge Toggle */}
                    <button
                      onClick={() => toggleUrgentBadge(job.id)}
                      title="Click to toggle Urgent badge"
                      className={`btn text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-all border ${
                        job.isUrgent
                          ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                          : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      <Flame size={11} fill={job.isUrgent ? "currentColor" : "none"} />
                      {job.isUrgent ? 'Urgent' : '+ Add Urgent Tag'}
                    </button>

                    {/* Featured Badge Toggle */}
                    <button
                      onClick={() => toggleFeaturedBadge(job.id)}
                      title="Click to toggle Featured status"
                      className={`btn text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 cursor-pointer transition-all border ${
                        job.isFeatured
                          ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                          : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                      }`}
                    >
                      <Zap size={11} fill={job.isFeatured ? "currentColor" : "none"} />
                      {job.isFeatured ? 'Featured' : '+ Feature'}
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                    <span className="meta-text flex items-center gap-1"><MapPin size={13} className="text-slate-400" />{job.location}</span>
                    <span className="meta-text flex items-center gap-1"><Briefcase size={13} className="text-slate-400" />{job.type}</span>
                    <span className="meta-text flex items-center gap-1 font-bold text-slate-800"><DollarSign size={13} className="text-emerald-600" />{job.salary}</span>
                    <span className="meta-text bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold text-[10px]">{job.category}</span>
                  </div>
                </div>

                {/* Right Metrics & Quick Actions */}
                <div className="flex flex-wrap items-center gap-5 w-full lg:w-auto justify-between lg:justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  {/* WhatsApp Apply Clicks Count */}
                  <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200/90 text-center shrink-0">
                    <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 justify-center">
                      <Users size={12} /> WhatsApp Clicks
                    </div>
                    <div className="text-sm font-extrabold text-emerald-950">{job.applyClicks || 0}</div>
                  </div>

                  {/* Actions Group */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Pause / Resume Button */}
                    <button
                      onClick={() => toggleJobStatus(job.id)}
                      title={job.status === 'Active' ? 'Pause Posting' : 'Activate Posting'}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        job.status === 'Active'
                          ? 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                      }`}
                      aria-label={job.status === 'Active' ? 'Pause Posting' : 'Activate Posting'}
                    >
                      {job.status === 'Active' ? <Pause size={15} /> : <Play size={15} />}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => onEditJob(job)}
                      title="Edit Job Post"
                      className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
                      aria-label="Edit Job Post"
                    >
                      <Edit size={15} />
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(job.id, job.title)}
                      title="Delete Job Post"
                      className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                      aria-label="Delete Job Post"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManagePostings;

