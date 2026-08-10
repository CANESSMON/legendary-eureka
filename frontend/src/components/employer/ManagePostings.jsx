import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useJobs } from '../../context/JobContext';
import { 
  Briefcase, MapPin, DollarSign, Flame, Zap, Edit, Trash2, 
  Play, Pause, Plus, Search, CheckCircle2, AlertTriangle, X, Eye, XCircle, Calendar,
  ChevronLeft, ChevronRight, Star, Monitor
} from 'lucide-react';

const PAGE_SIZE = 3;

/* ── Custom green WhatsApp SVG icon ── */
const WhatsAppIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ color: '#16A34A', flexShrink: 0 }}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="currentColor"/>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.665 0-3.218-.503-4.512-1.363l-.288-.172-2.988.784.797-2.912-.189-.3A7.963 7.963 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" fill="currentColor"/>
  </svg>
);

/* ── Component styles ── */
const styles = {
  wrapper: {
    fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: '#172033',
    width: '100%',
  },
  headerArea: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    flexWrap: 'wrap',
    gap: 16,
  },
  headerTitle: {
    fontFamily: "'Manrope', sans-serif",
    fontSize: 28,
    fontWeight: 800,
    lineHeight: 1.2,
    color: '#172033',
    margin: 0,
    letterSpacing: '-0.02em',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    margin: '6px 0 0 0',
    fontWeight: 400,
    lineHeight: 1.5,
  },
  createBtn: {
    background: '#6366F1',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 600,
    height: 44,
    padding: '0 18px',
    borderRadius: 10,
    border: 'none',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    transition: 'all 0.2s ease',
  },
  divider: {
    height: 1,
    background: '#E2E8F0',
    marginBottom: 32,
  },
  toolbar: (isMobile) => ({
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'stretch' : 'center',
    gap: 20,
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: 24,
  }),
  searchField: (isMobile) => ({
    flex: isMobile ? '1 1 100%' : '0 1 40%',
    position: 'relative',
    width: '100%',
  }),
  searchInput: {
    height: 48,
    width: '100%',
    padding: '0 16px 0 44px',
    border: '1px solid #D9E2EC',
    borderRadius: 12,
    background: '#FFFFFF',
    fontSize: 13,
    color: '#172033',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94A3B8',
    pointerEvents: 'none',
  },
  tabsContainer: (isMobile) => ({
    display: 'flex',
    gap: 8,
    marginLeft: isMobile ? '0' : 'auto',
    width: isMobile ? '100%' : 'auto',
    overflowX: 'auto',
    paddingBottom: isMobile ? 4 : 0,
  }),
  tab: (active) => ({
    height: 48,
    padding: '0 18px',
    borderRadius: 12,
    fontWeight: 600,
    fontSize: 13,
    cursor: 'pointer',
    border: active ? 'none' : '1px solid #E2E8F0',
    background: active ? '#172033' : '#F8FAFC',
    color: active ? '#FFFFFF' : '#475569',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    fontFamily: 'inherit',
  }),
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  card: (isMobile) => ({
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 18,
    padding: 24,
    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
    transition: 'all 0.2s ease',
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'minmax(0, 1fr) auto',
    gap: 24,
    alignItems: 'center',
    position: 'relative',
    boxSizing: 'border-box',
  }),
  cardLeft: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  cardTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  cardTitle: {
    fontFamily: "'Manrope', sans-serif",
    fontSize: 17,
    fontWeight: 700,
    color: '#172033',
    margin: 0,
    lineHeight: 1.25,
  },
  jobIdBadge: {
    background: '#F1F5F9',
    color: '#64748B',
    fontSize: 11,
    fontWeight: 600,
    borderRadius: 6,
    padding: '4px 8px',
  },
  statusActive: {
    height: 28,
    borderRadius: 999,
    padding: '0 10px',
    background: '#ECFDF5',
    border: '1px solid #A7F3D0',
    color: '#047857',
    fontSize: 11,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  },
  statusSuspended: {
    height: 28,
    borderRadius: 999,
    padding: '0 10px',
    background: '#FFF1F2',
    border: '1px solid #FECDD3',
    color: '#E11D48',
    fontSize: 11,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  },
  statusPaused: {
    height: 28,
    borderRadius: 999,
    padding: '0 10px',
    background: '#F1F5F9',
    border: '1px solid #E2E8F0',
    color: '#475569',
    fontSize: 11,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  },
  urgentBadge: {
    height: 28,
    borderRadius: 999,
    padding: '0 10px',
    background: '#FFF1F2',
    border: '1px solid #FECDD3',
    color: '#E11D48',
    fontSize: 11,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
  },
  urgentBadgeInactive: {
    height: 28,
    borderRadius: 999,
    padding: '0 10px',
    background: '#FFFFFF',
    border: '1px dashed #FECDD3',
    color: '#E11D48',
    fontSize: 11,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    opacity: 0.6,
  },
  featuredBadge: {
    height: 28,
    borderRadius: 999,
    padding: '0 10px',
    background: '#FFF7ED',
    border: '1px solid #FED7AA',
    color: '#C2410C',
    fontSize: 11,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
  },
  featuredBadgeInactive: {
    height: 28,
    borderRadius: 999,
    padding: '0 10px',
    background: '#FFFFFF',
    border: '1px dashed #FED7AA',
    color: '#C2410C',
    fontSize: 11,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    opacity: 0.6,
  },
  metaRowsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  metaRow1: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px 24px',
    alignItems: 'center',
  },
  metaRow2: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px 16px',
    alignItems: 'center',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 13,
    color: '#64748B',
  },
  metaItemValue: {
    fontWeight: 600,
    color: '#172033',
  },
  categoryBadge: {
    background: '#F1F5F9',
    color: '#64748B',
    borderRadius: 6,
    padding: '4px 8px',
    fontSize: 11,
    fontWeight: 600,
  },
  cardRight: (isMobile) => ({
    display: 'flex',
    flexDirection: isMobile ? 'row' : 'row',
    alignItems: 'center',
    gap: 24,
    justifyContent: isMobile ? 'space-between' : 'flex-end',
    width: isMobile ? '100%' : 'auto',
    borderTop: isMobile ? '1px solid #E2E8F0' : 'none',
    paddingTop: isMobile ? 16 : 0,
  }),
  verticalDivider: {
    width: 1,
    height: 48,
    background: '#E2E8F0',
  },
  whatsappMetric: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    textAlign: 'center',
  },
  whatsappNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#172033',
    lineHeight: 1.1,
  },
  whatsappLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  actionsGroup: (isMobile, isDeleted) => ({
    display: 'flex',
    gap: 8,
    width: isMobile ? 'auto' : 148,
    justifyContent: isMobile ? 'flex-start' : (isDeleted ? 'center' : 'flex-end'),
    alignItems: 'center',
  }),
  actionBtn: () => ({
    width: 44,
    height: 44,
    borderRadius: 10,
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }),
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 32,
    flexWrap: 'wrap',
    gap: 16,
  },
  footerText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: 500,
  },
  paginationContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  paginationBtn: (active) => ({
    width: 38,
    height: 38,
    borderRadius: 10,
    border: active ? '2px solid #6366F1' : '1px solid #E2E8F0',
    background: active ? '#EEF2FF' : '#FFFFFF',
    color: active ? '#6366F1' : '#475569',
    fontWeight: active ? 700 : 500,
    fontSize: 13,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  }),
  paginationNavBtn: (disabled) => ({
    height: 38,
    padding: '0 16px',
    borderRadius: 10,
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    color: disabled ? '#CBD5E1' : '#475569',
    fontWeight: 600,
    fontSize: 13,
    cursor: disabled ? 'default' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.5 : 1,
    fontFamily: 'inherit',
  }),
};

