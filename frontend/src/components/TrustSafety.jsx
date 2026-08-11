import React, { useState, useEffect } from 'react';

const sections = [
  { id: 'commitment', label: 'Our Commitment' },
  { id: 'zero-fee', label: 'Zero-Fee for Candidates' },
  { id: 'employer-vetting', label: 'Employer Vetting' },
  { id: 'agent-kyc', label: 'Agent KYC & Accountability' },
  { id: 'red-flags', label: 'Common Scam Warning Signs' },
  { id: 'enforcement', label: 'Enforcement Actions' },
  { id: 'grievance-officer', label: 'Grievance Officer' },
  { id: 'reporting', label: 'Reporting a Violation' },
];

const TrustSafety = () => {
  const [active, setActive] = useState('commitment');
  const [form, setForm] = useState({ email: '', company: '', jobTitle: '', type: 'fee-demand', details: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [incidentId, setIncidentId] = useState('');

  useEffect(() => {
    const onScroll = () => {
      let current = 'commitment';
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 100) current = s.id;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.details) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIncidentId('JP-TS-' + Math.floor(100000 + Math.random() * 900000));
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="bg-white min-h-screen pt-28">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex gap-16 items-start">

          {/* Sticky TOC */}
          <aside className="hidden lg:block w-56 shrink-0 sticky top-24">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">On this page</p>
            <nav className="space-y-1">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className={`block w-full text-left text-xs py-1.5 px-0 border-0 bg-transparent cursor-pointer transition-colors ${
                    active === s.id ? 'text-slate-900 font-semibold' : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="mb-10 pb-8 border-b border-slate-100">
              <h1 className="text-3xl font-bold text-slate-900 mb-3">Trust & Safety</h1>
              <p className="text-sm text-slate-500">We are committed to keeping JobPortal India free from fraud, scams, and harmful conduct. This page explains how we protect users and how you can report a problem.</p>
            </div>

            <div className="prose-legal">

              <section id="commitment" className="mb-10 scroll-mt-24">
                <h2>Our Commitment</h2>
                <p>JobPortal India is built on the principle that employment platforms should be safe, transparent, and free from exploitation. We enforce strict standards for every employer, agent, and listing on the platform. These standards are non-negotiable.</p>
                <p>Our Trust & Safety policies are designed to protect three groups: job seekers who trust us with their careers, employers who rely on us to find genuine talent, and affiliate agents who refer businesses in good faith.</p>
              </section>

              <section id="zero-fee" className="mb-10 scroll-mt-24">
                <h2>Zero-Fee for Candidates</h2>
                <p><strong>Candidates never pay to apply for or obtain jobs on this platform.</strong> Any employer who demands money from a job seeker — for interviews, training, background checks, equipment, or any other reason — is in direct violation of our Terms of Service and will be removed from the Platform.</p>
                <p>If an employer approaches you outside the Platform and asks for payment, do not pay. Report it to us immediately using the form below.</p>
              </section>

              <section id="employer-vetting" className="mb-10 scroll-mt-24">
                <h2>Employer Vetting</h2>
                <p>All employer accounts are reviewed before their listings are made publicly visible. Our vetting process includes:</p>
                <ul>
                  <li>Verification of business registration details (GSTIN or PAN) through publicly available government records.</li>
                  <li>Manual review of job descriptions to flag misleading salary ranges, vague role definitions, or patterns associated with fraudulent postings.</li>
                  <li>Automated detection of duplicate listings and known scam patterns.</li>
                </ul>
                <p>Employers who are referred to the Platform by Affiliate Agents carry an additional layer of accountability, as Agents are themselves verified with government-issued KYC documents.</p>
              </section>

              <section id="agent-kyc" className="mb-10 scroll-mt-24">
                <h2>Agent KYC & Accountability</h2>
                <p>Affiliate Agents who refer employers to the Platform are required to submit a valid government-issued ID (Aadhar Card, PAN Card, Voter ID, or Passport) before receiving any commission payouts. This creates a documented chain of accountability for every employer on the Platform.</p>
                <p>Agents are also granted limited moderation powers over their referred employers — they can suspend accounts that exhibit suspicious behaviour. This creates an additional safety layer at the network level.</p>
                <p>Any Agent found to have referred fraudulent employers, engaged in self-referral, or abused their suspension powers will have their account terminated and accrued earnings forfeited.</p>
              </section>

              <section id="red-flags" className="mb-10 scroll-mt-24">
                <h2>Common Scam Warning Signs</h2>
                <p>Job seekers should be cautious of the following warning signs during any recruitment process:</p>
                <ul>
                  <li>Being asked to pay a fee to attend an interview, receive an offer letter, or complete background verification.</li>
                  <li>Receiving a job offer without completing a formal interview process.</li>
                  <li>Recruitment correspondence sent from free email services (Gmail, Yahoo, Outlook) rather than a verified corporate domain.</li>
                  <li>Requests to share Aadhar, PAN, or bank account details before a formal offer letter is signed.</li>
                  <li>Vague job descriptions with unusually high salaries for minimal qualifications.</li>
                  <li>Communication conducted entirely through WhatsApp or Telegram with no company website or verifiable contact information.</li>
                </ul>
                <p>If any of the above apply, do not proceed. Report the listing or employer using the form below.</p>
              </section>

              <section id="enforcement" className="mb-10 scroll-mt-24">
                <h2>Enforcement Actions</h2>
                <p>Upon receiving a report, our Trust & Safety team may take one or more of the following actions:</p>
                <ul>
                  <li>Remove the offending job listing from the Platform immediately.</li>
                  <li>Suspend or permanently terminate the employer account.</li>
                  <li>Notify the referring Affiliate Agent about the violation.</li>
                  <li>Provide information to law enforcement or regulatory authorities where required by Indian law.</li>
                </ul>
                <p>We will acknowledge all reports within 48 hours and provide a final resolution within the timelines required by the IT Intermediary Rules, 2021 (generally 15 business days for non-emergency matters, and 36 hours for urgent content removal requests).</p>
              </section>

              <section id="grievance-officer" className="mb-10 scroll-mt-24">
                <h2>Grievance Officer</h2>
                <p>For formal legal complaints under the IT Act, 2000 and related rules, you may contact our designated Grievance Officer:</p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mt-4 space-y-1.5 text-sm">
                  <p><strong>Name:</strong> Mr. Rajesh Kumar</p>
                  <p><strong>Designation:</strong> Grievance Redressal Officer</p>
                  <p><strong>Address:</strong> 4th Floor, Salarpuria GR Tech Park, Whitefield, Bengaluru, Karnataka – 560066</p>
                  <p><strong>Email:</strong> <a href="mailto:grievance.officer@jobportal.in">grievance.officer@jobportal.in</a></p>
                  <p><strong>Phone:</strong> +91 80 4880 1234</p>
                  <p><strong>Response time:</strong> Acknowledgment within 48 hours; resolution within 15 business days.</p>
                </div>
              </section>

              <section id="reporting" className="mb-10 scroll-mt-24">
                <h2>Reporting a Violation</h2>
                <p>If you have encountered a suspicious employer, job listing, or any conduct that violates our policies, please report it. Our Trust & Safety team reviews all submissions and will take appropriate action within 36 hours of receiving a complaint, as required under the IT Intermediary Rules, 2021.</p>

                <div className="mt-6 border border-slate-200 rounded-lg p-6">

                  {submitted ? (
                    <div className="text-center py-6">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-50 mb-4">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M5 10l4 4 6-7" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <p className="font-semibold text-slate-900 text-sm mb-1">Report submitted</p>
                      <p className="text-xs text-slate-500 mb-3">Our Trust & Safety team will review this within 36 hours.</p>
                      <p className="text-xs font-mono text-slate-400">Incident ID: <span className="text-slate-700 font-semibold">{incidentId}</span></p>
                      <button
                        onClick={() => { setSubmitted(false); setForm({ email: '', company: '', jobTitle: '', type: 'fee-demand', details: '' }); }}
                        className="mt-4 text-xs text-primary hover:underline bg-transparent border-0 cursor-pointer"
                      >
                        Submit another report
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Your email address <span className="text-rose-500">*</span></label>
                          <input
                            type="email"
                            required
                            value={form.email}
                            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                            placeholder="you@example.com"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Type of incident</label>
                          <select
                            value={form.type}
                            onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white"
                          >
                            <option value="fee-demand">Fee demand from employer</option>
                            <option value="fake-company">Fake or impersonating company</option>
                            <option value="data-misuse">Misuse of personal data</option>
                            <option value="harassment">Harassment or abuse</option>
                            <option value="other">Other policy violation</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Company name (if applicable)</label>
                          <input
                            type="text"
                            value={form.company}
                            onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
                            placeholder="e.g. Acme Corp"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Job title (if applicable)</label>
                          <input
                            type="text"
                            value={form.jobTitle}
                            onChange={e => setForm(p => ({ ...p, jobTitle: e.target.value }))}
                            placeholder="e.g. Sales Executive"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Describe the incident <span className="text-rose-500">*</span></label>
                        <textarea
                          required
                          rows={4}
                          value={form.details}
                          onChange={e => setForm(p => ({ ...p, details: e.target.value }))}
                          placeholder="Please describe what happened, including any amounts demanded, email addresses used, or links to the listing..."
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-700 text-white text-sm font-semibold rounded-lg border-0 cursor-pointer transition-colors disabled:opacity-50"
                      >
                        {submitting ? 'Submitting…' : 'Submit report'}
                      </button>
                    </form>
                  )}
                </div>
              </section>

            </div>
          </main>

        </div>
      </div>

      <style>{`
        .prose-legal h2 {
          font-family: var(--font-heading);
          font-size: 18px;
          font-weight: 700;
          color: #111827;
          margin-top: 0;
          margin-bottom: 12px;
        }
        .prose-legal p {
          font-size: 14px;
          color: #4B5563;
          line-height: 1.7;
          margin-bottom: 12px;
        }
        .prose-legal ul {
          padding-left: 20px;
          margin-bottom: 12px;
        }
        .prose-legal li {
          font-size: 14px;
          color: #4B5563;
          line-height: 1.7;
          margin-bottom: 4px;
        }
        .prose-legal a {
          color: #6366f1;
          text-decoration: underline;
        }
        .prose-legal a:hover {
          color: #4f46e5;
        }
        .prose-legal strong {
          color: #111827;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
};

export default TrustSafety;
