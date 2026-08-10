import React, { useState } from 'react';
import { useJobs } from '../../context/JobContext';
import BuyCreditsModal from './BuyCreditsModal';
import { 
  Briefcase, MapPin, DollarSign, Tag, Sparkles, 
  Check, Eye, ArrowLeft, Building2, Flame, Zap, Phone, AlertCircle,
  Send, Star, Bell
} from 'lucide-react';

const CATEGORIES = [
  'Information Technology (IT)',
  'Engineering',
  'Healthcare',
  'Education',
  'Finance & Accounting',
  'Sales',
  'Marketing & Advertising',
  'Human Resources (HR)',
  'Customer Service',
  'Operations',
  'Manufacturing & Production',
  'Construction & Real Estate',
  'Legal',
  'Government & Public Administration',
  'Science & Research',
  'Media & Communications',
  'Design & Creative Arts',
  'Hospitality & Tourism',
  'Retail & E-commerce',
  'Transportation & Logistics',
  'Agriculture & Environmental',
  'Energy & Utilities',
  'Security & Law Enforcement',
  'Skilled Trades',
  'Consulting',
  'Nonprofit & Social Services',
  'Arts & Entertainment',
  'Telecommunications',
  'Biotechnology & Pharmaceuticals',
  'Freelance & Gig Economy'
];
const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Work from home', 'Contract', 'Internship'];

/* ── WhatsApp SVG icon ─────────────────────────────────────── */
const WhatsAppIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366"/>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.665 0-3.218-.503-4.512-1.363l-.288-.172-2.988.784.797-2.912-.189-.3A7.963 7.963 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" fill="#25D366"/>
  </svg>
);

