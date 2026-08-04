import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useJobs } from '../../context/JobContext';
import { 
  Briefcase, MapPin, DollarSign, Flame, Zap, Edit, Trash2, 
  Users, Play, Pause, Plus, Search, CheckCircle2, AlertTriangle, X, Eye, XCircle, Calendar
} from 'lucide-react';

const ManagePostings = ({ onEditJob, onCreateNew }) => {
  const { getEmployerJobs, toggleJobStatus, toggleUrgentBadge, toggleFeaturedBadge, deleteJob, submitAppeal } = useJobs();
  const jobs = getEmployerJobs();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All, Active, Paused, Suspended, Deleted

  // Appeal Modal states
  const [appealJobId, setAppealJobId] = useState(null);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealText, setAppealText] = useState('');
  const [appealJobReason, setAppealJobReason] = useState('');
  const [appealJobTitle, setAppealJobTitle] = useState('');

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status Filter Matching
    const matchesStatus = statusFilter === 'All' 
      ? job.status !== 'Deleted' // Hide Deleted by default in 'All' tab to keep dashboard clean
      : job.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (jobId, title) => {
    if (window.confirm(`Are you sure you want to delete the job posting for "${title}"?`)) {
      deleteJob(jobId);
    }
  };

  const handleOpenAppeal = (job) => {
    setAppealJobId(job.id);
    setAppealJobTitle(job.title);
    setAppealJobReason(job.moderationReason || 'Violates community guidelines.');
    setAppealText(job.appealText || '');
    setShowAppealModal(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200/90">
        <div>
          <h2 className="h2 text-slate-900">My Job Postings</h2>
          <p className="body-text text-xs text-slate-500 font-medium mt-0.5">
            Manage your openings, respond to moderation alerts, and check direct candidate application metrics.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          className="btn bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 text-xs border-0 cursor-pointer w-full md:w-auto justify-center font-bold"
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
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900 bg-white"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {['All', 'Active', 'Paused', 'Suspended', 'Deleted'].map((status) => {
            const displayLabel = status === 'Deleted' ? 'Archived/Deleted' : status;
            // Calculate specific status listing counts
            const count = status === 'All'
              ? jobs.filter(j => j.status !== 'Deleted').length
              : jobs.filter(j => j.status === status).length;
            
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all border cursor-pointer whitespace-nowrap ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {displayLabel} ({count})
              </button>
            );
          })}
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
          {filteredJobs.map((job) => {
            const isSuspended = job.status === 'Suspended';
            const isDeleted = job.status === 'Deleted';

            return (
              <div
                key={job.id}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-2xs hover:shadow-md relative ${
                  isSuspended 
                    ? 'border-l-4 border-l-amber-500 border-amber-200/90 bg-amber-50/10' 
                    : isDeleted 
                      ? 'border-l-4 border-l-slate-400 border-slate-200 opacity-75' 
                      : job.isUrgent 
                        ? 'border-l-4 border-l-rose-500 border-slate-200' 
                        : 'border-slate-200/90'
                }`}
              >
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  {/* Left Info */}
                  <div className="space-y-2.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`job-title text-slate-900 text-base ${isDeleted ? 'line-through text-slate-400' : ''} flex items-center gap-2`}>
                        <span>{job.title}</span>
                        {job.reference_number && (
                          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">{job.reference_number}</span>
                        )}
                      </h3>
                      
                      {/* Status Badge */}
                      <span className={`meta-text text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                        isSuspended 
                          ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                          : isDeleted 
                            ? 'bg-slate-100 text-slate-600 border border-slate-200' 
                            : job.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {isSuspended ? <AlertTriangle size={11} /> : isDeleted ? <XCircle size={11} /> : job.status === 'Active' ? <CheckCircle2 size={11} /> : <Pause size={11} />}
                        {isSuspended ? 'Suspended' : isDeleted ? 'Archived/Deleted' : job.status}
                      </span>

                      {/* Urgent Badge Toggle (Only show if not deleted/suspended) */}
                      {!isSuspended && !isDeleted && (
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
                      )}

                      {/* Featured Badge Toggle (Only show if not deleted/suspended) */}
                      {!isSuspended && !isDeleted && (
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
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                      <span className="meta-text flex items-center gap-1"><MapPin size={13} className="text-slate-400" />{job.location}</span>
                      <span className="meta-text flex items-center gap-1"><Briefcase size={13} className="text-slate-400" />{job.type}</span>
                      <span className="meta-text flex items-center gap-1 font-bold text-slate-800"><DollarSign size={13} className="text-emerald-600" />{job.salary}</span>
                      <span className="meta-text bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-bold text-[10px]">{job.category}</span>
                      <span className="meta-text flex items-center gap-1 text-slate-400"><Calendar size={13} /> Posted: {job.postedDate || 'Recently'}</span>
                    </div>

                    {/* Suspension details under the card */}
                    {isSuspended && (
                      <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl space-y-1 text-xs">
                        <div className="font-extrabold text-amber-950 flex items-center gap-1">
                          <AlertTriangle size={13} />
                          Suspension Reason:
                        </div>
                        <p className="text-slate-700 font-semibold italic">"{job.moderationReason}"</p>
                        
                        {job.appealStatus === 'Pending' ? (
                          <div className="pt-2 border-t border-amber-200/50 text-[10px] text-amber-800 font-extrabold flex items-center gap-1 animate-pulse">
                            ● Your appeal response is pending administrator review.
                          </div>
                        ) : (
                          <div className="pt-1.5 flex gap-2">
                            <button
                              onClick={() => handleOpenAppeal(job)}
                              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[10px] border-0 shadow-xs cursor-pointer transition-all"
                            >
                              Submit Appeal / Response
                            </button>
                          </div>
                        )}
                      </div>
                    )}
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
                      {!isSuspended && !isDeleted ? (
                        <>
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
                        </>
                      ) : isSuspended ? (
                        <button
                          onClick={() => handleOpenAppeal(job)}
                          className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl border border-amber-200 hover:border-amber-300 text-xs font-bold cursor-pointer transition-all flex items-center gap-1"
                        >
                          <Eye size={14} /> Check Status
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400 font-extrabold italic px-2">Archived Listing</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Appeal Moderation Modal */}
      {showAppealModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs px-4 animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Appeal Job Suspension</h3>
              <button 
                onClick={() => { setShowAppealModal(false); setAppealJobId(null); }} 
                className="text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-1 bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/80 text-xs">
              <span className="text-[10px] text-amber-800 font-extrabold block uppercase tracking-wider">Moderation Reason for "{appealJobTitle}"</span>
              <p className="text-slate-700 font-semibold leading-relaxed mt-0.5">"{appealJobReason}"</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Your Response / Appeal Explanation
              </label>
              <textarea
                rows={4}
                value={appealText}
                onChange={(e) => setAppealText(e.target.value)}
                placeholder="Explain why this listing is valid or describe the changes you made to comply with community guidelines..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowAppealModal(false); setAppealJobId(null); }}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer transition-all shadow-2xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (!appealText.trim()) {
                    alert("Please describe your appeal explanation.");
                    return;
                  }
                  await submitAppeal(appealJobId, appealText.trim());
                  setShowAppealModal(false);
                  setAppealJobId(null);
                }}
                className="px-4 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary-hover border-0 rounded-xl cursor-pointer transition-all shadow-md shadow-primary/20"
              >
                Submit Appeal
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ManagePostings;
