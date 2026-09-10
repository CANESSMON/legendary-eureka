import React, { useState, useEffect, useMemo } from 'react';
import {
  FileText,
  Scale,
  UserCheck,
  Briefcase,
  CreditCard,
  Users,
  ShieldAlert,
  FileCheck,
  AlertTriangle,
  XCircle,
  Gavel,
  Mail,
  Globe,
  MapPin,
  ChevronRight,
  Search,
  ShieldCheck,
  BookOpen,
  RefreshCw,
  Lock,
  Handshake,
  Ban,
  ScrollText,
  AlertCircle,
  Building2,
} from 'lucide-react';

const sections = [
  { id: 'agreement', num: '01', title: 'Agreement to Terms', icon: FileText },
  { id: 'eligibility', num: '02', title: 'Eligibility', icon: UserCheck },
  { id: 'job-seekers', num: '03', title: 'Job Seekers', icon: Search },
  { id: 'employers', num: '04', title: 'Employers', icon: Briefcase },
  { id: 'pricing', num: '05', title: 'Pricing & Payments', icon: CreditCard },
  { id: 'agents', num: '06', title: 'Affiliate Agents', icon: Users },
  { id: 'prohibited', num: '07', title: 'Prohibited Conduct', icon: Ban },
  { id: 'content', num: '08', title: 'User Content', icon: FileCheck },
  { id: 'intellectual-property', num: '09', title: 'Intellectual Property', icon: Lock },
  { id: 'disclaimers', num: '10', title: 'Disclaimers', icon: AlertCircle },
  { id: 'liability', num: '11', title: 'Limitation of Liability', icon: Scale },
  { id: 'indemnification', num: '12', title: 'Indemnification', icon: ShieldCheck },
  { id: 'termination', num: '13', title: 'Termination', icon: XCircle },
  { id: 'force-majeure', num: '14', title: 'Force Majeure', icon: AlertTriangle },
  { id: 'dispute-resolution', num: '15', title: 'Dispute Resolution', icon: Gavel },
  { id: 'governing-law', num: '16', title: 'Governing Law', icon: ScrollText },
  { id: 'severability', num: '17', title: 'Severability', icon: BookOpen },
  { id: 'waiver', num: '18', title: 'Waiver', icon: Handshake },
  { id: 'amendments', num: '19', title: 'Amendments', icon: RefreshCw },
  { id: 'entire-agreement', num: '20', title: 'Entire Agreement', icon: FileText },
  { id: 'contact', num: '21', title: 'Contact Us', icon: Mail },
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

const WarningSectionHeader = ({ num, title }) => (
  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
    <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 font-bold text-sm">
      {num}
    </div>
    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
      {title}
    </h2>
  </div>
);

const TermsOfService = () => {
  const [active, setActive] = useState('agreement');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => {
      let current = 'agreement';
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

  return (
    <div className="bg-slate-900/5 min-h-screen pb-24 font-sans text-slate-800">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white relative overflow-hidden border-b border-indigo-900/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-14 relative z-10">

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
              <Scale className="w-3.5 h-3.5 text-indigo-400" />
              Legal Document
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
              IT Act 2000 Compliant
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
              IT Rules 2021 Compliant
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight !text-white text-white drop-shadow-md mb-4">
            Moolu Terms of Service
          </h1>
          <p className="max-w-3xl text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
            These Terms of Service govern your access to and use of the Moolu platform
            (&quot;Platform&quot;), operated at{' '}
            <a href="https://moolu.in" target="_blank" rel="noreferrer" className="text-indigo-400 font-medium underline hover:text-indigo-300">
              moolu.in
            </a>. By using the Platform, you agree to be legally bound by these Terms.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Effective Date:</span>
              <span className="font-semibold text-slate-200">2 September 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Jurisdiction:</span>
              <span className="font-semibold text-slate-200">Republic of India</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Contact:</span>
              <a href="mailto:info@moolu.in" className="font-semibold text-indigo-400 hover:underline">info@moolu.in</a>
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

              {/* Search */}
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

              {/* 1. Agreement to Terms */}
              <section id="agreement" className="scroll-mt-28">
                <SectionHeader num="01" title="Agreement to Terms" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    By accessing or using the Moolu platform (&quot;Platform&quot;), available at <a href="https://moolu.in" target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold underline">moolu.in</a>, you agree to be legally bound by these Terms of Service (&quot;Terms&quot;). These Terms apply to all visitors, registered Job Seekers, Employers, and Affiliate Agents.
                  </p>
                  <p>
                    If you do not agree to any part of these Terms, you must discontinue use of the Platform immediately. Continued use of the Platform constitutes your ongoing acceptance of these Terms as they may be updated from time to time.
                  </p>
                  <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-4 text-xs text-indigo-900 leading-relaxed flex items-start gap-2.5">
                    <BookOpen className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Legal Basis:</strong> These Terms are published in compliance with Rule 3(1) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, which requires intermediaries to publish their rules, regulations, privacy policy, and terms of service for public access.
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. Eligibility */}
              <section id="eligibility" className="scroll-mt-28 pt-4">
                <SectionHeader num="02" title="Eligibility" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    To register on and use the Platform, you must meet the following eligibility criteria:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li>You must be at least <strong>18 years of age</strong> and competent to enter into a binding contract under the Indian Contract Act, 1872.</li>
                    <li>All information provided during registration must be <strong>accurate, complete, and current</strong>. You are responsible for updating your information promptly if it changes.</li>
                    <li>You must not have been previously suspended or removed from the Platform for violations of these Terms.</li>
                    <li>If registering on behalf of an organization, you represent and warrant that you have the authority to bind that organization to these Terms.</li>
                  </ul>
                  <p>
                    We reserve the right to suspend or terminate accounts found to have provided false, misleading, or fraudulent information at any stage.
                  </p>
                </div>
              </section>

              {/* 3. Job Seekers */}
              <section id="job-seekers" className="scroll-mt-28 pt-4">
                <SectionHeader num="03" title="Job Seekers" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Job Seekers may browse and apply to job listings on the Platform free of charge. By using the Platform as a Job Seeker, you agree to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li>Provide accurate and truthful information in your profile, resume, and all job applications.</li>
                    <li>Not misrepresent your qualifications, work experience, educational background, or identity in any form.</li>
                    <li>Not submit duplicate, automated, or bulk applications using scripts, bots, or third-party tools.</li>
                    <li>Not use the Platform for any purpose other than genuine employment seeking.</li>
                    <li>Keep your account credentials confidential and not share your login with third parties.</li>
                  </ul>
                  <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Platform Disclaimer:</strong> Moolu acts as an intermediary under Section 79 of the IT Act, 2000, and does not guarantee job placements, interview invitations, employer responses, or specific employment outcomes. The Platform facilitates connections between candidates and employers but does not participate in hiring decisions.
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Employers */}
              <section id="employers" className="scroll-mt-28 pt-4">
                <SectionHeader num="04" title="Employers" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Employers may post up to <strong>3 job listings at no cost</strong> (lifetime free tier). Additional job posts require the purchase of credits. By posting a listing, you agree that:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li>All job descriptions are <strong>accurate, genuine, and for real positions</strong> within your organization or on behalf of a verified client.</li>
                    <li>You will <strong>not charge candidates any fees</strong> — including interview fees, training fees, equipment fees, documentation fees, or security deposits — at any stage of the recruitment process.</li>
                    <li>Job listings must not be discriminatory on the basis of religion, caste, gender, disability, or any other protected characteristic under Indian law.</li>
                    <li>Listings must not be deceptive, misleading regarding compensation or role responsibilities, or in violation of any applicable Indian labour law including the Contract Labour Act, the Shops and Establishments Act, and applicable minimum wage regulations.</li>
                    <li>You acknowledge that Moolu reserves the right to <strong>reject, unpublish, or remove</strong> any listing that violates these standards, with or without prior notice.</li>
                  </ul>
                </div>
              </section>

              {/* 5. Pricing & Payments */}
              <section id="pricing" className="scroll-mt-28 pt-4">
                <SectionHeader num="05" title="Pricing & Payments" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-4">
                  <p>Paid job post credits are available in the following bundles, excluding GST:</p>

                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                          <th className="text-left px-4 py-3 font-bold text-slate-900">Bundle</th>
                          <th className="text-left px-4 py-3 font-bold text-slate-900">Credits</th>
                          <th className="text-left px-4 py-3 font-bold text-slate-900">Price (excl. GST)</th>
                          <th className="text-left px-4 py-3 font-bold text-slate-900">GST (18%)</th>
                          <th className="text-left px-4 py-3 font-bold text-slate-900">Total</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-700">
                        <tr className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-3 font-semibold">Starter</td>
                          <td className="px-4 py-3">1 post</td>
                          <td className="px-4 py-3">₹83.90</td>
                          <td className="px-4 py-3">₹15.10</td>
                          <td className="px-4 py-3 font-bold text-indigo-700">₹99.00</td>
                        </tr>
                        <tr className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-3 font-semibold">Standard</td>
                          <td className="px-4 py-3">5 posts</td>
                          <td className="px-4 py-3">₹338.14</td>
                          <td className="px-4 py-3">₹60.86</td>
                          <td className="px-4 py-3 font-bold text-indigo-700">₹399.00</td>
                        </tr>
                        <tr className="hover:bg-slate-50/60 transition-colors">
                          <td className="px-4 py-3 font-semibold">Value</td>
                          <td className="px-4 py-3">10 posts</td>
                          <td className="px-4 py-3">₹592.37</td>
                          <td className="px-4 py-3">₹106.63</td>
                          <td className="px-4 py-3 font-bold text-indigo-700">₹699.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80">
                      <h3 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2 text-indigo-700">
                        <CreditCard className="w-4 h-4" />
                        Payment Processing
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        All payments are processed by <strong>Razorpay</strong>, a PCI-DSS compliant payment gateway. Moolu does not store your card details. A tax invoice (GST-compliant) will be issued to your registered email address after each successful transaction.
                      </p>
                    </div>
                    <div className="bg-amber-50/80 rounded-xl p-5 border border-amber-200/80">
                      <h3 className="font-bold text-amber-900 text-sm mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        Refund Policy
                      </h3>
                      <p className="text-xs text-amber-800 leading-relaxed">
                        All credit purchases are <strong>non-refundable</strong>. Credits are added to your account immediately upon payment verification and cannot be exchanged for cash, transferred to another account, or carried forward beyond 12 months from the date of purchase.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 6. Affiliate Agents */}
              <section id="agents" className="scroll-mt-28 pt-4">
                <SectionHeader num="06" title="Affiliate Agents" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Affiliate Agents are individuals who refer Employers to the Platform in exchange for commission earnings. By registering as an Agent, you agree to the following:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <strong className="text-indigo-700 block mb-1.5 text-xs">KYC Compliance</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">You must submit a valid government-issued ID (Aadhaar, PAN, Voter ID, or Passport) before any payout is disbursed. Payouts will be withheld until verification is complete.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <strong className="text-indigo-700 block mb-1.5 text-xs">Accurate Payout Details</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">You are responsible for the accuracy of your UPI ID or bank account details. Paste functionality is disabled on payout fields; all details must be typed and confirmed manually.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <strong className="text-indigo-700 block mb-1.5 text-xs">No Self-Referral</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">Agents may not refer their own companies, create fictitious employer accounts, or engage in any activity designed to fraudulently generate commission income.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <strong className="text-indigo-700 block mb-1.5 text-xs">Suspension Powers</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">Agents may suspend referred employers for legitimate reasons. Abuse of the suspension feature will result in Agent account termination and forfeiture of all accrued earnings.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 7. Prohibited Conduct */}
              <section id="prohibited" className="scroll-mt-28 pt-4">
                <WarningSectionHeader num="07" title="Prohibited Conduct" />
                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/90 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2.5 text-red-900 font-bold text-base mb-3">
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                    <span>Strictly Prohibited Activities</span>
                  </div>
                  <p className="text-xs text-slate-700 mb-4 leading-relaxed">
                    All users are prohibited from the following, as listed in Rule 3(1)(b) of the IT Rules, 2021. Violations may result in <strong>immediate account suspension or termination</strong> and may be reported to the relevant authorities:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-800 font-medium">
                    <div className="bg-white/80 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                      Posting content that is defamatory, obscene, pornographic, or invasive of another person&apos;s privacy
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                      Impersonating any person, company, or government entity
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                      Attempting to gain unauthorized access to our systems or another user&apos;s account
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                      Using automated scripts, bots, or scraping tools to extract data from the Platform
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                      Publishing content that threatens the sovereignty, integrity, or security of India
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                      Engaging in multi-level marketing, pyramid schemes, or employment fraud
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                      Transmitting malware, viruses, or any code designed to disrupt Platform operations
                    </div>
                    <div className="bg-white/80 p-3 rounded-lg border border-red-100 flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-1" />
                      Soliciting personal financial information from other users under any pretext
                    </div>
                  </div>
                </div>
              </section>

              {/* 8. User Content */}
              <section id="content" className="scroll-mt-28 pt-4">
                <SectionHeader num="08" title="User Content" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    By submitting content (resumes, job descriptions, profile photographs, company logos, or any other materials) to the Platform, you grant Moolu a non-exclusive, royalty-free, worldwide licence to display, reproduce, and process that content solely for the purpose of operating the Platform and providing our services.
                  </p>
                  <p>
                    You retain full ownership of your content. We do not claim any intellectual property rights over user-submitted content. You may delete your content at any time by removing it from your profile or requesting account deletion.
                  </p>
                  <p>
                    You are solely responsible for ensuring that your content:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li>Does not infringe on any third-party intellectual property rights, including copyright, trademark, or trade secret rights.</li>
                    <li>Does not contain malware, viruses, or any harmful code.</li>
                    <li>Does not violate any applicable law, regulation, or third-party right.</li>
                    <li>Is truthful and not misleading in any material respect.</li>
                  </ul>
                </div>
              </section>

              {/* 9. Intellectual Property */}
              <section id="intellectual-property" className="scroll-mt-28 pt-4">
                <SectionHeader num="09" title="Intellectual Property" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    The Moolu name, logo, brand identity, website design, user interface, source code, algorithms, and all associated materials are the exclusive intellectual property of Moolu and are protected under the Copyright Act, 1957 and the Trade Marks Act, 1999.
                  </p>
                  <p>
                    No part of the Platform may be reproduced, distributed, modified, reverse-engineered, or used for commercial purposes without prior written consent from Moolu. Unauthorized use of our intellectual property may result in legal action.
                  </p>
                </div>
              </section>

              {/* 10. Disclaimers */}
              <section id="disclaimers" className="scroll-mt-28 pt-4">
                <SectionHeader num="10" title="Disclaimers" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-5 text-xs text-amber-900 leading-relaxed">
                    <strong className="block mb-2 text-sm">Service Provided &quot;As-Is&quot;</strong>
                    <p className="mb-2">
                      The Platform is provided on an <strong>&quot;as-is&quot;</strong> and <strong>&quot;as-available&quot;</strong> basis. Moolu makes no warranties, express or implied, regarding the Platform&apos;s reliability, availability, fitness for a particular purpose, or non-infringement.
                    </p>
                    <p className="mb-2">
                      We do not warrant that the Platform will be uninterrupted, error-free, secure, or free from viruses or other harmful components. We do not guarantee the accuracy, completeness, or timeliness of any content posted by third-party users including job listings, company profiles, or candidate information.
                    </p>
                    <p>
                      Moolu does not endorse, verify, or guarantee any employer, job listing, or candidate on the Platform. Users are advised to conduct their own due diligence before entering into any employment arrangement.
                    </p>
                  </div>
                </div>
              </section>

              {/* 11. Limitation of Liability */}
              <section id="liability" className="scroll-mt-28 pt-4">
                <SectionHeader num="11" title="Limitation of Liability" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Moolu is an intermediary under <strong>Section 79 of the IT Act, 2000</strong>, and is not liable for the conduct of its users or the accuracy of content posted on the Platform by third parties.
                  </p>
                  <p>
                    To the maximum extent permitted by applicable Indian law, Moolu&apos;s total aggregate liability for any claim arising out of or relating to these Terms or your use of the Platform shall not exceed the <strong>amount you paid to Moolu in the three (3) months immediately preceding the event</strong> giving rise to the claim.
                  </p>
                  <p>
                    In no event shall Moolu be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li>Loss of data, income, profits, or business opportunities</li>
                    <li>Business interruption or loss of goodwill</li>
                    <li>Cost of substitute services or procurement</li>
                    <li>Damages arising from unauthorized access to or alteration of your data</li>
                    <li>Any conduct or content of any third party on the Platform</li>
                  </ul>
                </div>
              </section>

              {/* 12. Indemnification */}
              <section id="indemnification" className="scroll-mt-28 pt-4">
                <SectionHeader num="12" title="Indemnification" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    You agree to indemnify, defend, and hold harmless Moolu, its affiliates, officers, directors, employees, agents, and licensors from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising out of or in connection with:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li>Your use of or inability to use the Platform</li>
                    <li>Your violation of these Terms or any applicable law</li>
                    <li>Your violation of any rights of a third party, including intellectual property rights</li>
                    <li>Any content you submit, post, or transmit through the Platform</li>
                    <li>Any misrepresentation made by you regarding your qualifications, identity, or business</li>
                  </ul>
                  <p>
                    This indemnification obligation will survive the termination of your account and these Terms.
                  </p>
                </div>
              </section>

              {/* 13. Termination */}
              <section id="termination" className="scroll-mt-28 pt-4">
                <SectionHeader num="13" title="Termination" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    We may suspend or terminate your account at any time, with or without cause, if you violate these Terms or engage in conduct that we reasonably believe is harmful to the Platform, other users, or third parties.
                  </p>
                  <p>
                    You may delete your account at any time through your account settings or by contacting <a href="mailto:info@moolu.in" className="text-indigo-600 font-semibold underline">info@moolu.in</a>.
                  </p>
                  <p>Upon termination:</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li>Your right to access and use the Platform ceases immediately.</li>
                    <li>Any unused credits in your account will be forfeited and are non-refundable.</li>
                    <li>We may retain certain data as required by law or for legitimate business purposes (see our Privacy Policy).</li>
                    <li>Provisions relating to intellectual property, indemnification, limitation of liability, and governing law shall survive termination.</li>
                  </ul>
                </div>
              </section>

              {/* 14. Force Majeure */}
              <section id="force-majeure" className="scroll-mt-28 pt-4">
                <SectionHeader num="14" title="Force Majeure" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Moolu shall not be held liable for any failure or delay in performing its obligations under these Terms if such failure or delay results from circumstances beyond its reasonable control, including but not limited to:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li>Natural disasters, epidemics, pandemics, or acts of God</li>
                    <li>War, terrorism, civil unrest, or government sanctions</li>
                    <li>Power outages, internet disruptions, or telecommunications failures</li>
                    <li>Cyberattacks, DDoS attacks, or other security incidents beyond our control</li>
                    <li>Changes in applicable law or government regulation</li>
                    <li>Acts or omissions of third-party service providers</li>
                  </ul>
                  <p>
                    In such events, Moolu will make reasonable efforts to resume service as soon as practicable and will notify affected users of any material interruption.
                  </p>
                </div>
              </section>

              {/* 15. Dispute Resolution */}
              <section id="dispute-resolution" className="scroll-mt-28 pt-4">
                <SectionHeader num="15" title="Dispute Resolution" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    In the event of any dispute, claim, or controversy arising out of or relating to these Terms or the Platform, the parties agree to the following resolution process:
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <strong className="text-indigo-700 block mb-1.5 text-xs">Step 1: Direct Communication</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">We encourage resolution of disputes through direct communication. You may contact us at <a href="mailto:info@moolu.in" className="text-indigo-600 underline">info@moolu.in</a> to attempt informal resolution before initiating any formal proceedings.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <strong className="text-indigo-700 block mb-1.5 text-xs">Step 2: Mediation</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">If informal resolution fails within 30 days, either party may propose mediation through a mutually agreed mediator in Mangalore, Karnataka, India. Mediation costs shall be shared equally.</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                      <strong className="text-indigo-700 block mb-1.5 text-xs">Step 3: Legal Proceedings</strong>
                      <p className="text-xs text-slate-600 leading-relaxed">If mediation does not resolve the dispute within 60 days, either party may initiate legal proceedings subject to the exclusive jurisdiction of the competent courts in Mangalore, Karnataka, India.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 16. Governing Law */}
              <section id="governing-law" className="scroll-mt-28 pt-4">
                <SectionHeader num="16" title="Governing Law" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws of the <strong>Republic of India</strong>, without regard to its conflict of law provisions. Key applicable legislation includes:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li>The Information Technology Act, 2000 and its amendments</li>
                    <li>The Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021</li>
                    <li>The Digital Personal Data Protection Act, 2023</li>
                    <li>The Indian Contract Act, 1872</li>
                    <li>The Consumer Protection Act, 2019</li>
                  </ul>
                  <p>
                    Any dispute arising from or relating to these Terms shall be subject to the <strong>exclusive jurisdiction of the competent courts in Mangalore, Karnataka, India</strong>.
                  </p>
                </div>
              </section>

              {/* 17. Severability */}
              <section id="severability" className="scroll-mt-28 pt-4">
                <SectionHeader num="17" title="Severability" />
                <p className="text-slate-700 text-sm leading-relaxed">
                  If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such invalidity shall not affect the remaining provisions, which shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving the original intent of the parties.
                </p>
              </section>

              {/* 18. Waiver */}
              <section id="waiver" className="scroll-mt-28 pt-4">
                <SectionHeader num="18" title="Waiver" />
                <p className="text-slate-700 text-sm leading-relaxed">
                  The failure of Moolu to enforce any right or provision of these Terms shall not constitute a waiver of such right or provision. Any waiver of any provision of these Terms will be effective only if in writing and signed by Moolu. A waiver of any right on one occasion shall not be construed as a waiver of that right on any subsequent occasion.
                </p>
              </section>

              {/* 19. Amendments */}
              <section id="amendments" className="scroll-mt-28 pt-4">
                <SectionHeader num="19" title="Amendments" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Moolu reserves the right to modify, update, or replace these Terms at any time. Material changes will be communicated through:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li>A prominent notice on the Platform homepage or within your account dashboard</li>
                    <li>An email notification to your registered email address</li>
                    <li>An updated &quot;Effective Date&quot; at the top of these Terms</li>
                  </ul>
                  <p>
                    Your continued use of the Platform after such changes constitutes acceptance of the revised Terms. If you do not agree with the revised Terms, you must discontinue use of the Platform and may request account deletion.
                  </p>
                </div>
              </section>

              {/* 20. Entire Agreement */}
              <section id="entire-agreement" className="scroll-mt-28 pt-4">
                <SectionHeader num="20" title="Entire Agreement" />
                <p className="text-slate-700 text-sm leading-relaxed">
                  These Terms, together with our <a href="/privacy" className="text-indigo-600 font-semibold underline">Privacy Policy</a> and <a href="/safety" className="text-indigo-600 font-semibold underline">Trust &amp; Safety Policy</a>, constitute the entire agreement between you and Moolu regarding your use of the Platform. These Terms supersede all prior and contemporaneous understandings, agreements, representations, and warranties, both written and oral, regarding the Platform.
                </p>
              </section>

              {/* 21. Contact Us */}
              <section id="contact" className="scroll-mt-28 pt-6">
                <SectionHeader num="21" title="Contact Us" />
                <p className="text-slate-700 text-sm mb-4">
                  For questions about these Terms, to report a violation, or for any legal inquiries:
                </p>

                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-800/40 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-wide">Moolu — Legal &amp; Compliance</h3>
                        <p className="text-xs text-slate-400">Official Legal Contact for Terms of Service</p>
                      </div>
                      <span className="bg-indigo-500/20 text-indigo-300 text-xs px-3 py-1 rounded-full border border-indigo-500/30">
                        moolu.in
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                        <Globe className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-slate-400 block font-medium">Website</span>
                          <a
                            href="https://moolu.in"
                            target="_blank"
                            rel="noreferrer"
                            className="text-white font-semibold hover:text-indigo-300 transition-colors underline"
                          >
                            https://moolu.in
                          </a>
                        </div>
                      </div>

                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                        <Mail className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-slate-400 block font-medium">Email</span>
                          <a
                            href="mailto:info@moolu.in"
                            className="text-white font-semibold hover:text-indigo-300 transition-colors underline"
                          >
                            info@moolu.in
                          </a>
                        </div>
                      </div>

                      <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs text-slate-400 block font-medium">Registered Office</span>
                          <span className="text-white font-semibold block">
                            Mangalore, Karnataka, India
                          </span>
                        </div>
                      </div>
                    </div>
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

export default TermsOfService;
