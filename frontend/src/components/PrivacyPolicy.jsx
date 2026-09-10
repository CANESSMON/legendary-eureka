import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  FileText,
  Lock,
  UserCheck,
  Scale,
  Building2,
  Mail,
  Globe,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Search,
  BookOpen,
  Bell,
  Key,
  RefreshCw,
  UserX,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  Share2,
  Database,
  ExternalLink,
  ShieldAlert,
  Server
} from 'lucide-react';

const sections = [
  { id: 'about-moolu', num: '01', title: 'About Moolu', icon: Building2 },
  { id: 'information-we-collect', num: '02', title: 'Information We Collect', icon: Database },
  { id: 'how-we-use', num: '03', title: 'How We Use Your Data', icon: BookOpen },
  { id: 'job-applications', num: '04', title: 'Applications & Candidate Profiles', icon: FileText },
  { id: 'shared-employers', num: '05', title: 'Sharing with Employers & Recruiters', icon: Share2 },
  { id: 'service-providers', num: '06', title: 'Information Shared with Service Providers', icon: Server },
  { id: 'legal-disclosures', num: '07', title: 'Legal & Regulatory Disclosures', icon: Scale },
  { id: 'business-transfers', num: '08', title: 'Business Transfers', icon: RefreshCw },
  { id: 'data-retention', num: '09', title: 'Data Retention', icon: Database },
  { id: 'data-security', num: '10', title: 'Data Security', icon: Lock },
  { id: 'your-responsibility', num: '11', title: 'Your Responsibility', icon: Key },
  { id: 'your-rights', num: '12', title: 'Your Rights (DPDP Act 2023)', icon: UserCheck },
  { id: 'withdraw-consent', num: '13', title: 'How to Withdraw Consent', icon: UserX },
  { id: 'accuracy-info', num: '14', title: 'Accuracy of Information', icon: CheckCircle2 },
  { id: 'childrens-privacy', num: '15', title: 'Children\'s Privacy', icon: ShieldCheck },
  { id: 'third-party-links', num: '16', title: 'Third-Party Websites & Links', icon: ExternalLink },
  { id: 'recruitment-communications', num: '17', title: 'Third-Party Recruitment Communications', icon: Mail },
  { id: 'fraud-prevention', num: '18', title: 'Fraud & Scam Prevention', icon: ShieldAlert },
  { id: 'marketing-comms', num: '19', title: 'Marketing Communications', icon: Bell },
  { id: 'data-transfers', num: '20', title: 'Data Transfers', icon: Globe },
  { id: 'changes-information', num: '21', title: 'Updating Your Information', icon: RefreshCw },
  { id: 'data-breaches', num: '22', title: 'Data Breaches', icon: AlertTriangle },
  { id: 'grievance', num: '23', title: 'Grievance Redressal', icon: HelpCircle },
  { id: 'consent', num: '24', title: 'Consent Framework', icon: CheckCircle2 },
  { id: 'changes-policy', num: '25', title: 'Changes to This Privacy Policy', icon: FileSpreadsheet },
  { id: 'contact-us', num: '26', title: 'Contact Us', icon: Mail },
];

const SectionHeader = ({ num, title }) => (
  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
      {num}
    </div>
    <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
  </div>
);

const WarningSectionHeader = ({ num, title }) => (
  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-100">
    <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600 font-bold text-sm">
      {num}
    </div>
    <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
  </div>
);