/* ── inline styles ────────────────────────────────────────────── */
const s = {
  /* outer wrapper — full-width 2-column grid */
  outerWrap: {
    fontFamily: "'Inter', sans-serif",
    paddingBottom: 40,
  },
  pageTitle: {
    fontFamily: "'Manrope', sans-serif",
    fontSize: 28,
    fontWeight: 800,
    color: '#0f172a',
    letterSpacing: '-0.02em',
    margin: 0,
    lineHeight: 1.2,
  },
  pageSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: 400,
    marginTop: 6,
    lineHeight: 1.5,
  },

  /* 2-column grid */
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 380px',
    gap: 28,
    alignItems: 'start',
    marginTop: 8,
  },

  /* section card */
  card: {
    background: '#fff',
    border: '1px solid #e8ecf2',
    borderRadius: 16,
    padding: '28px 28px 24px',
    marginTop: 20,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  sectionNumber: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
    color: '#6366f1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Manrope', sans-serif",
    fontWeight: 800,
    fontSize: 14,
    flexShrink: 0,
  },
  sectionTitle: {
    fontFamily: "'Manrope', sans-serif",
    fontSize: 17,
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: 400,
    color: '#94a3b8',
    marginTop: 2,
  },

  /* form elements */
  fieldLabel: {
    display: 'block',
    fontSize: 12.5,
    fontWeight: 600,
    color: '#334155',
    marginBottom: 6,
  },
  required: {
    color: '#ef4444',
    marginLeft: 2,
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#94a3b8',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '10px 14px 10px 38px',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    fontSize: 13,
    fontWeight: 500,
    color: '#1e293b',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    background: '#fff',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
  },
  inputNoIcon: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    fontSize: 13,
    fontWeight: 500,
    color: '#1e293b',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    background: '#fff',
    fontFamily: "'Inter', sans-serif",
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    fontSize: 13,
    fontWeight: 500,
    color: '#1e293b',
    outline: 'none',
    background: '#fff',
    fontFamily: "'Inter', sans-serif",
    cursor: 'pointer',
    appearance: 'auto',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    fontSize: 13,
    fontWeight: 500,
    color: '#1e293b',
    outline: 'none',
    resize: 'vertical',
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.6,
    transition: 'border-color 0.2s, box-shadow 0.2s',
    boxSizing: 'border-box',
  },
  helperText: {
    fontSize: 11.5,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginTop: 6,
  },

  /* grid helpers */
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  row3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 },

  /* badge cards */
  badgeCard: (active, hue) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: 12,
    padding: '14px 16px',
    borderRadius: 12,
    border: active ? `1.5px solid ${hue === 'red' ? '#fca5a5' : '#fcd34d'}` : '1.5px solid #e2e8f0',
    background: active ? (hue === 'red' ? '#fef2f2' : '#fffbeb') : '#fff',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flex: 1,
  }),
  badgeCheckbox: (active, hue) => ({
    width: 20,
    height: 20,
    borderRadius: 5,
    border: active ? `2px solid ${hue === 'red' ? '#6366f1' : '#f59e0b'}` : '2px solid #cbd5e1',
    background: active ? (hue === 'red' ? '#6366f1' : '#fff') : '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  }),
  badgeTitle: (hue) => ({
    fontSize: 13,
    fontWeight: 700,
    color: hue === 'red' ? '#dc2626' : '#d97706',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  }),
  badgeDesc: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: 400,
    marginTop: 2,
    lineHeight: 1.4,
  },

  /* bottom bar */
  bottomBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 32,
    paddingTop: 24,
    borderTop: '1px solid #e8ecf2',
  },
  cancelBtn: {
    padding: '11px 28px',
    borderRadius: 10,
    border: '1px solid #d1d5db',
    background: '#fff',
    color: '#374151',
    fontSize: 13.5,
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.2s',
  },
  publishBtn: {
    padding: '11px 28px',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: '#fff',
    fontSize: 13.5,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'Manrope', sans-serif",
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 4px 14px rgba(99,102,241,0.3)',
    transition: 'all 0.2s',
  },

  /* ── Preview panel ─────────────────────────────────── */
  previewColumn: {
    position: 'sticky',
    top: 24,
    paddingTop: 20,
  },
  previewHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  previewLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontFamily: "'Manrope', sans-serif",
    letterSpacing: '0.02em',
  },
  tabBar: {
    display: 'flex',
    alignItems: 'center',
    background: '#f1f5f9',
    borderRadius: 8,
    padding: 3,
    border: '1px solid #e2e8f0',
  },
  tab: (active) => ({
    padding: '5px 14px',
    fontSize: 11,
    fontWeight: 700,
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    transition: 'all 0.15s ease',
    background: active ? '#fff' : 'transparent',
    color: active ? '#1e293b' : '#94a3b8',
    boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
  }),

  /* preview card */
  previewCard: {
    background: '#fff',
    borderRadius: 16,
    border: '1.5px solid rgba(99,102,241,0.15)',
    boxShadow: '0 4px 24px rgba(99,102,241,0.07)',
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  urgentStrip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(90deg, #ef4444, #dc2626, #f59e0b)',
  },
  badge: (bg, color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 10px',
    borderRadius: 100,
    fontSize: 10,
    fontWeight: 700,
    background: bg,
    color: color,
    lineHeight: 1,
  }),
  previewTitle: {
    fontFamily: "'Manrope', sans-serif",
    fontSize: 17,
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
    lineHeight: 1.3,
  },
  previewCompany: {
    fontSize: 12,
    fontWeight: 500,
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  previewMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 14,
    padding: '10px 0',
    margin: '12px 0',
    borderTop: '1px solid #f1f5f9',
    borderBottom: '1px solid #f1f5f9',
  },
  previewMetaItem: {
    fontSize: 12,
    fontWeight: 500,
    color: '#64748b',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  applyBtn: {
    width: '100%',
    padding: '11px 0',
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    fontFamily: "'Manrope', sans-serif",
    cursor: 'not-allowed',
    opacity: 0.92,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    boxShadow: '0 4px 14px rgba(99,102,241,0.25)',
  },
  whatsappPreview: {
    fontSize: 10.5,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 500,
    fontStyle: 'italic',
    background: '#f8fafc',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #f1f5f9',
    lineHeight: 1.55,
  },

  /* classified preview */
  classifiedOuter: {
    background: '#f8fafc',
    borderRadius: 16,
    border: '1.5px solid rgba(99,102,241,0.15)',
    boxShadow: '0 4px 24px rgba(99,102,241,0.07)',
    padding: 24,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
    backgroundSize: '12px 12px',
  },
  classifiedInner: {
    border: '1px solid #94a3b8',
    background: '#fff',
    overflow: 'hidden',
    width: '100%',
    maxWidth: 340,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  classifiedHeader: {
    background: '#0f172a',
    color: '#fff',
    fontWeight: 700,
    fontSize: 10,
    letterSpacing: '0.12em',
    textAlign: 'center',
    padding: '7px 8px',
    textTransform: 'uppercase',
    fontFamily: "'Manrope', sans-serif",
  },
  classifiedBody: {
    padding: '12px 14px 28px',
    fontSize: 11.5,
    lineHeight: 1.5,
    borderBottom: '1px solid #e2e8f0',
    position: 'relative',
    background: '#fff',
  },
  classifiedTitle: {
    fontWeight: 800,
    fontSize: 12.5,
    color: '#0f172a',
    textTransform: 'uppercase',
    lineHeight: 1.3,
    marginBottom: 2,
  },
  classifiedCompany: {
    fontSize: 9.5,
    fontWeight: 700,
    color: '#94a3b8',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  classifiedTag: (bg) => ({
    display: 'inline-block',
    fontSize: 8,
    fontWeight: 800,
    color: '#fff',
    background: bg,
    padding: '2px 5px',
    borderRadius: 2,
    marginLeft: 4,
    verticalAlign: 'middle',
    textTransform: 'uppercase',
  }),
  classifiedApply: {
    position: 'absolute',
    bottom: 6,
    left: 14,
    right: 14,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  classifiedHint: {
    fontSize: 10.5,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: 500,
    fontStyle: 'italic',
    background: '#fff',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    lineHeight: 1.5,
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
  },
};

const focusIn = (e) => { e.target.style.borderColor = '#a5b4fc'; e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; };
const focusOut = (e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; };
const focusInGreen = (e) => { e.target.style.borderColor = '#86efac'; e.target.style.boxShadow = '0 0 0 3px rgba(34,197,94,0.1)'; };


const JobPostForm = ({ initialJob = null, onCancel, onSuccess }) => {
  const { addJob, updateJob, employerProfile, fetchEmployerCredits } = useJobs();
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [previewType, setPreviewType] = useState('card');

  const [formData, setFormData] = useState({
    title: initialJob?.title || '',
    company: initialJob?.company || employerProfile.companyName || '',
    location: initialJob?.location || employerProfile.city || '',
    salary: initialJob?.salary || '₹12L - ₹18L PA',
    type: initialJob?.type || 'Full-time',
    category: initialJob?.category || 'Information Technology (IT)',
    description: initialJob?.description || '',
    requirements: initialJob?.requirements || '',
    isUrgent: initialJob?.isUrgent ?? true,
    isFeatured: initialJob?.isFeatured ?? false,
    whatsappNumber: initialJob?.whatsappNumber || employerProfile.whatsappNumber || '',
    whatsappMessage: initialJob?.whatsappMessage || employerProfile.defaultMessage || 'Hi, I saw your post for {role} on JobPortal. I am interested in applying and would like to connect!',
    classified_heading: initialJob?.classified_heading || '',
    salary_min: initialJob?.salary_min || '',
    salary_max: initialJob?.salary_max || '',
    salary_period: initialJob?.salary_period || 'year'
  });

  const [successBanner, setSuccessBanner] = useState(false);
  const [errorBanner, setErrorBanner] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a Job Title');
      return;
    }
    const descWords = formData.description.trim() === '' ? 0 : formData.description.trim().split(/\s+/).length;
    if (descWords > 50) {
      setErrorBanner('Job description cannot exceed 50 words.');
      return;
    }
    setErrorBanner(null);

    try {
      if (initialJob) {
        await updateJob(initialJob.id, formData);
      } else {
        await addJob(formData);
      }
      setSuccessBanner(true);
      setTimeout(() => { if (onSuccess) onSuccess(); }, 900);
    } catch (error) {
      if (error.message === 'CREDITS_EXHAUSTED' || error.status === 402) {
        setErrorBanner('CREDITS_EXHAUSTED');
      } else {
        setErrorBanner(error.message || 'Failed to save job posting');
      }
    }
  };

  const wordCount = formData.description.trim() === '' ? 0 : formData.description.trim().split(/\s+/).length;

  const getSalaryPreview = () => {
    if (formData.salary_min && formData.salary_max) {
      if (formData.salary_period === 'month') {
        return `₹${parseInt(formData.salary_min).toLocaleString('en-IN')} - ₹${parseInt(formData.salary_max).toLocaleString('en-IN')} PM`;
      }
      return `₹${formData.salary_min}L - ₹${formData.salary_max}L PA`;
    }
    return formData.salary || 'Salary Range';
  };

  const getResolvedMessage = () => {
    return (formData.whatsappMessage || '')
      .replace(/\[Job Title\]/gi, formData.title || 'Job Title')
      .replace(/\{Job Title\}/gi, formData.title || 'Job Title')
      .replace(/\[title\]/gi, formData.title || 'Job Title')
      .replace(/\{title\}/gi, formData.title || 'Job Title')
      .replace(/\[role\]/gi, formData.title || 'Job Title')
      .replace(/\{role\}/gi, formData.title || 'Job Title')
      .replace(/\[Company Name\]/gi, formData.company || 'Company Name')
      .replace(/\{Company Name\}/gi, formData.company || 'Company Name')
      .replace(/\[company\]/gi, formData.company || 'Company Name')
      .replace(/\{company\}/gi, formData.company || 'Company Name');
  };


  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <div style={s.outerWrap} className="animate-fade-in">
      {/* ── Page header ─────────────────────────────────── */}
      <h2 style={s.pageTitle}>
        {initialJob ? 'Edit Job Posting' : 'Create New Job Posting'}
      </h2>
      <p style={s.pageSubtitle}>
        Draft job details, assign urgency title badges, and configure WhatsApp apply contact settings.
      </p>

      {/* ── Banners ─────────────────────────────────────── */}
      {successBanner && (
        <div style={{ ...s.card, marginTop: 16, padding: '14px 20px', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: 10, color: '#166534', fontWeight: 600, fontSize: 13 }}>
          <Check size={18} style={{ color: '#22c55e', flexShrink: 0 }} />
          Job posting saved! Updated real-time on public job board.
        </div>
      )}

      {errorBanner && errorBanner === 'CREDITS_EXHAUSTED' ? (
        <div style={{ ...s.card, marginTop: 16, padding: '16px 20px', background: '#eef2ff', border: '1px solid #c7d2fe', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <AlertCircle size={18} style={{ color: '#6366f1', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', margin: 0 }}>Post Limit Reached</p>
              <p style={{ fontSize: 11.5, color: '#64748b', fontWeight: 400, margin: '2px 0 0' }}>You have exhausted your 3 free job posts. Purchase post credits to publish this job listing.</p>
            </div>
          </div>
          <button type="button" onClick={() => setIsBuyModalOpen(true)} style={{ padding: '8px 18px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: "'Manrope', sans-serif", flexShrink: 0 }}>
            Buy Post Credits
          </button>
        </div>
      ) : errorBanner && (
        <div style={{ ...s.card, marginTop: 16, padding: '14px 20px', background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: 10, color: '#991b1b', fontWeight: 600, fontSize: 13 }}>
          <AlertCircle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
          {errorBanner}
        </div>
      )}

      {/* ══════════ 2-column grid ══════════ */}
      <div style={s.grid}>

        {/* ╔═══ LEFT COLUMN — Form ═══╗ */}
        <form onSubmit={handleSubmit}>

          {/* ── Section 1: Basic Information ── */}
          <div style={s.card}>
            <div style={s.sectionHeader}>
              <span style={s.sectionNumber}>1</span>
              <h3 style={s.sectionTitle}>Basic Information</h3>
            </div>

            <div style={s.row2}>
              <div>
                <label style={s.fieldLabel}>Job Title <span style={s.required}>*</span></label>
                <div style={s.inputWrapper}>
                  <Briefcase size={15} style={s.inputIcon} />
                  <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Senior React Developer" required style={s.input} onFocus={focusIn} onBlur={focusOut} />
                </div>
              </div>
              <div>
                <label style={s.fieldLabel}>Company Name <span style={s.required}>*</span></label>
                <div style={s.inputWrapper}>
                  <Building2 size={15} style={s.inputIcon} />
                  <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. LogiStare Logistics" style={s.input} onFocus={focusIn} onBlur={focusOut} />
                </div>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={s.fieldLabel}>
                Classified Heading{' '}
                <span style={{ fontWeight: 400, color: '#94a3b8', fontSize: 11.5 }}>(Optional, for Classified view only – e.g. "Wanted Accountant")</span>
              </label>
              <input type="text" name="classified_heading" value={formData.classified_heading} onChange={handleChange} placeholder='e.g. WANTED ACCOUNTANT / WANTED MERCHANDISER' style={s.inputNoIcon} onFocus={focusIn} onBlur={focusOut} />
            </div>

            <div style={{ ...s.row3, marginTop: 16 }}>
              <div>
                <label style={s.fieldLabel}>Category <span style={s.required}>*</span></label>
                <select name="category" value={formData.category} onChange={handleChange} style={s.select}>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label style={s.fieldLabel}>Location <span style={s.required}>*</span></label>
                <div style={s.inputWrapper}>
                  <MapPin size={15} style={s.inputIcon} />
                  <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="Gurgaon" style={s.input} onFocus={focusIn} onBlur={focusOut} />
                </div>
              </div>
              <div>
                <label style={s.fieldLabel}>Employment Type <span style={s.required}>*</span></label>
                <select name="type" value={formData.type} onChange={handleChange} style={s.select}>
                  {JOB_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={s.fieldLabel}>Salary Range <span style={s.required}>*</span></label>
              <div style={s.row3}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 5 }}>Minimum Salary</label>
                  <input type="number" name="salary_min" value={formData.salary_min} onChange={handleChange} placeholder={formData.salary_period === 'month' ? 'e.g. ₹20,000' : 'e.g. ₹2'} required min="1" style={s.inputNoIcon} onFocus={focusIn} onBlur={focusOut} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 5 }}>Maximum Salary</label>
                  <input type="number" name="salary_max" value={formData.salary_max} onChange={handleChange} placeholder={formData.salary_period === 'month' ? 'e.g. ₹40,000' : 'e.g. ₹8'} required min="1" style={s.inputNoIcon} onFocus={focusIn} onBlur={focusOut} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#64748b', marginBottom: 5 }}>Salary Period</label>
                  <select name="salary_period" value={formData.salary_period} onChange={handleChange} style={s.select}>
                    <option value="year">Lakhs Per Annum (LPA)</option>
                    <option value="month">Rupees Per Month (PM)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 2: WhatsApp ── */}
          <div style={s.card}>
            <div style={s.sectionHeader}>
              <span style={{ ...s.sectionNumber, background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', color: '#059669' }}>2</span>
              <h3 style={s.sectionTitle}>Direct WhatsApp Contact Setup</h3>
            </div>
            <div style={s.row2}>
              <div>
                <label style={s.fieldLabel}>WhatsApp Phone Number <span style={s.required}>*</span></label>
                <div style={s.inputWrapper}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', zIndex: 1 }}>
                    <WhatsAppIcon size={16} />
                  </span>
                  <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} placeholder="+919905023496" style={{ ...s.input, paddingLeft: 38 }} onFocus={focusInGreen} onBlur={focusOut} />
                </div>
                <p style={s.helperText}>Include country code (e.g. +91)</p>
              </div>
              <div>
                <label style={s.fieldLabel}>WhatsApp Message Template <span style={s.required}>*</span></label>
                <input type="text" name="whatsappMessage" value={formData.whatsappMessage} onChange={handleChange} placeholder="Hi, I saw your post for {role} on JobPortal. I am inte..." style={s.inputNoIcon} onFocus={focusInGreen} onBlur={focusOut} />
                <p style={s.helperText}>Use {'{role}'} as a placeholder for job title</p>
              </div>
            </div>
          </div>

          {/* ── Section 3: Badges ── */}
          <div style={s.card}>
            <div style={s.sectionHeader}>
              <span style={{ ...s.sectionNumber, background: 'linear-gradient(135deg, #fef3c7, #fde68a)', color: '#d97706' }}>3</span>
              <div>
                <h3 style={s.sectionTitle}>Assign Title Badges</h3>
                <p style={s.sectionSubtitle}>Choose badges to highlight this post.</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              <label style={s.badgeCard(formData.isUrgent, 'red')}>
                <div style={s.badgeCheckbox(formData.isUrgent, 'red')}>
                  {formData.isUrgent && <Check size={13} style={{ color: '#fff' }} />}
                </div>
                <input type="checkbox" name="isUrgent" checked={formData.isUrgent} onChange={handleChange} style={{ display: 'none' }} />
                <div>
                  <span style={s.badgeTitle('red')}><Bell size={14} style={{ color: '#ef4444' }} /> Mark as Urgent</span>
                  <p style={s.badgeDesc}>Adds <span style={{ color: '#ef4444', fontWeight: 600 }}>red</span> urgency tag<br/>to the job post</p>
                </div>
              </label>
              <label style={s.badgeCard(formData.isFeatured, 'amber')}>
                <div style={s.badgeCheckbox(formData.isFeatured, 'amber')}>
                  {formData.isFeatured && <Check size={13} style={{ color: '#d97706' }} />}
                </div>
                <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} style={{ display: 'none' }} />
                <div>
                  <span style={s.badgeTitle('amber')}><Star size={14} style={{ color: '#f59e0b', fill: '#f59e0b' }} /> Feature this Post</span>
                  <p style={s.badgeDesc}>Highlights listing in search<br/>top results</p>
                </div>
              </label>
            </div>
          </div>

          {/* ── Section 4: Description ── */}
          <div style={s.card}>
            <div style={s.sectionHeader}>
              <span style={s.sectionNumber}>4</span>
              <h3 style={s.sectionTitle}>Role Overview & Requirements</h3>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ ...s.fieldLabel, marginBottom: 0 }}>Job Description <span style={s.required}>*</span></label>
                <span style={{ fontSize: 11, fontWeight: 600, color: wordCount > 50 ? '#ef4444' : '#94a3b8' }}>{wordCount} / 50 words</span>
              </div>
              <textarea name="description" rows={4} value={formData.description} onChange={handleChange} placeholder="Describe role responsibilities and overview (Max 50 words)..." required style={s.textarea} onFocus={focusIn} onBlur={focusOut} />
              <p style={s.helperText}>Provide a clear and concise summary of the role.</p>
            </div>
            <div style={{ marginTop: 18 }}>
              <label style={s.fieldLabel}>Key Requirements & Skills</label>
              <textarea name="requirements" rows={3} value={formData.requirements} onChange={handleChange} placeholder="e.g. 3+ years React experience, TypeScript, REST APIs..." style={s.textarea} onFocus={focusIn} onBlur={focusOut} />
              <p style={s.helperText}>List the essential skills, qualifications, and experience required.</p>
            </div>
          </div>

          {/* ── Bottom buttons ── */}
          <div style={s.bottomBar}>
            <button type="button" onClick={onCancel} style={s.cancelBtn} onMouseEnter={e => { e.target.style.background = '#f8fafc'; }} onMouseLeave={e => { e.target.style.background = '#fff'; }}>
              Cancel
            </button>
            <button type="submit" style={s.publishBtn} onMouseEnter={e => { e.target.style.boxShadow = '0 6px 20px rgba(99,102,241,0.4)'; e.target.style.transform = 'translateY(-1px)'; }} onMouseLeave={e => { e.target.style.boxShadow = '0 4px 14px rgba(99,102,241,0.3)'; e.target.style.transform = 'translateY(0)'; }}>
              <Send size={15} />
              {initialJob ? 'Save Changes' : 'Publish Job Post'}
            </button>
          </div>
        </form>

        {/* ╔═══ RIGHT COLUMN — Live Preview ═══╗ */}
        <div style={s.previewColumn}>
          {/* Header with tab toggle */}
          <div style={s.previewHeader}>
            <span style={s.previewLabel}>
              <Eye size={14} style={{ color: '#6366f1' }} />
              Live Candidate Preview
            </span>
            <div style={s.tabBar}>
              <button type="button" onClick={() => setPreviewType('card')} style={s.tab(previewType === 'card')}>Card</button>
              <button type="button" onClick={() => setPreviewType('classified')} style={s.tab(previewType === 'classified')}>Classified</button>
            </div>
          </div>

          {previewType === 'card' ? (
            /* ── Job Card Preview ── */
            <div style={s.previewCard}>
              {formData.isUrgent && <div style={s.urgentStrip} />}

              {/* badges row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14, paddingTop: formData.isUrgent ? 6 : 0 }}>
                {formData.isUrgent && (
                  <span style={s.badge('#ef4444', '#fff')}>
                    <Flame size={11} style={{ fill: '#fff' }} /> Urgent Hiring
                  </span>
                )}
                {formData.isFeatured && (
                  <span style={s.badge('#f59e0b', '#fff')}>
                    <Zap size={11} style={{ fill: '#fff' }} /> Featured
                  </span>
                )}
                <span style={s.badge('#eef2ff', '#6366f1')}>
                  {formData.category || 'Category'}
                </span>
              </div>

              {/* title + company */}
              <h4 style={s.previewTitle}>{formData.title || 'Job Title'}</h4>
              <p style={s.previewCompany}>
                <Building2 size={13} style={{ color: '#94a3b8' }} />
                {formData.company || 'Company Name'}
              </p>

              {/* meta row */}
              <div style={s.previewMeta}>
                <span style={s.previewMetaItem}>
                  <MapPin size={13} style={{ color: '#94a3b8' }} />
                  {formData.location || 'Location'}
                </span>
                <span style={s.previewMetaItem}>
                  <Briefcase size={13} style={{ color: '#94a3b8' }} />
                  {formData.type || 'Full-time'}
                </span>
                <span style={{ ...s.previewMetaItem, fontWeight: 700, color: '#1e293b' }}>
                  <DollarSign size={13} style={{ color: '#22c55e' }} />
                  {getSalaryPreview()}
                </span>
              </div>

              {/* description */}
              <p style={{ fontSize: 12.5, color: '#64748b', lineHeight: 1.6, marginBottom: 16, minHeight: 20 }}>
                {formData.description || 'Fill in form fields to preview candidate card...'}
              </p>

              {/* apply button */}
              <button type="button" disabled style={s.applyBtn}>Apply Now</button>

              {/* WhatsApp message preview */}
              <div style={s.whatsappPreview}>
                WhatsApp message sent to employer ({formData.whatsappNumber || 'Phone Number'}):<br/>
                <strong style={{ color: '#1e293b', fontStyle: 'normal' }}>
                  "{getResolvedMessage()}"
                </strong>
              </div>
            </div>
          ) : (
            /* ── Classified Ad Preview ── */
            <div style={s.classifiedOuter}>
              <div style={s.classifiedInner}>
                <div style={s.classifiedHeader}>
                  {formData.classified_heading || formData.category || 'Category'}
                </div>
                <div style={s.classifiedBody}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                    <span style={s.classifiedTitle}>
                      {formData.title || 'JOB TITLE'}
                    </span>
                    <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                      {formData.isUrgent && <span style={s.classifiedTag('#ef4444')}>Urgent</span>}
                      {formData.isFeatured && <span style={s.classifiedTag('#f59e0b')}>Featured</span>}
                    </div>
                  </div>
                  {formData.company && <p style={s.classifiedCompany}>{formData.company}</p>}
                  <p style={{ color: '#334155', textAlign: 'justify', margin: 0, fontSize: 11.5 }}>
                    <span style={{ fontWeight: 700, marginRight: 4 }}>
                      {getSalaryPreview()} — {formData.location || 'Location'}.
                    </span>
                    {formData.description || 'Fill in form details to preview this job posting in the newspaper-style classified grid...'}
                  </p>
                  <div style={s.classifiedApply}>
                    <span style={{ fontSize: 9.5, fontWeight: 700, color: '#6366f1' }}>
                      Apply Now &rarr;
                    </span>
                  </div>
                </div>
              </div>
              <div style={s.classifiedHint}>
                Newspaper-style classified view card preview. This represents how this listing is formatted and grouped in the smart columns layout.
              </div>
            </div>
          )}
        </div>
      </div>

      <BuyCreditsModal 
        isOpen={isBuyModalOpen} 
        onClose={() => setIsBuyModalOpen(false)} 
        onSuccess={() => {
          setIsBuyModalOpen(false);
          setErrorBanner(null);
          fetchEmployerCredits();
        }} 
      />
    </div>
  );
};

export default JobPostForm;