const ManagePostings = ({ onEditJob, onCreateNew }) => {
  const { getEmployerJobs, toggleJobStatus, toggleUrgentBadge, toggleFeaturedBadge, deleteJob, submitAppeal } = useJobs();
  const jobs = getEmployerJobs();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // Appeal Modal states
  const [appealJobId, setAppealJobId] = useState(null);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [appealText, setAppealText] = useState('');
  const [appealJobReason, setAppealJobReason] = useState('');
  const [appealJobTitle, setAppealJobTitle] = useState('');

  // Responsive hooks
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filtering
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          job.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' 
      ? true // Show all jobs in the 'All' tab to match the reference image total and math
      : job.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pagedJobs = filteredJobs.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE);

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Tab counts
  const allCount = jobs.length; // Corrected math: show total jobs (4)
  const activeCount = jobs.filter(j => j.status === 'Active').length;
  const pausedCount = jobs.filter(j => j.status === 'Paused').length;
  const suspendedCount = jobs.filter(j => j.status === 'Suspended').length;
  const deletedCount = jobs.filter(j => j.status === 'Deleted').length;

  const tabs = [
    { key: 'All', label: 'All', count: allCount },
    { key: 'Active', label: 'Active', count: activeCount },
    { key: 'Paused', label: 'Paused', count: pausedCount },
    { key: 'Suspended', label: 'Suspended', count: suspendedCount },
    { key: 'Deleted', label: 'Archived/Deleted', count: deletedCount },
  ];

  const handleDelete = (jobId, title) => {
    if (window.confirm(`Are you sure you want to permanently delete the job posting for "${title}"?`)) {
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

  // Hover states helpers for buttons
  const [hoverPause, setHoverPause] = useState(null);
  const [hoverEdit, setHoverEdit] = useState(null);
  const [hoverDelete, setHoverDelete] = useState(null);

  return (
    <div style={styles.wrapper} className="animate-fade-in">
      {/* Page Header */}
      <div style={styles.headerArea}>
        <div>
          <h2 style={styles.headerTitle}>My Job Postings</h2>
          <p style={styles.headerSubtitle}>
            Manage your openings, respond to moderation alerts, and check direct candidate application metrics.
          </p>
        </div>

        <button
          onClick={onCreateNew}
          style={styles.createBtn}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#4F46E5';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(99, 102, 241, 0.35)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#6366F1';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(99, 102, 241, 0.2)';
          }}
        >
          <Plus size={18} />
          Create Job Post
        </button>
      </div>

      <div style={styles.divider}></div>

      {/* Filter and Search Bar Container */}
      <div style={styles.toolbar(isMobile)}>
        {/* Search Input */}
        <div style={styles.searchField(isMobile)}>
          <Search className="absolute left-3.5 top-2.5 text-slate-400" style={styles.searchIcon} size={16} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder="Search by title, location, category..."
            style={styles.searchInput}
            onFocus={e => { e.target.style.borderColor = '#6366F1'; e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.08)'; }}
            onBlur={e => { e.target.style.borderColor = '#D9E2EC'; e.target.style.boxShadow = 'none'; }}
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={styles.tabsContainer(isMobile)}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => handleStatusFilterChange(t.key)}
              style={styles.tab(statusFilter === t.key)}
              onMouseEnter={e => {
                if (statusFilter !== t.key) {
                  e.currentTarget.style.background = '#E2E8F0';
                  e.currentTarget.style.borderColor = '#CBD5E1';
                }
              }}
              onMouseLeave={e => {
                if (statusFilter !== t.key) {
                  e.currentTarget.style.background = '#F8FAFC';
                  e.currentTarget.style.borderColor = '#E2E8F0';
                }
              }}
            >
              {t.label} ({t.count})
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
        <div style={styles.cardList}>
          {pagedJobs.map((job) => {
            const isSuspended = job.status === 'Suspended';
            const isDeleted = job.status === 'Deleted';

            return (
              <div
                key={job.id}
                style={styles.card(isMobile)}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(15, 23, 42, 0.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = '#E2E8F0';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(15, 23, 42, 0.04)';
                }}
              >
                {/* Left Side Info */}
                <div style={styles.cardLeft}>
                  {/* Title and Badges */}
                  <div style={styles.cardTitleRow}>
                    <h3 style={styles.cardTitle}>{job.title}</h3>
                    
                    {job.reference_number && (
                      <span style={styles.jobIdBadge}>{job.reference_number}</span>
                    )}

                    {/* Status Badge */}
                    {job.status === 'Active' && (
                      <span style={styles.statusActive}>
                        <CheckCircle2 size={13} />
                        Active
                      </span>
                    )}
                    {job.status === 'Suspended' && (
                      <span style={styles.statusSuspended}>
                        <AlertTriangle size={13} />
                        Suspended
                      </span>
                    )}
                    {job.status === 'Paused' && (
                      <span style={styles.statusPaused}>
                        <Pause size={13} />
                        Paused
                      </span>
                    )}
                    {job.status === 'Deleted' && (
                      <span style={styles.statusPaused}>
                        <XCircle size={13} />
                        Archived/Deleted
                      </span>
                    )}

                    {/* Urgent Badge Toggle */}
                    {!isSuspended && !isDeleted && (
                      <button
                        onClick={() => toggleUrgentBadge(job.id)}
                        title="Toggle Urgent badge status"
                        style={job.isUrgent ? styles.urgentBadge : styles.urgentBadgeInactive}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#FFF1F2';
                          e.currentTarget.style.borderColor = '#FECDD3';
                        }}
                        onMouseLeave={e => {
                          if (!job.isUrgent) {
                            e.currentTarget.style.background = '#FFFFFF';
                            e.currentTarget.style.borderColor = '#FECDD3';
                          }
                        }}
                      >
                        <Flame size={12} fill={job.isUrgent ? 'currentColor' : 'none'} />
                        {job.isUrgent ? 'Urgent' : 'Urgent'}
                      </button>
                    )}

                    {/* Featured Badge Toggle */}
                    {!isSuspended && !isDeleted && (
                      <button
                        onClick={() => toggleFeaturedBadge(job.id)}
                        title="Toggle Featured badge status"
                        style={job.isFeatured ? styles.featuredBadge : styles.featuredBadgeInactive}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = '#FFF7ED';
                          e.currentTarget.style.borderColor = '#FED7AA';
                        }}
                        onMouseLeave={e => {
                          if (!job.isFeatured) {
                            e.currentTarget.style.background = '#FFFFFF';
                            e.currentTarget.style.borderColor = '#FED7AA';
                          }
                        }}
                      >
                        <Star size={12} fill={job.isFeatured ? 'currentColor' : 'none'} />
                        {job.isFeatured ? 'Featured' : 'Feature'}
                      </button>
                    )}
                  </div>

                  {/* Metadata Rows */}
                  <div style={styles.metaRowsContainer}>
                    {/* Row 1 */}
                    <div style={styles.metaRow1}>
                      <span style={styles.metaItem}>
                        <MapPin size={15} style={{ color: '#64748B' }} />
                        <span>{job.location}</span>
                      </span>
                      <span style={styles.metaItem}>
                        <Briefcase size={15} style={{ color: '#64748B' }} />
                        <span>{job.type}</span>
                      </span>
                      <span style={styles.metaItem}>
                        <DollarSign size={15} style={{ color: '#64748B' }} />
                        <span style={styles.metaItemValue}>{job.salary}</span>
                      </span>
                    </div>

                    {/* Row 2 */}
                    <div style={styles.metaRow2}>
                      <span style={styles.metaItem}>
                        <Monitor size={15} style={{ color: '#64748B' }} />
                        <span style={styles.categoryBadge}>{job.category}</span>
                      </span>
                      <span className="text-slate-300 hidden sm:inline">|</span>
                      <span style={styles.metaItem}>
                        <Calendar size={15} style={{ color: '#64748B' }} />
                        <span>Posted: {job.postedDate || 'Recently'}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: WhatsApp Metric + Actions */}
                <div style={styles.cardRight(isMobile)}>
                  {/* WhatsApp click metric */}
                  <div style={styles.whatsappMetric}>
                    <WhatsAppIcon size={22} />
                    <div style={styles.whatsappNumber}>{job.applyClicks || 0}</div>
                    <div style={styles.whatsappLabel}>WhatsApp Clicks</div>
                  </div>

                  {/* Vertical Separator */}
                  {!isMobile && <div style={styles.verticalDivider}></div>}

                  {/* Actions Group */}
                  <div style={styles.actionsGroup(isMobile, isDeleted)}>
                    {!isSuspended && !isDeleted ? (
                      <>
                        {/* Pause button */}
                        <button
                          onClick={() => toggleJobStatus(job.id)}
                          title="Pause job"
                          style={{
                            ...styles.actionBtn(),
                            background: hoverPause === job.id ? '#FEF3C7' : '#FFFFFF',
                            borderColor: hoverPause === job.id ? '#FCD34D' : '#E2E8F0',
                          }}
                          onMouseEnter={() => setHoverPause(job.id)}
                          onMouseLeave={() => setHoverPause(null)}
                          aria-label="Pause job"
                        >
                          <Pause size={16} style={{ color: '#F59E0B' }} />
                        </button>

                        {/* Edit button */}
                        <button
                          onClick={() => onEditJob(job)}
                          title="Edit job"
                          style={{
                            ...styles.actionBtn(),
                            background: hoverEdit === job.id ? '#F1F5F9' : '#FFFFFF',
                            borderColor: hoverEdit === job.id ? '#CBD5E1' : '#E2E8F0',
                          }}
                          onMouseEnter={() => setHoverEdit(job.id)}
                          onMouseLeave={() => setHoverEdit(null)}
                          aria-label="Edit job"
                        >
                          <Edit size={16} style={{ color: '#475569' }} />
                        </button>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(job.id, job.title)}
                          title="Delete job"
                          style={{
                            ...styles.actionBtn(),
                            background: hoverDelete === job.id ? '#FEE2E2' : '#FFFFFF',
                            borderColor: hoverDelete === job.id ? '#FCA5A5' : '#E2E8F0',
                          }}
                          onMouseEnter={() => setHoverDelete(job.id)}
                          onMouseLeave={() => setHoverDelete(null)}
                          aria-label="Delete job"
                        >
                          <Trash2 size={16} style={{ color: '#EF4444' }} />
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

                {/* Suspension Banner Details */}
                {isSuspended && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-amber-50 border-t border-amber-200 text-xs flex items-start gap-2.5">
                    <AlertTriangle size={14} className="text-amber-600 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-950">Job posting suspended by administration. Reason: </span>
                      <span className="text-slate-700 italic">"{job.moderationReason}"</span>
                      {job.appealStatus === 'Pending' ? (
                        <p className="text-[10px] text-amber-850 font-bold mt-1 animate-pulse">Appeal submitted and pending moderator review.</p>
                      ) : (
                        <button
                          onClick={() => handleOpenAppeal(job)}
                          className="mt-1 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold border-none cursor-pointer transition-all text-[10px]"
                        >
                          Submit Appeal
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Footer / Pagination */}
          <div style={styles.footer}>
            <span style={styles.footerText}>
              Showing {(safeCurrentPage - 1) * PAGE_SIZE + 1} to {Math.min(safeCurrentPage * PAGE_SIZE, filteredJobs.length)} of {filteredJobs.length} job postings
            </span>

            {totalPages > 1 && (
              <div style={styles.paginationContainer}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={safeCurrentPage === 1}
                  style={styles.paginationNavBtn(safeCurrentPage === 1)}
                >
                  <ChevronLeft size={16} />
                  {!isMobile && 'Previous'}
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    style={styles.paginationBtn(p === safeCurrentPage)}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={safeCurrentPage === totalPages}
                  style={styles.paginationNavBtn(safeCurrentPage === totalPages)}
                >
                  {!isMobile && 'Next'}
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
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