const PrivacyPolicy = () => {
  const [active, setActive] = useState('about-moolu');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => {
      let current = 'about-moolu';
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
      {/* Top Hero Section */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white relative overflow-hidden border-b border-indigo-900/40">
        {/* Subtle background glow overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-14 relative z-10">
          
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Legal &amp; Compliance Policy
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-300 border border-slate-700">
              DPDP Act 2023 Compliant
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight !text-white text-white drop-shadow-md mb-4">
            Moolu Privacy Policy
          </h1>
          <p className="max-w-3xl !text-slate-200 text-slate-200 text-sm sm:text-base leading-relaxed mb-8">
            This Privacy Policy explains how Moolu (&quot;Moolu&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) collects, uses, stores, discloses, and safeguards your personal data when accessing{' '}
            <a href="https://moolu.in" target="_blank" rel="noreferrer" className="!text-indigo-300 text-indigo-300 font-semibold underline hover:text-white">
              moolu.in
            </a>{' '}
            and our recruitment services.
          </p>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="!text-slate-400 text-slate-400">Last Updated:</span>
              <span className="font-semibold !text-white text-white">2 September 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="!text-slate-400 text-slate-400">Data Fiduciary:</span>
              <span className="font-semibold !text-white text-white">Moolu (moolu.in)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="!text-slate-400 text-slate-400">Contact:</span>
              <a href="mailto:info@moolu.in" className="font-semibold !text-indigo-300 text-indigo-300 hover:underline">info@moolu.in</a>
            </div>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Sticky Navigation Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 sticky top-24 z-20">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search policy sections..."
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

              {/* Scrollable list of sections */}
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

          {/* Policy Document Content Area */}
          <main className="flex-1 min-w-0 bg-white rounded-2xl p-6 sm:p-12 border border-slate-200 shadow-sm">
            <div className="space-y-12">

              {/* 1. About Moolu */}
              <section id="about-moolu" className="scroll-mt-28">
                <SectionHeader num="01" title="About Moolu" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Moolu is an online employment and recruitment platform that enables job seekers to discover employment opportunities and enables employers/recruiters to publish vacancies, search for suitable candidates, and manage recruitment activities.
                  </p>
                  <p>
                    For the purposes of applicable data-protection laws, including the <strong>Digital Personal Data Protection Act, 2023 (&quot;DPDP Act&quot;)</strong>, Moolu acts as a <strong>Data Fiduciary</strong> in relation to personal data processed through the Platform.
                  </p>
                </div>
              </section>

              {/* 2. Information We Collect */}
              <section id="information-we-collect" className="scroll-mt-28 pt-4">
                <SectionHeader num="02" title="Information We Collect" />

                <div className="space-y-6 text-sm text-slate-700">
                  <p>Depending on how you use the Platform, we may collect the following categories of information:</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80">
                      <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 text-indigo-700">
                        <UserCheck className="w-4 h-4" />
                        A. Information Provided by Job Seekers
                      </h3>
                      <ul className="text-xs space-y-2 text-slate-600 list-disc pl-4">
                        <li>Full name, mobile number, and email address</li>
                        <li>Date of birth/age and gender (where voluntarily provided)</li>
                        <li>Current city/location and permanent address</li>
                        <li>Educational &amp; professional qualifications</li>
                        <li>Employment history, notice period, and salary details</li>
                        <li>Skills, job preferences, and uploaded resume/CV</li>
                        <li>Profile photograph and professional documents</li>
                        <li>Correspondence with employers/recruiters</li>
                      </ul>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80">
                      <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2 text-indigo-700">
                        <Building2 className="w-4 h-4" />
                        B. Information Provided by Employers
                      </h3>
                      <ul className="text-xs space-y-2 text-slate-600 list-disc pl-4">
                        <li>Authorized representative name &amp; company name</li>
                        <li>Business email address &amp; mobile/telephone number</li>
                        <li>Company address and website details</li>
                        <li>Job descriptions, vacancies, and recruitment criteria</li>
                        <li>Billing and transaction details (where applicable)</li>
                        <li>Login credentials &amp; candidate communication logs</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80">
                    <h3 className="font-bold text-slate-900 text-sm mb-2 text-slate-800">
                      C. Information Collected Automatically &amp; Cookies
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Technical information including IP address, browser version, device identifiers, approximate location, pages visited, search activity, diagnostic data, and website performance cookies used to keep you signed in and maintain preferences.
                    </p>
                  </div>
                </div>
              </section>

              {/* 3. How We Use Your Data */}
              <section id="how-we-use" className="scroll-mt-28 pt-4">
                <SectionHeader num="03" title="How We Use Your Personal Data" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>We process your personal data for specific legitimate recruitment operational purposes:</p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li>Creating and maintaining candidate &amp; employer account profiles</li>
                    <li>Facilitating job discovery, search filtering, and direct candidate applications</li>
                    <li>Recommending suitable matches between candidates and job listings</li>
                    <li>Sending transactional notices, job updates, and account security alerts</li>
                    <li>Preventing platform misuse, fraudulent postings, and unauthorized access</li>
                    <li>Complying with statutory reporting requirements under applicable law</li>
                  </ul>
                </div>
              </section>

              {/* 4. Job Applications & Candidate Profiles */}
              <section id="job-applications" className="scroll-mt-28 pt-4">
                <SectionHeader num="04" title="Job Applications and Candidate Profiles" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    When you apply for a job on Moolu, your profile, resume, contact details, and qualifications become accessible to the relevant employer/recruiter for hiring review.
                  </p>
                  <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Platform Disclaimer:</strong> Moolu provides application submission tools but does not guarantee candidate shortlisting, interview scheduling, or employment outcomes by third-party employers.
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Sharing with Employers */}
              <section id="shared-employers" className="scroll-mt-28 pt-4">
                <SectionHeader num="05" title="Information Shared With Employers and Recruiters" />
                <p className="text-slate-700 text-sm leading-relaxed">
                  Candidate profile data shared with employers is handled independently by those hiring organizations under their own privacy frameworks. We advise candidates to inspect employer privacy terms when communicating directly.
                </p>
              </section>

              {/* 6. Service Providers */}
              <section id="service-providers" className="scroll-mt-28 pt-4">
                <SectionHeader num="06" title="Information Shared With Service Providers" />
                <p className="text-slate-700 text-sm leading-relaxed">
                  We utilize verified third-party vendors for website hosting, database storage, email/SMS delivery, payment gateways, analytics, and security monitoring. Service providers access data solely to perform authorized operational tasks.
                </p>
              </section>

              {/* 7. Legal Disclosures */}
              <section id="legal-disclosures" className="scroll-mt-28 pt-4">
                <SectionHeader num="07" title="Legal and Regulatory Disclosures" />
                <p className="text-slate-700 text-sm leading-relaxed">
                  Personal data may be disclosed where mandated by law, court order, or official request from government law enforcement agencies under statutory provisions (including Section 69 of the IT Act, 2000).
                </p>
              </section>

              {/* 8. Business Transfers */}
              <section id="business-transfers" className="scroll-mt-28 pt-4">
                <SectionHeader num="08" title="Business Transfers" />
                <p className="text-slate-700 text-sm leading-relaxed">
                  In the event of a merger, acquisition, restructuring, or asset transfer involving Moolu, user data will be transferred under equivalent privacy commitments.
                </p>
              </section>

              {/* 9. Data Retention */}
              <section id="data-retention" className="scroll-mt-28 pt-4">
                <SectionHeader num="09" title="Data Retention" />
                <p className="text-slate-700 text-sm leading-relaxed">
                  We retain personal data for the duration of account activity or as mandated by law (e.g. tax laws requiring 7-year transaction retention). Afterwards, data is securely erased or anonymized.
                </p>
              </section>

              {/* 10. Data Security */}
              <section id="data-security" className="scroll-mt-28 pt-4">
                <SectionHeader num="10" title="Data Security" />
                <p className="text-slate-700 text-sm leading-relaxed">
                  We enforce SSL/TLS encryption for data transmission, access restrictions, secure server infrastructure, and routine security audits to protect against unauthorized access.
                </p>
              </section>

              {/* 11. Your Responsibility */}
              <section id="your-responsibility" className="scroll-mt-28 pt-4">
                <SectionHeader num="11" title="Your Responsibility" />
                <p className="text-slate-700 text-sm leading-relaxed">
                  Maintain the secrecy of your login passwords and OTPs. Never upload unnecessary sensitive data like financial card PINs, CVV, or private banking secrets to public candidate fields.
                </p>
              </section>

              {/* 12. Your Rights */}
              <section id="your-rights" className="scroll-mt-28 pt-4">
                <SectionHeader num="12" title="Your Rights (DPDP Act 2023)" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                    <strong className="text-indigo-700 block mb-1">Right to Access</strong>
                    Request summary details of personal data processed by Moolu.
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                    <strong className="text-indigo-700 block mb-1">Right to Correction</strong>
                    Update or correct inaccurate resume or profile details.
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                    <strong className="text-indigo-700 block mb-1">Right to Erasure</strong>
                    Request account deletion &amp; data erasure subject to legal retention.
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                    <strong className="text-indigo-700 block mb-1">Grievance Redressal</strong>
                    File data complaints directly to our designated Grievance Officer.
                  </div>
                </div>
              </section>

              {/* 13. Withdraw Consent */}
              <section id="withdraw-consent" className="scroll-mt-28 pt-4">
                <SectionHeader num="13" title="How to Withdraw Consent" />
                <p className="text-slate-700 text-sm leading-relaxed">
                  Withdraw processing consent anytime via account settings or by emailing{' '}
                  <a href="mailto:info@moolu.in" className="text-indigo-600 font-semibold underline">
                    info@moolu.in
                  </a>. Withdrawal does not affect prior lawful processing.
                </p>
              </section>

              {/* 14. Accuracy of Information */}
              <section id="accuracy-info" className="scroll-mt-28 pt-4">
                <SectionHeader num="14" title="Accuracy of Information" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Users are responsible for ensuring all profile details, experience histories, educational qualifications, and contact points remain accurate and up to date at all times. Inaccurate or outdated information may affect the quality of job recommendations and employer interactions.
                  </p>
                  <p>
                    Moolu reserves the right to remove or restrict accounts that contain demonstrably false or misleading information that could impact other users or the integrity of the Platform.
                  </p>
                </div>
              </section>

              {/* 15. Children's Privacy */}
              <section id="childrens-privacy" className="scroll-mt-28 pt-4">
                <SectionHeader num="15" title="Children's Privacy" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    The Platform is intended exclusively for individuals of legal working age (18 years and above). We do not knowingly collect, process, or store personal data from minors under 18 years of age.
                  </p>
                  <p>
                    If we become aware that we have inadvertently collected personal data from a minor, we will take immediate steps to delete such data and terminate the associated account. Parents or guardians who believe their child has provided personal data to the Platform should contact us at <a href="mailto:info@moolu.in" className="text-indigo-600 font-semibold underline">info@moolu.in</a>.
                  </p>
                </div>
              </section>

              {/* 16. Third-Party Websites & Links */}
              <section id="third-party-links" className="scroll-mt-28 pt-4">
                <SectionHeader num="16" title="Third-Party Websites & Links" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    The Platform may contain links to external websites operated by third-party employers, recruiters, or service providers. These links are provided for convenience and informational purposes only.
                  </p>
                  <p>
                    Moolu does not control, endorse, or assume responsibility for the content, privacy policies, or practices of any third-party websites. We encourage users to review the privacy policies of any external site before providing personal data. Your interaction with third-party websites is governed entirely by their own terms and policies.
                  </p>
                </div>
              </section>

              {/* 17. Third-Party Recruitment Communications */}
              <section id="recruitment-communications" className="scroll-mt-28 pt-4">
                <SectionHeader num="17" title="Third-Party Recruitment Communications" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Moolu is not responsible for independent communications initiated directly by employers or recruiters after they have accessed your profile through the Platform. Once your data is shared with an employer via a job application, their subsequent use of that data is governed by their own privacy policies.
                  </p>
                  <p>
                    If you receive suspicious, fraudulent, or unsolicited recruitment communications from any party claiming to represent a company listed on Moolu, please report the incident to us immediately at <a href="mailto:info@moolu.in" className="text-indigo-600 font-semibold underline">info@moolu.in</a> or through our <a href="/safety" className="text-indigo-600 font-semibold underline">Trust &amp; Safety</a> reporting form.
                  </p>
                </div>
              </section>

              {/* 18. Fraud and Scam Prevention */}
              <section id="fraud-prevention" className="scroll-mt-28 pt-4">
                <WarningSectionHeader num="18" title="Fraud and Scam Prevention" />

                <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200/90 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-2.5 text-red-900 font-bold text-base mb-3">
                    <ShieldAlert className="w-5 h-5 text-red-600" />
                    <span>Candidate Warning &amp; Protection Rules</span>
                  </div>
                  <p className="text-xs text-slate-700 mb-4 leading-relaxed">
                    Moolu aims to provide a safe job marketplace. To protect yourself from recruitment fraud, candidates must <strong>NEVER</strong>:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-800 font-medium">
                    <div className="bg-white/80 p-2.5 rounded-lg border border-red-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      Pay money to obtain a job or interview
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-lg border border-red-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      Share account passwords or OTPs
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-lg border border-red-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      Share bank credentials or card CVVs
                    </div>
                    <div className="bg-white/80 p-2.5 rounded-lg border border-red-100 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      Install unknown remote access software
                    </div>
                  </div>
                </div>
              </section>

              {/* 19. Marketing Communications */}
              <section id="marketing-comms" className="scroll-mt-28 pt-4">
                <SectionHeader num="19" title="Marketing Communications" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    You may opt out of promotional emails at any time using the unsubscribe link included in every marketing email. You can also manage your communication preferences through your account settings dashboard.
                  </p>
                  <p>
                    Please note that essential service notifications (account security alerts, password resets, application status updates, and critical platform announcements) will continue regardless of your marketing preferences, as they are necessary for the operation of your account.
                  </p>
                </div>
              </section>

              {/* 20. Data Transfers */}
              <section id="data-transfers" className="scroll-mt-28 pt-4">
                <SectionHeader num="20" title="Data Transfers" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    Your personal data is primarily processed and stored on secure servers located within India. Where data is processed using cloud infrastructure located outside India, we ensure that such transfers comply with the provisions of the DPDP Act, 2023 and are made only to jurisdictions that maintain adequate data protection standards.
                  </p>
                  <p>
                    All third-party cloud service providers used by Moolu are contractually bound to implement appropriate technical and organizational security measures in line with applicable Indian data protection requirements.
                  </p>
                </div>
              </section>

              {/* 21. Updating Your Information */}
              <section id="changes-information" className="scroll-mt-28 pt-4">
                <SectionHeader num="21" title="Updating Your Information" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    You can update your candidate or employer profile details at any time through your account settings dashboard. For changes that cannot be made self-service (such as registered email address changes or account merges), contact our support team at <a href="mailto:info@moolu.in" className="text-indigo-600 font-semibold underline">info@moolu.in</a>.
                  </p>
                  <p>
                    We encourage all users to review and update their information periodically to ensure accuracy and to receive the most relevant job recommendations and recruiter interactions.
                  </p>
                </div>
              </section>

              {/* 22. Data Breaches */}
              <section id="data-breaches" className="scroll-mt-28 pt-4">
                <WarningSectionHeader num="22" title="Data Breaches" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    In the event of a confirmed personal data breach, Moolu will follow a structured incident response process:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li><strong>Containment:</strong> Immediately isolate the affected systems and prevent further unauthorized access.</li>
                    <li><strong>Investigation:</strong> Conduct a thorough investigation to determine the scope, cause, and impact of the breach.</li>
                    <li><strong>Notification:</strong> Notify the Data Protection Board of India and affected users without unreasonable delay, as required under the DPDP Act, 2023.</li>
                    <li><strong>Remediation:</strong> Implement corrective measures to prevent recurrence and strengthen security infrastructure.</li>
                  </ul>
                </div>
              </section>

              {/* 23. Grievance Redressal */}
              <section id="grievance" className="scroll-mt-28 pt-4">
                <SectionHeader num="23" title="Grievance Redressal" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    In accordance with the IT Act, 2000 and IT Intermediary Rules, 2021, Moolu has appointed a designated Grievance Redressal Officer to address all data protection concerns and complaints:
                  </p>
                  <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6">
                    <h4 className="font-bold text-slate-900 text-sm mb-3">Grievance Redressal Officer / Data Protection Contact</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="flex items-start gap-2.5">
                        <Mail className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-500 block">Email Address</span>
                          <a href="mailto:info@moolu.in" className="font-bold text-indigo-700 hover:underline">
                            info@moolu.in
                          </a>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-500 block">Registered Location</span>
                          <span className="font-semibold text-slate-800">Mangalore, Karnataka, India</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600">
                    <strong>Response time:</strong> Acknowledgment within 48 hours; resolution within 15 business days as per IT Intermediary Rules, 2021.
                  </p>
                </div>
              </section>

              {/* 24. Consent Framework */}
              <section id="consent" className="scroll-mt-28 pt-4">
                <SectionHeader num="24" title="Consent Framework" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    By accessing Moolu, creating an account, or submitting personal information through the Platform, you provide your informed and voluntary consent to the collection, processing, and use of your personal data as described in this Privacy Policy, in accordance with the provisions of the Digital Personal Data Protection Act, 2023.
                  </p>
                  <p>
                    You have the right to withdraw your consent at any time through your account settings or by contacting us at <a href="mailto:info@moolu.in" className="text-indigo-600 font-semibold underline">info@moolu.in</a>. Please note that withdrawal of consent may limit your ability to use certain features of the Platform.
                  </p>
                </div>
              </section>

              {/* 25. Changes to This Privacy Policy */}
              <section id="changes-policy" className="scroll-mt-28 pt-4">
                <SectionHeader num="25" title="Changes to This Privacy Policy" />
                <div className="text-slate-700 text-sm leading-relaxed space-y-3">
                  <p>
                    We reserve the right to update or modify this Privacy Policy at any time. When we make material changes, we will:
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    <li>Post the updated policy on this page with a revised &quot;Last Updated&quot; date</li>
                    <li>Notify registered users via email for material changes that affect their data rights</li>
                    <li>Display a prominent notice on the Platform for a reasonable period after the change</li>
                  </ul>
                  <p>
                    Your continued use of the Platform after the posting of changes constitutes your acceptance of the updated Privacy Policy. We encourage you to review this page periodically.
                  </p>
                </div>
              </section>

              {/* 26. Contact Us - High Contrast Premium Card */}
              <section id="contact-us" className="scroll-mt-28 pt-6">
                <SectionHeader num="26" title="Contact Us" />

                <p className="text-slate-700 text-sm mb-4">
                  For questions, requests, or privacy inquiries regarding data protection at Moolu:
                </p>

                {/* Sleek, readable contact box with rich contrast */}
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-indigo-800/40 relative overflow-hidden">
                  <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-wide">Moolu Platform</h3>
                        <p className="text-xs text-slate-400">Official Recruitment Data Protection Contact</p>
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

export default PrivacyPolicy;
