import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  UserCheck,
  Search,
  ChevronRight,
  Mail,
  Globe,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Eye,
  Lock,
  MessageSquareWarning,
  Flag,
  Scale,
  Megaphone,
  FileText,
  Ban,
  Building2,
  AlertCircle,
  Heart,
} from 'lucide-react';

const sections = [
  { id: 'commitment', num: '01', title: 'Our Commitment', icon: Heart },
  { id: 'zero-fee', num: '02', title: 'Zero-Fee for Candidates', icon: CheckCircle2 },
  { id: 'employer-vetting', num: '03', title: 'Employer Vetting', icon: Building2 },
  { id: 'agent-kyc', num: '04', title: 'Agent KYC & Accountability', icon: UserCheck },
  { id: 'platform-moderation', num: '05', title: 'Platform Moderation', icon: Eye },
  { id: 'data-protection', num: '06', title: 'Data Protection Measures', icon: Lock },
  { id: 'communication-safety', num: '07', title: 'Communication Safety', icon: MessageSquareWarning },
  { id: 'red-flags', num: '08', title: 'Common Scam Warning Signs', icon: AlertTriangle },
  { id: 'community-guidelines', num: '09', title: 'Community Guidelines', icon: Users },
  { id: 'enforcement', num: '10', title: 'Enforcement Actions', icon: Ban },
  { id: 'whistleblower', num: '11', title: 'Whistleblower Protection', icon: ShieldCheck },
  { id: 'transparency', num: '12', title: 'Transparency Reporting', icon: Megaphone },
  { id: 'grievance-officer', num: '13', title: 'Grievance Officer', icon: Scale },
  { id: 'reporting', num: '14', title: 'Report a Violation', icon: Flag },
];

const SectionHeader = ({ num, title }) => (
  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
      {num}
    </div>
    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
      {title}
    </h2>
  </div>
);

