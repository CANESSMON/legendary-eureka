import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../../context/JobContext';
import {
  LayoutDashboard, Users, Briefcase, Tags, Building2, LogOut, CheckCircle, XCircle,
  Menu, X, ChevronRight, AlertTriangle, Shield, Eye, Award, ExternalLink, Calendar, MapPin, Landmark, Sparkles, Clock, Trash2
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    token, userRole, logout,
    fetchAdminStats, fetchAdminEmployers, verifyEmployer, updateEmployerSubscription,
    fetchAdminAgents, jobs, toggleFeaturedBadge, deleteJob, toggleJobStatus, fetchCategories, addCategory, deleteCategory,
    plans, fetchPlans, updatePlan, suspendJob, restoreJob, fetchActivityLogs
  } = useJobs();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [employers, setEmployers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');

  // Activity logs states
  const [activityLogs, setActivityLogs] = useState([]);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logRoleFilter, setLogRoleFilter] = useState('ALL');
  const [logActionFilter, setLogActionFilter] = useState('ALL');

  // Navigation & prompt states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Inspector detail modal states
  const [selectedEmployer, setSelectedEmployer] = useState(null);
  const [showEmployerModal, setShowEmployerModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);

  // Suspension prompt states
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendReason, setSuspendReason] = useState('');
  const [jobToSuspend, setJobToSuspend] = useState(null);

  // Plan editing states
  const [selectedEditPlan, setSelectedEditPlan] = useState(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  useEffect(() => {
    if (!token || userRole !== 'SUPER_USER') {
      navigate('/auth');
    }
  }, [token, userRole, navigate]);

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchAdminStats().then(setStats);
    } else if (activeTab === 'employers') {
      fetchAdminEmployers().then(setEmployers);
    } else if (activeTab === 'agents') {
      fetchAdminAgents().then(setAgents);
    } else if (activeTab === 'categories') {
      fetchCategories().then(setCategories);
    } else if (activeTab === 'plans') {
      fetchPlans().then((data) => {
        if (data && data.length > 0 && !selectedEditPlan) {
          setSelectedEditPlan(data[0]);
        }
      });
    } else if (activeTab === 'logs') {
      fetchActivityLogs().then((data) => setActivityLogs(data || []));
    }
  }, [activeTab, token]);

  const handleVerify = async (id) => {
    await verifyEmployer(id);
    fetchAdminEmployers().then(setEmployers).then((updatedEmployers) => {
      if (selectedEmployer && selectedEmployer.id === id) {
        const found = updatedEmployers.find(e => e.id === id);
        if (found) setSelectedEmployer(found);
      }
    });
  };

  const handleSubChange = async (id, plan, status) => {
    await updateEmployerSubscription(id, plan, status);
    fetchAdminEmployers().then(setEmployers).then((updatedEmployers) => {
      if (selectedEmployer && selectedEmployer.id === id) {
        const found = updatedEmployers.find(e => e.id === id);
        if (found) setSelectedEmployer(found);
      }
    });
  };

  const handleAddCategory = async () => {
    if (newCatName.trim()) {
      await addCategory(newCatName.trim());
      setNewCatName('');
      fetchCategories().then(setCategories);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    if (window.confirm(`Are you sure you want to delete the category "${categoryName}"?`)) {
      const response = await deleteCategory(categoryId);
      if (response) {
        if (response.ok) {
          fetchCategories().then(setCategories);
        } else {
          const errData = await response.json();
          alert(errData.detail || "Cannot delete category");
        }
      }
    }
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/auth');
  };

  // Moderation triggers from Modals
  const triggerJobFeatured = async (jobId) => {
    await toggleFeaturedBadge(jobId);
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => ({ ...prev, isFeatured: !prev.isFeatured }));
    }
  };

  const triggerJobStatus = async (jobId) => {
    await toggleJobStatus(jobId);
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => ({ ...prev, status: prev.status === 'Active' ? 'Paused' : 'Active' }));
    }
  };

  const triggerJobDelete = async (jobId) => {
    const success = await deleteJob(jobId);
    if (success) {
      setShowJobModal(false);
      setSelectedJob(null);
    }
  };

  const triggerJobSuspend = async (jobId, reason) => {
    const success = await suspendJob(jobId, reason);
    if (success && selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => ({
        ...prev,
        status: 'Suspended',
        moderationReason: reason,
        appealStatus: null,
        appealText: null
      }));
    }
  };

  const triggerJobRestore = async (jobId) => {
    const success = await restoreJob(jobId);
    if (success && selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => ({
        ...prev,
        status: 'Active',
        moderationReason: null,
        appealStatus: null,
        appealText: null
      }));
    }
  };

  const handleEditPlanField = (field, value) => {
    setSelectedEditPlan(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderOverview = () => {
    if (!stats) return (
      <div className="p-12 text-center text-xs text-slate-400 font-bold">
        Loading system stats...
      </div>
    );
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Employers */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Employers</span>
            <h3 className="h2 text-slate-900 font-black tracking-tight">{stats.total_employers}</h3>
            <p className="text-[10px] text-slate-500 font-medium">Registered companies</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/60 shadow-3xs shrink-0">
            <Building2 size={22} />
          </div>
        </div>

        {/* Total Agents */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Agents</span>
            <h3 className="h2 text-slate-900 font-black tracking-tight">{stats.total_agents}</h3>
            <p className="text-[10px] text-slate-500 font-medium">Affiliate partners</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/60 shadow-3xs shrink-0">
            <Users size={22} />
          </div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Active Jobs</span>
            <h3 className="h2 text-slate-900 font-black tracking-tight">{stats.total_jobs}</h3>
            <p className="text-[10px] text-slate-500 font-medium">Listed vacancies</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/60 shadow-3xs shrink-0">
            <Briefcase size={22} />
          </div>
        </div>

        {/* Total Applications */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Applications</span>
            <h3 className="h2 text-slate-900 font-black tracking-tight">{stats.total_applications}</h3>
            <p className="text-[10px] text-slate-500 font-medium">Candidate submissions</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100/60 shadow-3xs shrink-0">
            <Briefcase size={22} />
          </div>
        </div>
      </div>
    );
  };

  const renderEmployers = () => (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Manage Employers</h3>
          <p className="text-xs text-slate-500">Approve companies, update subscription plans, or inspect individual workspaces.</p>
        </div>
      </div>
      {employers.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 font-bold">No employers registered yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Company</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4">Subscription Settings</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {employers.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors cursor-pointer" onClick={() => { setSelectedEmployer(emp); setShowEmployerModal(true); }}>
                  <td className="p-4 pl-6 font-bold text-slate-900 flex items-center gap-2">
                    <span className="underline decoration-indigo-200 hover:text-primary transition-colors">{emp.company_name}</span>
                  </td>
                  <td className="p-4 text-slate-500" onClick={(e) => e.stopPropagation()}>{emp.email}</td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    {!emp.is_verified ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Unverified
                      </span>
                    ) : emp.status === 'Suspended' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="p-4 flex flex-wrap gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={emp.subscription_plan}
                      onChange={(e) => handleSubChange(emp.id, e.target.value, emp.subscription_status)}
                      className="border border-slate-200 hover:border-slate-300 rounded-lg px-2 py-1 text-xs font-bold bg-white text-slate-800 focus:outline-none"
                    >
                      <option value="Free">Free</option>
                      <option value="Basic">Basic</option>
                      <option value="Premium">Premium</option>
                    </select>
                    <select
                      value={emp.subscription_status}
                      onChange={(e) => handleSubChange(emp.id, emp.subscription_plan, e.target.value)}
                      className="border border-slate-200 hover:border-slate-300 rounded-lg px-2 py-1 text-xs font-bold bg-white text-slate-800 focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2 justify-end">
                      {!emp.is_verified && (
                        <button
                          onClick={() => handleVerify(emp.id)}
                          className="px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-white hover:bg-emerald-50 border border-emerald-200/80 rounded-lg shadow-2xs cursor-pointer transition-all inline-flex items-center"
                        >
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => { setSelectedEmployer(emp); setShowEmployerModal(true); }}
                        className="px-2.5 py-1 text-[10px] font-bold text-primary bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs cursor-pointer transition-all inline-flex items-center gap-1"
                      >
                        <Eye size={12} /> Inspect Workspace
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderAgents = () => (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">Manage Affiliate Agents</h3>
        <p className="text-xs text-slate-500">Track agent metrics, payout details, KYC, and referred businesses. Click on an agent to inspect.</p>
      </div>
      {agents.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 font-bold">No agents registered yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Referral Code</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Referred Count</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {agents.map((ag) => (
                <tr key={ag.id} className="hover:bg-slate-50/60 cursor-pointer" onClick={() => { setSelectedAgent(ag); setShowAgentModal(true); }}>
                  <td className="p-4 pl-6 font-bold text-indigo-600 font-mono">{ag.referral_code}</td>
                  <td className="p-4 text-slate-900">{ag.email}</td>
                  <td className="p-4 text-slate-500">{ag.phone || 'N/A'}</td>
                  <td className="p-4">
                    <span className="inline-flex px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {ag.referred_employers ? ag.referred_employers.length : 0} Linked
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => { setSelectedAgent(ag); setShowAgentModal(true); }}
                      className="px-2.5 py-1 text-[10px] font-bold text-primary bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs cursor-pointer transition-all inline-flex items-center gap-1"
                    >
                      <Eye size={12} /> Inspect Agent
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderJobs = () => (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="p-5 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900">System Job Directory</h3>
        <p className="text-xs text-slate-500">Moderate job listings. Click on any job to view complete description details and take action.</p>
      </div>
      {jobs.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 font-bold">No jobs listed on the platform yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Job Title</th>
                <th className="p-4">Company</th>
                <th className="p-4 text-center">Featured Badge</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/60 cursor-pointer" onClick={() => { setSelectedJob(job); setShowJobModal(true); }}>
                  <td className="p-4 pl-6">
                    <div className="font-bold text-slate-900">{job.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {job.reference_number && (
                        <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">{job.reference_number}</span>
                      )}
                      <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                        <Calendar size={11} />
                        {job.postedDate || 'Recently'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-500">{job.company}</td>
                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex justify-center">
                      {job.isFeatured ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-400 border border-slate-200">
                          Standard
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4" onClick={(e) => e.stopPropagation()}>
                    {job.status === 'Active' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    ) : job.status === 'Suspended' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Suspended {job.appealStatus === 'Pending' && '• Appeal'}
                      </span>
                    ) : job.status === 'Deleted' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Deleted
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                        Paused
                      </span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => { setSelectedJob(job); setShowJobModal(true); }}
                      className="px-2.5 py-1 text-[10px] font-bold text-primary bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs cursor-pointer transition-all inline-flex items-center gap-1"
                    >
                      <Eye size={12} /> View Details
                    </button>
                    {job.status !== 'Deleted' && job.status !== 'Suspended' ? (
                      <button
                        onClick={() => {
                          setJobToSuspend(job.id);
                          setSuspendReason('');
                          setShowSuspendModal(true);
                        }}
                        className="px-2.5 py-1 text-[10px] font-bold text-rose-700 bg-white hover:bg-rose-50 border border-rose-200 rounded-lg shadow-2xs cursor-pointer transition-all inline-flex items-center"
                      >
                        Delete
                      </button>
                    ) : job.status === 'Suspended' ? (
                      <span className="text-[10px] text-amber-700 font-extrabold px-2">Awaiting Appeal</span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-semibold px-2">Archived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const renderCategories = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Add New System Category</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
            placeholder="e.g. Artificial Intelligence, Healthcare, Hospitality..."
          />
          <button
            onClick={handleAddCategory}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold border-0 shadow-md shadow-primary/20 cursor-pointer shrink-0"
          >
            Add Category
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">Job Categories</h3>
          <p className="text-xs text-slate-500">List of categories available for employers to select from when posting jobs.</p>
        </div>
        {categories.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 font-bold">No categories registered yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Category Name</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 pl-6 font-bold text-slate-900">{cat.name}</td>
                    <td className="p-4 pr-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-1.5 px-2.5 text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 cursor-pointer bg-white transition-colors inline-flex items-center gap-1.5 font-bold text-[10px]"
                        title="Delete Category"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
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

  const renderPlans = () => {
    if (!plans || plans.length === 0) return (
      <div className="p-12 text-center text-xs text-slate-400 font-bold">
        Loading subscription plans...
      </div>
    );

    const activePlanToEdit = selectedEditPlan || plans[0];

    const handleSavePlan = async (e) => {
      e.preventDefault();
      setSaveSuccessMsg('');
      const success = await updatePlan(activePlanToEdit.id, activePlanToEdit);
      if (success) {
        setSaveSuccessMsg('Subscription plan updated and synchronized successfully!');
        setTimeout(() => setSaveSuccessMsg(''), 4000);
      }
    };

    const previewFeatures = activePlanToEdit.features
      ? activePlanToEdit.features.split('\n').filter(f => f.trim().length > 0)
      : [];

    const designMap = {
      starter: {
        badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
        buttonText: 'Current Active Plan',
        buttonStyle: 'bg-slate-100 text-slate-600 border border-slate-200 cursor-default',
        isPopular: false
      },
      pro: {
        badgeColor: 'bg-primary/10 text-primary border-primary/20',
        buttonText: 'Upgrade to Pro',
        buttonStyle: 'bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/25 cursor-pointer',
        isPopular: true
      },
      enterprise: {
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        buttonText: 'Contact Support to Upgrade',
        buttonStyle: 'bg-slate-900 hover:bg-slate-800 text-white shadow-md cursor-pointer',
        isPopular: false
      }
    };

    const previewDesign = designMap[activePlanToEdit.id] || {
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      buttonText: 'Subscribe',
      buttonStyle: 'bg-primary hover:bg-primary-hover text-white cursor-pointer',
      isPopular: false
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade-in">
        {/* Left Side: Select Plan and Form */}
        <div className="lg:col-span-7 space-y-6">

          {/* Plan Selector Buttons */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs flex bg-slate-100 gap-2">
            {plans.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => { setSelectedEditPlan(p); setSaveSuccessMsg(''); }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs border transition-all cursor-pointer ${activePlanToEdit.id === p.id
                    ? 'bg-primary border-primary text-white shadow-sm shadow-primary/25'
                    : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSavePlan} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Edit Subscription Plan: {activePlanToEdit.name}
            </h3>

            {saveSuccessMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                {saveSuccessMsg}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Plan Display Name</label>
                <input
                  type="text"
                  required
                  value={activePlanToEdit.name}
                  onChange={(e) => handleEditPlanField('name', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Price Label</label>
                <input
                  type="text"
                  required
                  value={activePlanToEdit.price}
                  onChange={(e) => handleEditPlanField('price', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. Free or ₹1,999"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Billing Period Text</label>
                <input
                  type="text"
                  required
                  value={activePlanToEdit.period || ''}
                  onChange={(e) => handleEditPlanField('period', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                  placeholder="e.g. per month or Forever Free"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  required
                  value={activePlanToEdit.tagline || ''}
                  onChange={(e) => handleEditPlanField('tagline', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Plan Features (One per line)</label>
              <textarea
                rows={5}
                required
                value={activePlanToEdit.features || ''}
                onChange={(e) => handleEditPlanField('features', e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono leading-relaxed"
                placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold border-0 shadow-md shadow-primary/25 cursor-pointer"
              >
                Save Plan Details
              </button>
            </div>
          </form>
        </div>

        {/* Right Side: Live Card Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pl-1">
            <Eye size={12} className="text-primary" />
            Live Client Card Preview
          </div>

          <div
            className={`bg-white rounded-2xl border transition-all p-6 flex flex-col justify-between relative shadow-sm max-w-sm mx-auto ${previewDesign.isPopular ? 'border-2 border-primary ring-4 ring-primary/10 animate-pulse-subtle' : 'border-slate-200/90'
              }`}
          >
            {previewDesign.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full tracking-wide shadow-sm flex items-center gap-1">
                <Sparkles size={11} fill="currentColor" /> Most Popular Choice
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${previewDesign.badgeColor}`}>
                  {activePlanToEdit.name || 'Plan Name'}
                </span>
                {activePlanToEdit.id === 'starter' && (
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    ● Current Active Plan
                  </span>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {activePlanToEdit.price || 'Free'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{activePlanToEdit.period || 'per month'}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{activePlanToEdit.tagline || 'Tagline description'}</p>
              </div>

              <div className="border-t border-slate-100 pt-4 mb-6 space-y-3">
                <span className="text-[11px] font-bold text-slate-400 tracking-wide block">Included Features:</span>
                {previewFeatures.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic">No features defined yet.</p>
                ) : (
                  previewFeatures.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                      <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={15} />
                      <span>{feature}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <button
                type="button"
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all border-0 flex items-center justify-center gap-1.5 ${previewDesign.buttonStyle}`}
              >
                {previewDesign.buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderLogs = () => {
    const filteredLogs = activityLogs.filter(log => {
      const matchesSearch = 
        (log.user_email && log.user_email.toLowerCase().includes(logSearchQuery.toLowerCase())) ||
        (log.details && log.details.toLowerCase().includes(logSearchQuery.toLowerCase())) ||
        (log.action && log.action.toLowerCase().includes(logSearchQuery.toLowerCase())) ||
        (log.entity_id && log.entity_id.toLowerCase().includes(logSearchQuery.toLowerCase()));

      const matchesRole = logRoleFilter === 'ALL' || log.user_role === logRoleFilter;
      const matchesAction = logActionFilter === 'ALL' || log.action === logActionFilter;

      return matchesSearch && matchesRole && matchesAction;
    });

    const getRoleBadgeClass = (role) => {
      switch (role) {
        case 'SUPER_USER':
          return 'bg-rose-50 text-rose-700 border-rose-200';
        case 'EMPLOYER':
          return 'bg-indigo-50 text-indigo-700 border-indigo-200';
        case 'AGENT':
          return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        default:
          return 'bg-slate-50 text-slate-600 border-slate-200';
      }
    };

    const getActionIcon = (action) => {
      if (action.includes('suspend')) return '⚠️';
      if (action.includes('verify')) return '🛡️';
      if (action.includes('create') || action.includes('register')) return '➕';
      if (action.includes('login')) return '🔑';
      if (action.includes('delete')) return '🗑️';
      if (action.includes('update') || action.includes('change') || action.includes('toggle')) return '✏️';
      return '📋';
    };

    const formatLogDate = (dateString) => {
      try {
        const date = new Date(dateString);
        return date.toLocaleString();
      } catch (e) {
        return dateString;
      }
    };

    const uniqueActions = Array.from(new Set(activityLogs.map(l => l.action)));

    return (
      <div className="space-y-6">
        {/* Filter Toolbar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
            <select
              value={logRoleFilter}
              onChange={(e) => setLogRoleFilter(e.target.value)}
              className="border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-bold bg-white text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="SUPER_USER">Super Admin</option>
              <option value="EMPLOYER">Employer</option>
              <option value="AGENT">Agent</option>
              <option value="GUEST">Guest</option>
            </select>

            <select
              value={logActionFilter}
              onChange={(e) => setLogActionFilter(e.target.value)}
              className="border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-2 text-xs font-bold bg-white text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Actions</option>
              {uniqueActions.map(action => (
                <option key={action} value={action}>{action}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              value={logSearchQuery}
              onChange={(e) => setLogSearchQuery(e.target.value)}
              placeholder="Search logs by email, details, ref ID..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Activity Auditing</h3>
              <p className="text-xs text-slate-500">A historical ledger of user, agent, and system actions across the platform.</p>
            </div>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
              {filteredLogs.length} Logs Found
            </span>
          </div>

          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400 font-bold">No activity logs match the selected filter.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-55 border-b border-slate-100 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <th className="p-4 pl-6 w-48 font-black">Timestamp</th>
                    <th className="p-4 w-32 font-black">Actor Role</th>
                    <th className="p-4 w-56 font-black">Actor Email</th>
                    <th className="p-4 font-black">Action Summary</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6 text-slate-500 font-mono text-[10px]">{formatLogDate(log.created_at)}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold border ${getRoleBadgeClass(log.user_role)}`}>
                          {log.user_role}
                        </span>
                      </td>
                      <td className="p-4 text-slate-900 font-medium">{log.user_email}</td>
                      <td className="p-4 flex items-center gap-2">
                        <span className="text-sm shrink-0">{getActionIcon(log.action)}</span>
                        <span className="text-slate-600 font-medium">{log.details}</span>
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

  // Helper values for current selected employer's stats
  const getSelectedEmployerStats = () => {
    if (!selectedEmployer) return { totalJobs: 0, views: 0, applications: 0, conversion: 0, employerJobsList: [] };
    const employerJobsList = jobs.filter(j => j.employerId === selectedEmployer.id || j.company.toLowerCase() === selectedEmployer.company_name.toLowerCase());
    const totalJobs = employerJobsList.length;
    const views = employerJobsList.reduce((sum, j) => sum + (j.views || 0), 0);
    const applications = employerJobsList.reduce((sum, j) => sum + (j.applicantsCount || 0), 0);
    const conversion = views > 0 ? ((applications / views) * 100).toFixed(1) : 0;
    return { totalJobs, views, applications, conversion, employerJobsList };
  };

  const empStats = getSelectedEmployerStats();

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex flex-col md:flex-row">

      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#f0f3ff] text-slate-900 px-4 py-3 flex items-center justify-between shrink-0 shadow-xs border-b border-indigo-100/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-extrabold text-sm overflow-hidden shrink-0 shadow-xs">
            A
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-900">Admin Console</h4>
            <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
              Super User Access
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLogoutClick}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 cursor-pointer bg-white"
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

      {/* Sidebar Panel */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-[#f0f3ff] text-slate-700 flex flex-col justify-between border-r border-indigo-100/90 shadow-md md:shadow-none transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen shrink-0 p-4
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Brand header */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-indigo-100/80 shadow-2xs">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-primary text-white flex items-center justify-center font-extrabold text-sm shadow-sm shrink-0 border border-slate-100">
              A
            </div>
            <div className="overflow-hidden flex-1">
              <h4 className="font-bold text-xs text-slate-900 truncate">Admin Console</h4>
              <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1 truncate">
                <Shield size={12} className="shrink-0" />
                Super User Access
              </span>
            </div>
          </div>

          <div className="p-1">
            <span className="px-3 text-[10px] font-extrabold text-indigo-900/60 tracking-wide block mb-2 uppercase">
              Management Menu
            </span>
            {/* Tab Navigation links */}
            <nav className="space-y-1">
              <button
                type="button"
                onClick={() => { setActiveTab('overview'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all border-0 cursor-pointer ${activeTab === 'overview'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <LayoutDashboard size={16} />
                  <span>Overview</span>
                </div>
                <ChevronRight size={13} className={activeTab === 'overview' ? 'opacity-100' : 'opacity-40'} />
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('employers'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all border-0 cursor-pointer ${activeTab === 'employers'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 size={16} />
                  <span>Employers</span>
                </div>
                <ChevronRight size={13} className={activeTab === 'employers' ? 'opacity-100' : 'opacity-40'} />
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('agents'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all border-0 cursor-pointer ${activeTab === 'agents'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Users size={16} />
                  <span>Agents</span>
                </div>
                <ChevronRight size={13} className={activeTab === 'agents' ? 'opacity-100' : 'opacity-40'} />
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('jobs'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all border-0 cursor-pointer ${activeTab === 'jobs'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Briefcase size={16} />
                  <span>Jobs</span>
                </div>
                <ChevronRight size={13} className={activeTab === 'jobs' ? 'opacity-100' : 'opacity-40'} />
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('categories'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all border-0 cursor-pointer ${activeTab === 'categories'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Tags size={16} />
                  <span>Categories</span>
                </div>
                <ChevronRight size={13} className={activeTab === 'categories' ? 'opacity-100' : 'opacity-40'} />
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('plans'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all border-0 cursor-pointer ${activeTab === 'plans'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Landmark size={16} />
                  <span>Plans</span>
                </div>
                <ChevronRight size={13} className={activeTab === 'plans' ? 'opacity-100' : 'opacity-40'} />
              </button>

              <button
                type="button"
                onClick={() => { setActiveTab('logs'); setMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all border-0 cursor-pointer ${activeTab === 'logs'
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-slate-600 hover:bg-white/80 hover:text-slate-900'
                  }`}
              >
                <div className="flex items-center gap-2.5">
                  <Clock size={16} />
                  <span>Activity Logs</span>
                </div>
                <ChevronRight size={13} className={activeTab === 'logs' ? 'opacity-100' : 'opacity-40'} />
              </button>
            </nav>
          </div>
        </div>

        <div className="border-t border-indigo-100/80 pt-4">
          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all border border-rose-200/80 bg-rose-50/50 hover:bg-rose-50 text-rose-600 cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <LogOut size={16} />
              <span>Logout</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Breadcrumbs bar */}
        <header className="bg-white px-6 py-4 border-b border-indigo-100/80 shadow-3xs shrink-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-extrabold tracking-wide uppercase">
              <span>Admin Console</span>
              <ChevronRight size={10} className="mt-0.5" />
              <span className="text-primary capitalize">{activeTab}</span>
            </div>
            <h1 className="h3 text-slate-900 font-black tracking-tight capitalize">
              {activeTab === 'overview' ? 'System Overview & Stats' : activeTab === 'plans' ? 'Subscription Plans Editor' : activeTab === 'logs' ? 'System Activity Auditing' : `${activeTab} Management`}
            </h1>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'employers' && renderEmployers()}
          {activeTab === 'agents' && renderAgents()}
          {activeTab === 'jobs' && renderJobs()}
          {activeTab === 'categories' && renderCategories()}
          {activeTab === 'plans' && renderPlans()}
          {activeTab === 'logs' && renderLogs()}
        </main>
      </div>

      {/* Inspector Modal: Employer Dashboard Activity */}
      {showEmployerModal && selectedEmployer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs px-4 py-6 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full rounded-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-extrabold text-sm overflow-hidden shrink-0">
                  {selectedEmployer.logo ? (
                    <img src={selectedEmployer.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    selectedEmployer.company_name.charAt(0)
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    {selectedEmployer.company_name} Dashboard Preview
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">Referred by: {selectedEmployer.agent_code || 'Direct signup'}</p>
                </div>
              </div>
              <button onClick={() => { setShowEmployerModal(false); setSelectedEmployer(null); }} className="text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/40">
              {/* Profile Overview Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Industry</span>
                  <span className="text-xs font-bold text-slate-800">{selectedEmployer.industry || 'IT'}</span>
                </div>
                <div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">City</span>
                  <span className="text-xs font-bold text-slate-800">{selectedEmployer.city || 'Bangalore'}</span>
                </div>
                <div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">WhatsApp Number</span>
                  <span className="text-xs font-bold text-slate-800">{selectedEmployer.whatsapp_number || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Address</span>
                  <span className="text-xs font-bold text-slate-800 truncate block" title={selectedEmployer.address}>{selectedEmployer.address || 'N/A'}</span>
                </div>
              </div>

              {/* Analytics Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-3xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Jobs</span>
                  <div className="h3 text-slate-900 font-extrabold mt-1">{empStats.totalJobs}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-3xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Views</span>
                  <div className="h3 text-slate-900 font-extrabold mt-1">{empStats.views}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-3xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Submissions</span>
                  <div className="h3 text-slate-900 font-extrabold mt-1">{empStats.applications}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-3xs">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Conversion Rate</span>
                  <div className="h3 text-slate-900 font-extrabold mt-1">{empStats.conversion}%</div>
                </div>
              </div>

              {/* Job Listings from this employer */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                  <h4 className="text-xs font-bold text-slate-800">Employer Job Postings & Activity</h4>
                </div>
                {empStats.employerJobsList.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 font-bold">This employer hasn't posted any jobs yet.</div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        <th className="p-3 pl-4">Job Title</th>
                        <th className="p-3">Salary Band</th>
                        <th className="p-3 text-center">Views</th>
                        <th className="p-3 text-center">Applications</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 pr-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {empStats.employerJobsList.map(job => (
                        <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 pl-4 font-bold text-slate-900">{job.title}</td>
                          <td className="p-3 text-slate-500">{job.salary}</td>
                          <td className="p-3 text-center text-slate-600">{job.views || 0}</td>
                          <td className="p-3 text-center text-slate-600">{job.applicantsCount || 0}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${job.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-200'}`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="p-3 pr-4 text-right">
                            <button
                              onClick={() => { setSelectedJob(job); setShowJobModal(true); }}
                              className="px-2.5 py-1 text-[9px] font-bold text-primary bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer shadow-3xs"
                            >
                              Inspect Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inspector Modal: Agent Details & Linked Employers Activity */}
      {showAgentModal && selectedAgent && (
        <div className="fixed inset-0 z-[50] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs px-4 py-6 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full rounded-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-extrabold text-sm overflow-hidden shrink-0">
                  {selectedAgent.profile_pic ? (
                    <img src={selectedAgent.profile_pic} alt="Agent Avatar" className="w-full h-full object-cover" />
                  ) : (
                    selectedAgent.referral_code.charAt(selectedAgent.referral_code.length - 1)
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    Agent Console: {selectedAgent.referral_code}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-medium">Email: {selectedAgent.email}</p>
                </div>
              </div>
              <button onClick={() => { setShowAgentModal(false); setSelectedAgent(null); }} className="text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/40">

              {/* Agent Profile & KYC / payout details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Identity */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                  <h4 className="text-xs font-bold text-indigo-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <Shield size={14} /> 1. Personal & KYC Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Phone Number</span>
                      <span className="text-slate-800">{selectedAgent.phone || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Date of Birth</span>
                      <span className="text-slate-800">{selectedAgent.dob || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">KYC Document Type</span>
                      <span className="text-slate-800">{selectedAgent.doc_type || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Document Number</span>
                      <span className="text-slate-800 font-mono">{selectedAgent.doc_number || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Payout details */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
                  <h4 className="text-xs font-bold text-indigo-700 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                    <Landmark size={14} /> 2. Bank / UPI Payout Configurations
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Payout Preference</span>
                      <span className="text-slate-800">{selectedAgent.payout_type || 'UPI'}</span>
                    </div>
                    {selectedAgent.payout_type === 'Bank' ? (
                      <>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Bank Name</span>
                          <span className="text-slate-800">{selectedAgent.bank_name || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Account Holder</span>
                          <span className="text-slate-800">{selectedAgent.account_holder || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Account Number</span>
                          <span className="text-slate-800 font-mono">{selectedAgent.account_number || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">IFSC Code</span>
                          <span className="text-slate-800 font-mono">{selectedAgent.ifsc_code || 'N/A'}</span>
                        </div>
                      </>
                    ) : (
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">UPI VPA Address</span>
                        <span className="text-slate-800 font-mono">{selectedAgent.upi_id || 'N/A'}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Referred Employers details list */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h4 className="text-xs font-bold text-slate-800">Linked referred employers (Activity)</h4>
                  <span className="inline-flex px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px]">
                    {selectedAgent.referred_employers ? selectedAgent.referred_employers.length : 0} Referred
                  </span>
                </div>
                {!selectedAgent.referred_employers || selectedAgent.referred_employers.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 font-bold">This agent hasn't referred any employers yet.</div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                        <th className="p-3 pl-4">Company Name</th>
                        <th className="p-3">Email Address</th>
                        <th className="p-3 text-center">Jobs Posted</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 pr-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {selectedAgent.referred_employers.map(emp => (
                        <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-3 pl-4 font-bold text-slate-900">{emp.company_name}</td>
                          <td className="p-3 text-slate-500">{emp.email}</td>
                          <td className="p-3 text-center text-slate-900 font-extrabold">{emp.jobs_count || 0}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${emp.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                              {emp.status}
                            </span>
                          </td>
                          <td className="p-3 pr-4 text-right">
                            <button
                              onClick={() => {
                                const matchedEmp = employers.find(e => e.id === emp.id);
                                if (matchedEmp) {
                                  setSelectedEmployer(matchedEmp);
                                  setShowEmployerModal(true);
                                } else {
                                  setSelectedEmployer(emp);
                                  setShowEmployerModal(true);
                                }
                              }}
                              className="px-2.5 py-1 text-[9px] font-bold text-primary bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer shadow-3xs"
                            >
                              Inspect Activity
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inspector Modal: Job Details & Moderation Action */}
      {showJobModal && selectedJob && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs px-4 py-6 overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-2xl border border-slate-200 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-scale-in">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Job Posting Moderation Detail</h3>
                <p className="text-[10px] text-slate-400 font-medium">Job Reference ID: {selectedJob.id}</p>
              </div>
              <button onClick={() => { setShowJobModal(false); setSelectedJob(null); }} className="text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">

              {/* Main title block */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="px-2 py-0.5 rounded-md font-bold bg-primary/10 text-primary text-[10px]">{selectedJob.category}</span>
                  <span className="px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-600 text-[10px]">{selectedJob.type}</span>
                  {selectedJob.isFeatured && (
                    <span className="px-2 py-0.5 rounded-md font-bold bg-indigo-100 text-indigo-700 text-[10px]">Featured Banner</span>
                  )}
                </div>
                <h2 className="h3 text-slate-900 font-black tracking-tight">{selectedJob.title}</h2>
                <div className="text-slate-500 font-semibold flex flex-wrap gap-x-4 gap-y-1">
                  <span className="flex items-center gap-1"><Building2 size={13} /> {selectedJob.company}</span>
                  <span className="flex items-center gap-1"><MapPin size={13} /> {selectedJob.location}</span>
                  <span className="flex items-center gap-1"><Landmark size={13} /> {selectedJob.salary}</span>
                  <span className="flex items-center gap-1"><Calendar size={13} /> Posted: {selectedJob.postedDate || 'Recently'}</span>
                </div>
              </div>

              {/* Metrics Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60 grid grid-cols-2 gap-4 text-center font-bold">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Platform Views</span>
                  <div className="text-base text-slate-900 mt-0.5">{selectedJob.views || 0}</div>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider block">Applicants / Clicks</span>
                  <div className="text-base text-slate-900 mt-0.5">{selectedJob.applicantsCount || 0}</div>
                </div>
              </div>

              {/* Moderation Warning Banners */}
              {selectedJob.status === 'Suspended' && (
                <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl space-y-2">
                  <div className="font-extrabold flex items-center gap-1">
                    <AlertTriangle size={15} className="text-amber-600" />
                    Job Suspended by Administration
                  </div>
                  <div className="text-[11px] font-medium leading-relaxed">
                    <strong>Reason:</strong> {selectedJob.moderationReason}
                  </div>
                  {selectedJob.appealStatus === 'Pending' ? (
                    <div className="pt-2 border-t border-amber-200/60 text-[11px] font-medium">
                      <strong className="text-amber-950 block mb-1">Employer Appeal response:</strong>
                      <p className="mt-1 bg-white p-2.5 rounded-lg border border-amber-200/50 italic text-slate-700 text-xs">
                        "{selectedJob.appealText}"
                      </p>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-500 font-semibold italic">Awaiting appeal response from employer...</div>
                  )}
                </div>
              )}

              {selectedJob.status === 'Deleted' && (
                <div className="p-4 bg-slate-50 border border-slate-200 text-slate-600 rounded-xl flex items-center gap-2 font-extrabold">
                  <XCircle size={16} className="text-slate-400" />
                  This listing has been permanently deleted/archived.
                </div>
              )}

              {/* Description */}
              <div className="space-y-1.5">
                <h4 className="text-slate-800 font-bold">Job Description:</h4>
                <p className="text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  {selectedJob.description || 'No description provided.'}
                </p>
              </div>

              {/* Requirements */}
              <div className="space-y-1.5">
                <h4 className="text-slate-800 font-bold">Skills & Requirements:</h4>
                <p className="text-slate-600 font-medium leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  {selectedJob.requirements || 'Key Skills: Communication, Problem Solving, Domain Expertise.'}
                </p>
              </div>
            </div>

            {/* Actions panel */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-3 shrink-0">
              {selectedJob.status === 'Suspended' ? (
                <>
                  <button
                    onClick={() => triggerJobDelete(selectedJob.id)}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200/80 cursor-pointer transition-all"
                  >
                    Confirm Permanent Deletion
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => triggerJobRestore(selectedJob.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold border-0 shadow-md shadow-emerald-600/20 cursor-pointer transition-all"
                    >
                      Approve & Restore Listing
                    </button>
                  </div>
                </>
              ) : selectedJob.status === 'Deleted' ? (
                <div className="text-[10px] text-slate-400 font-semibold italic">No actions available for archived posts.</div>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setJobToSuspend(selectedJob.id);
                      setSuspendReason('');
                      setShowSuspendModal(true);
                    }}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200/80 cursor-pointer transition-all"
                  >
                    Suspend & Flag Listing
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => triggerJobStatus(selectedJob.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${selectedJob.status === 'Active'
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                        }`}
                    >
                      {selectedJob.status === 'Active' ? 'Pause Listing' : 'Resume Listing'}
                    </button>
                    <button
                      onClick={() => triggerJobFeatured(selectedJob.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-all ${selectedJob.isFeatured
                          ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
                          : 'bg-primary hover:bg-primary-hover text-white border-0'
                        }`}
                    >
                      {selectedJob.isFeatured ? 'Remove Featured' : 'Promote to Featured'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs px-4 animate-fade-in">
          <div className="bg-white max-w-sm w-full rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5 text-center">
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
                onClick={confirmLogout}
                className="px-4 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 border-0 rounded-xl cursor-pointer transition-all shadow-md shadow-rose-600/20"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Reason Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs px-4 animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-900">Suspend Job Listing</h3>
              <button onClick={() => { setShowSuspendModal(false); setJobToSuspend(null); }} className="text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Describe the reason for suspending this job posting. The employer will be notified and given the option to appeal.
            </p>

            <textarea
              rows={4}
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="e.g. Job details violate posting guidelines. Salary details are suspicious or invalid."
              className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-semibold text-slate-900 bg-white"
            />

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => { setShowSuspendModal(false); setJobToSuspend(null); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!suspendReason.trim()) {
                    alert("Please provide a reason.");
                    return;
                  }
                  await triggerJobSuspend(jobToSuspend, suspendReason.trim());
                  setShowSuspendModal(false);
                  setJobToSuspend(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold border-0 shadow-md shadow-rose-600/20 cursor-pointer transition-all"
              >
                Confirm Suspension
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
