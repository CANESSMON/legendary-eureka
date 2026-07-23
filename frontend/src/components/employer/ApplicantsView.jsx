import React, { useState } from 'react';
import { useJobs } from '../../context/JobContext';
import { Users, Mail, Clock, Download, CheckCircle, FileText, ArrowLeft, Search, Filter } from 'lucide-react';

const ApplicantsView = ({ jobFilter = null, onBack }) => {
  const { getEmployerJobs } = useJobs();
  const employerJobs = getEmployerJobs();

  // Combine all applicants or filter by specific job
  const allApplicants = employerJobs.flatMap((job) =>
    (job.applicants || []).map((app) => ({
      ...app,
      jobTitle: job.title,
      jobId: job.id,
      category: job.category
    }))
  );

  const [selectedJobId, setSelectedJobId] = useState(jobFilter ? jobFilter.id : 'ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const displayApplicants = allApplicants.filter((app) => {
    const matchesJob = selectedJobId === 'ALL' || app.jobId === selectedJobId;
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesJob && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-2 bg-transparent border-0 cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          )}
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Users className="text-primary" size={24} />
            Candidate Applications ({displayApplicants.length})
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Review applicant resumes and track recruitment pipelines.
          </p>
        </div>

        {/* Filter dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Jobs ({employerJobs.length})</option>
            {employerJobs.map((j) => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {displayApplicants.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="font-bold text-slate-700">No candidate applications found.</p>
            <p className="text-xs text-slate-500 mt-1">Applications received from job seekers will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 tracking-wide">
                  <th className="py-4 px-6">Candidate</th>
                  <th className="py-4 px-6">Applied For</th>
                  <th className="py-4 px-6">Experience</th>
                  <th className="py-4 px-6">Applied Date</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium">
                {displayApplicants.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-bold text-slate-900">{app.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail size={12} className="text-slate-400" />
                          {app.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {app.jobTitle}
                    </td>
                    <td className="py-4 px-6 text-slate-600 text-xs">
                      {app.experience}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs">
                      {app.appliedDate}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        app.status === 'Shortlisted'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : app.status === 'Under Review'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); alert(`Downloading resume for ${app.name}`); }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover bg-primary/10 px-3 py-1.5 rounded-xl no-underline"
                      >
                        <Download size={14} />
                        Resume
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsView;