const TrustSafety = () => {
  const [active, setActive] = useState('commitment');
  const [searchQuery, setSearchQuery] = useState('');
  const [form, setForm] = useState({ email: '', company: '', jobTitle: '', type: 'fee-demand', details: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [incidentId, setIncidentId] = useState('');

  useEffect(() => {
    const onScroll = () => {
      let current = 'commitment';
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 140) {
          current = s.id;
        }
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const q = searchQuery.toLowerCase();
    return sections.filter(
      (s) => s.title.toLowerCase().includes(q) || s.num.includes(q)
    );
  }, [searchQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.details) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIncidentId('ML-TS-' + Math.floor(100000 + Math.random() * 900000));
      setSubmitted(true);
    }, 900);
  };

  return (
    <div className="bg-slate-900/5 min-h-screen pb-24 font-sans text-slate-800">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white relative overflow-hidden border-b border-indigo-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-14 relative z-10">

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Platform
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
              IT Rules 2021 Compliant
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
              Zero-Fee for Job Seekers
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight !text-white text-white drop-shadow-md mb-4">
            Moolu Trust &amp; Safety
          </h1>
          <p className="max-w-3xl text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            We are committed to keeping{' '}
            <a href="https://moolu.in" target="_blank" rel="noreferrer" className="text-indigo-400 font-medium underline hover:text-indigo-300">
              Moolu
            </a>{' '}
            free from fraud, scams, and harmful conduct. This page explains how we protect every user on the Platform and how you can report a problem.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <div className="text-2xl font-extrabold text-white mb-1">100%</div>
              <div className="text-xs text-slate-400">Free for Candidates</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <div className="text-2xl font-extrabold text-white mb-1">KYC</div>
              <div className="text-xs text-slate-400">Verified Agents</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <div className="text-2xl font-extrabold text-white mb-1">48h</div>
              <div className="text-xs text-slate-400">Report Response</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
              <div className="text-2xl font-extrabold text-white mb-1">24/7</div>
              <div className="text-xs text-slate-400">Platform Monitoring</div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Sticky Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 sticky top-24 z-20">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search sections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                <span>Table of Contents</span>
                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                  {filteredSections.length}
                </span>
              </div>

              <nav className="space-y-1 max-h-[calc(100vh-14rem)] overflow-y-auto pr-1 custom-scrollbar">
                {filteredSections.map((s) => {
                  const IconComponent = s.icon;
                  const isActive = active === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => scrollTo(s.id)}
                      className={`w-full flex items-center gap-2.5 text-left text-xs py-2 px-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white font-semibold shadow-sm shadow-indigo-600/30'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {s.num}
                      </span>
                      <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="truncate flex-1">{s.title}</span>
                      {isActive && <ChevronRight className="w-3 h-3 text-white shrink-0" />}
                    </button>
                  );
                })}
              </nav>

            </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-w-0 bg-white rounded-2xl p-6 sm:p-12 border border-slate-200 shadow-sm">
            <div className="space-y-12">

              {/* 1. Our Commitment */}
              <section id="commitment" className="scroll-mt-28">
                <SectionHeader num="01" title="Our Commitment" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Moolu is built on the principle that employment platforms should be <strong>safe, transparent, and free from exploitation</strong>. We enforce strict standards for every employer, agent, and listing on the Platform. These standards are non-negotiable.
                  </p>
                  <p>
                    Our Trust &amp; Safety policies are designed to protect three groups:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-indigo-50/80 p-4 rounded-xl border border-indigo-200/80 text-center">
                      <Users className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                      <strong className="text-indigo-800 block text-xs mb-1">Job Seekers</strong>
                      <p className="text-xs text-slate-600">Who trust us with their careers and personal data</p>
                    </div>
                    <div className="bg-indigo-50/80 p-4 rounded-xl border border-indigo-200/80 text-center">
                      <Building2 className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                      <strong className="text-indigo-800 block text-xs mb-1">Employers</strong>
                      <p className="text-xs text-slate-600">Who rely on us to find genuine, qualified talent</p>
                    </div>
                    <div className="bg-indigo-50/80 p-4 rounded-xl border border-indigo-200/80 text-center">
                      <UserCheck className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                      <strong className="text-indigo-800 block text-xs mb-1">Affiliate Agents</strong>
                      <p className="text-xs text-slate-600">Who refer businesses in good faith and accountability</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Zero-Fee for Candidates */}
              <section id="zero-fee" className="scroll-mt-28 pt-4">
                <SectionHeader num="02" title="Zero-Fee for Candidates" />
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/90 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-base mb-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Candidates Never Pay — This is Non-Negotiable</span>
                  </div>
                  <div className="text-sm text-slate-700 space-y-3 leading-relaxed">
                    <p>
                      <strong>Candidates never pay to apply for or obtain jobs on this Platform.</strong> Any employer who demands money from a job seeker — for interviews, training, background checks, equipment deposits, registration, or any other reason — is in <strong>direct violation</strong> of our Terms of Service and will be permanently removed from the Platform.
                    </p>
                    <p>
                      If an employer approaches you outside the Platform and asks for payment:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-emerald-900 font-medium">
                      <div className="bg-white/80 p-3 rounded-lg border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        Do NOT make any payment
                      </div>
                      <div className="bg-white/80 p-3 rounded-lg border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        Do NOT share financial details
                      </div>
                      <div className="bg-white/80 p-3 rounded-lg border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        Screenshot the conversation
                      </div>
                      <div className="bg-white/80 p-3 rounded-lg border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        Report it using the form below
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 3. Employer Vetting */}
              <section id="employer-vetting" className="scroll-mt-28 pt-4">
                <SectionHeader num="03" title="Employer Vetting" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    All employer accounts are reviewed before their listings are made publicly visible. Our multi-layer vetting process includes:
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">01</div>
                      <div>
                        <strong className="text-slate-900 text-xs block mb-1">Business Registration Verification</strong>
                        <p className="text-xs text-slate-600 leading-relaxed">Verification of business registration details (GSTIN or PAN) through publicly available government records and third-party verification services.</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">02</div>
                      <div>
                        <strong className="text-slate-900 text-xs block mb-1">Manual Job Description Review</strong>
                        <p className="text-xs text-slate-600 leading-relaxed">Manual review of job descriptions to flag misleading salary ranges, vague role definitions, unrealistic qualifications, or patterns associated with fraudulent postings.</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">03</div>
                      <div>
                        <strong className="text-slate-900 text-xs block mb-1">Automated Fraud Detection</strong>
                        <p className="text-xs text-slate-600 leading-relaxed">Automated detection of duplicate listings, known scam patterns, blacklisted domains, and suspicious employer behavior patterns.</p>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">04</div>
                      <div>
                        <strong className="text-slate-900 text-xs block mb-1">Agent Accountability Layer</strong>
                        <p className="text-xs text-slate-600 leading-relaxed">Employers referred by Affiliate Agents carry an additional layer of accountability, as Agents are themselves verified with government-issued KYC documents.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Agent KYC */}
              <section id="agent-kyc" className="scroll-mt-28 pt-4">
                <SectionHeader num="04" title="Agent KYC & Accountability" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Affiliate Agents who refer employers to the Platform are required to submit a valid government-issued ID (<strong>Aadhaar Card, PAN Card, Voter ID, or Passport</strong>) before receiving any commission payouts. This creates a documented chain of accountability for every employer on the Platform.
                  </p>
                  <p>
                    Agents are also granted limited moderation powers over their referred employers — they can suspend accounts that exhibit suspicious behaviour. This creates an additional safety layer at the network level.
                  </p>
                  <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Strict Enforcement:</strong> Any Agent found to have referred fraudulent employers, engaged in self-referral, created fictitious employer accounts, or abused their suspension powers will have their account <strong>permanently terminated</strong> and all accrued earnings forfeited without recourse.
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Platform Moderation */}
              <section id="platform-moderation" className="scroll-mt-28 pt-4">
                <SectionHeader num="05" title="Platform Moderation" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Moolu employs a combination of automated systems and manual human review to ensure the integrity of content and interactions on the Platform:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                      <strong className="text-indigo-700 block mb-1 text-xs">Automated Content Screening</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">Job listings and profile content are scanned for prohibited keywords, scam patterns, and policy violations before publication.</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                      <strong className="text-indigo-700 block mb-1 text-xs">Human Review Team</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">A dedicated team reviews flagged content, user reports, and edge cases that require human judgment and contextual understanding.</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                      <strong className="text-indigo-700 block mb-1 text-xs">Behavioral Monitoring</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">Unusual activity patterns — such as mass messaging, rapid profile changes, or suspicious application patterns — are flagged for review.</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                      <strong className="text-indigo-700 block mb-1 text-xs">Community Reporting</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">Users can report suspicious listings, employers, or communications at any time. All reports are investigated within 48 hours.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. Data Protection */}
              <section id="data-protection" className="scroll-mt-28 pt-4">
                <SectionHeader num="06" title="Data Protection Measures" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Protecting your personal data is fundamental to our trust commitment. The following measures are enforced at all times:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li><strong>Encryption:</strong> All data in transit is encrypted using SSL/TLS protocols. Sensitive data at rest is encrypted using industry-standard AES-256 encryption.</li>
                    <li><strong>Access Controls:</strong> Strict role-based access controls ensure that only authorized personnel can access user data, and only for legitimate operational purposes.</li>
                    <li><strong>Report Confidentiality:</strong> When you submit a trust &amp; safety report, your identity is kept confidential from the reported party. We never disclose reporter identities to accused employers or agents.</li>
                    <li><strong>Data Minimization:</strong> We collect only the minimum data necessary to provide our services and process reports effectively.</li>
                    <li><strong>Regular Audits:</strong> Our security infrastructure undergoes periodic internal audits and vulnerability assessments.</li>
                    <li><strong>DPDP Act Compliance:</strong> All data processing complies with the Digital Personal Data Protection Act, 2023 — see our <a href="/privacy" className="text-indigo-600 underline font-semibold">Privacy Policy</a> for full details.</li>
                  </ul>
                </div>
              </section>

              {/* 7. Communication Safety */}
              <section id="communication-safety" className="scroll-mt-28 pt-4">
                <SectionHeader num="07" title="Communication Safety" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Safe communication between candidates and employers is critical. Follow these guidelines to protect yourself during the recruitment process:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-emerald-50/80 p-3.5 rounded-lg border border-emerald-200/80">
                      <strong className="text-emerald-800 block mb-1 text-xs">✓ Do This</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">Communicate through the Platform&apos;s built-in messaging and official employer email domains whenever possible.</p>
                    </div>
                    <div className="bg-red-50/80 p-3.5 rounded-lg border border-red-200/80">
                      <strong className="text-red-800 block mb-1 text-xs">✗ Avoid This</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">Sharing personal phone numbers, Aadhaar/PAN details, or bank information before receiving a formal, written offer letter.</p>
                    </div>
                    <div className="bg-emerald-50/80 p-3.5 rounded-lg border border-emerald-200/80">
                      <strong className="text-emerald-800 block mb-1 text-xs">✓ Do This</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">Verify the employer&apos;s identity through their official company website, LinkedIn presence, and registered business details.</p>
                    </div>
                    <div className="bg-red-50/80 p-3.5 rounded-lg border border-red-200/80">
                      <strong className="text-red-800 block mb-1 text-xs">✗ Avoid This</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">Accepting interviews or job offers conducted entirely through WhatsApp, Telegram, or personal email accounts.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 8. Scam Warning Signs */}
              <section id="red-flags" className="scroll-mt-28 pt-4">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 font-bold text-sm">
                    08
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">8. Common Scam Warning Signs</h2>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/90 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2.5 text-red-900 font-bold text-base mb-3">
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                    <span>Red Flags — Report Immediately If Encountered</span>
                  </div>
                  <p className="text-xs text-slate-700 mb-4 leading-relaxed">
                    Job seekers should be cautious of the following warning signs during any recruitment process. If any apply, <strong>do not proceed</strong> — report the listing or employer immediately:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-800 font-medium">
                    <div className="bg-white/80 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                      Being asked to pay a fee for interviews, offer letters, or background verification
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                      Receiving a job offer without completing a formal interview process
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                      Recruitment emails from free services (Gmail, Yahoo, Outlook) instead of corporate domains
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                      Requests to share Aadhaar, PAN, or bank details before a formal offer letter is signed
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                      Vague job descriptions with unusually high salaries for minimal qualifications
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                      Communication conducted entirely through WhatsApp or Telegram with no verifiable company details
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                      Requests to install remote access software (AnyDesk, TeamViewer) on your device
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                      Pressure to make immediate decisions without time to review offer terms
                    </div>
                  </div>
                </div>
              </section>

              {/* 9. Community Guidelines */}
              <section id="community-guidelines" className="scroll-mt-28 pt-4">
                <SectionHeader num="09" title="Community Guidelines" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    All users of the Platform are expected to adhere to the following community standards. These guidelines foster a professional and respectful environment for everyone:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li><strong>Honesty:</strong> Provide truthful information in profiles, applications, and job listings. Misrepresentation of qualifications, experience, or company details is prohibited.</li>
                    <li><strong>Respect:</strong> Treat all users with courtesy and professionalism. Harassment, discrimination, abusive language, and threatening behaviour will not be tolerated.</li>
                    <li><strong>Privacy:</strong> Do not collect, store, or share other users&apos; personal information for purposes beyond the intended recruitment process.</li>
                    <li><strong>Compliance:</strong> Follow all applicable Indian labour laws, employment regulations, and data protection requirements.</li>
                    <li><strong>Good Faith:</strong> Use the Platform for its intended purpose — genuine employment seeking, hiring, or referral activities only.</li>
                    <li><strong>Accountability:</strong> Take responsibility for your actions on the Platform. Report violations when you see them to help maintain a safe community.</li>
                  </ul>
                </div>
              </section>

              {/* 10. Enforcement Actions */}
              <section id="enforcement" className="scroll-mt-28 pt-4">
                <SectionHeader num="10" title="Enforcement Actions" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Upon receiving a report or detecting a violation through our monitoring systems, our Trust &amp; Safety team may take one or more of the following actions:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                      <strong className="text-slate-900 block mb-1 text-xs">⚡ Immediate Listing Removal</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">Remove the offending job listing from the Platform immediately pending investigation.</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                      <strong className="text-slate-900 block mb-1 text-xs">🔒 Account Suspension</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">Suspend the employer or user account temporarily while the investigation is conducted.</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                      <strong className="text-slate-900 block mb-1 text-xs">🚫 Permanent Termination</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">Permanently terminate the employer account for confirmed violations, with no option for reinstatement.</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                      <strong className="text-slate-900 block mb-1 text-xs">📢 Agent Notification</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">Notify the referring Affiliate Agent about the violation and take appropriate action on their account if warranted.</p>
                    </div>
                    <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 sm:col-span-2">
                      <strong className="text-slate-900 block mb-1 text-xs">🏛️ Law Enforcement Referral</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">Provide information to law enforcement or regulatory authorities where required by Indian law, including under the IT Act 2000 and IT Intermediary Rules 2021.</p>
                    </div>
                  </div>
                  <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-900 leading-relaxed flex items-start gap-2.5">
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Response Timelines:</strong> We acknowledge all reports within <strong>48 hours</strong> and provide a final resolution within the timelines required by the IT Intermediary Rules, 2021 (generally 15 business days for non-emergency matters, and <strong>36 hours</strong> for urgent content removal requests).
                    </div>
                  </div>
                </div>
              </section>

              {/* 11. Whistleblower Protection */}
              <section id="whistleblower" className="scroll-mt-28 pt-4">
                <SectionHeader num="11" title="Whistleblower Protection" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Moolu is committed to protecting users who report violations in good faith. Our whistleblower protection guarantees:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li><strong>Anonymity:</strong> Your identity as a reporter will never be disclosed to the reported party without your explicit written consent.</li>
                    <li><strong>No Retaliation:</strong> We prohibit any form of retaliation against users who submit reports. If you experience retaliation, report it to us immediately and we will take additional enforcement action.</li>
                    <li><strong>Good Faith Protection:</strong> Reports made in good faith will not result in any negative consequences for the reporter, even if the investigation does not substantiate the claims.</li>
                    <li><strong>Confidential Processing:</strong> All report details are handled by a limited team with strict need-to-know access controls.</li>
                  </ul>
                  <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Note:</strong> Deliberately false or malicious reports intended to harm legitimate employers or users may result in enforcement action against the reporter, including account suspension.
                    </div>
                  </div>
                </div>
              </section>

              {/* 12. Transparency Reporting */}
              <section id="transparency" className="scroll-mt-28 pt-4">
                <SectionHeader num="12" title="Transparency Reporting" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Moolu is committed to transparency in its trust and safety operations. In accordance with the IT Intermediary Rules, 2021, we commit to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li>Publishing periodic compliance reports detailing the number of reports received, actions taken, and resolution timelines.</li>
                    <li>Disclosing the types and categories of violations reported and addressed on the Platform.</li>
                    <li>Providing aggregate statistics on employer account removals and listing takedowns.</li>
                    <li>Maintaining records of all enforcement actions as required by applicable law.</li>
                    <li>Cooperating with government authorities and regulatory bodies in a transparent manner.</li>
                  </ul>
                </div>
              </section>

              {/* 13. Grievance Officer */}
              <section id="grievance-officer" className="scroll-mt-28 pt-4">
                <SectionHeader num="13" title="Grievance Officer" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    For formal legal complaints under the IT Act, 2000 and related rules, you may contact our designated Grievance Officer:
                  </p>

                  <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 shadow-xl border border-indigo-800/40 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative z-10 space-y-5">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white tracking-wide">Grievance Redressal Officer</h3>
                          <p className="text-xs text-slate-400">Designated Officer under IT Intermediary Rules, 2021</p>
                        </div>
                        <span className="bg-indigo-500/20 text-indigo-300 text-xs px-3 py-1 rounded-full border border-indigo-500/30">
                          moolu.in
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                          <Mail className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs text-slate-400 block font-medium">Email</span>
                            <a href="mailto:info@moolu.in" className="text-white font-semibold hover:text-indigo-300 transition-colors underline">
                              info@moolu.in
                            </a>
                          </div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs text-slate-400 block font-medium">Registered Office</span>
                            <span className="text-white font-semibold block">Mangalore, Karnataka, India</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white/5 p-3 rounded-lg border border-white/10 text-xs text-slate-300">
                        <strong className="text-white">Response time:</strong> Acknowledgment within 48 hours; resolution within 15 business days as per IT Intermediary Rules, 2021.
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 14. Report a Violation */}
              <section id="reporting" className="scroll-mt-28 pt-4">
                <SectionHeader num="14" title="Report a Violation" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    If you have encountered a suspicious employer, job listing, or any conduct that violates our policies, please report it below. Our Trust &amp; Safety team reviews all submissions and will take appropriate action within <strong>36 hours</strong> of receiving a complaint, as required under the IT Intermediary Rules, 2021.
                  </p>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mt-4">
                    {submitted ? (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                        </div>
                        <p className="font-bold text-slate-900 text-sm mb-1">Report Submitted Successfully</p>
                        <p className="text-xs text-slate-500 mb-4">Our Trust &amp; Safety team will review this within 36 hours and take appropriate action.</p>
                        <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 inline-block mb-4">
                          <p className="text-xs text-slate-500">Incident Reference ID</p>
                          <p className="text-sm font-mono font-bold text-indigo-700">{incidentId}</p>
                        </div>
                        <br />
                        <button
                          onClick={() => { setSubmitted(false); setForm({ email: '', company: '', jobTitle: '', type: 'fee-demand', details: '' }); }}
                          className="text-xs text-indigo-600 hover:underline bg-transparent border-0 cursor-pointer font-semibold"
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
                              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Type of incident</label>
                            <select
                              value={form.type}
                              onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                            >
                              <option value="fee-demand">Fee demand from employer</option>
                              <option value="fake-company">Fake or impersonating company</option>
                              <option value="data-misuse">Misuse of personal data</option>
                              <option value="harassment">Harassment or abuse</option>
                              <option value="misleading-listing">Misleading job listing</option>
                              <option value="identity-theft">Identity theft or impersonation</option>
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
                              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Job title (if applicable)</label>
                            <input
                              type="text"
                              value={form.jobTitle}
                              onChange={e => setForm(p => ({ ...p, jobTitle: e.target.value }))}
                              placeholder="e.g. Sales Executive"
                              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
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
                            placeholder="Please describe what happened, including any amounts demanded, email addresses used, phone numbers, screenshots, or links to the listing..."
                            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none bg-white"
                          />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <p className="text-xs text-slate-400">Your identity will remain confidential.</p>
                          <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg border-0 cursor-pointer transition-colors disabled:opacity-50 shadow-sm shadow-indigo-600/20"
                          >
                            {submitting ? 'Submitting…' : 'Submit Report'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </section>

            </div>
          </main>

        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default TrustSafety;
