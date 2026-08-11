import React, { useState, useEffect } from 'react';

const sections = [
  { id: 'agreement', label: 'Agreement to Terms' },
  { id: 'eligibility', label: 'Eligibility' },
  { id: 'job-seekers', label: 'Job Seekers' },
  { id: 'employers', label: 'Employers' },
  { id: 'pricing', label: 'Pricing & Payments' },
  { id: 'agents', label: 'Affiliate Agents' },
  { id: 'prohibited', label: 'Prohibited Conduct' },
  { id: 'content', label: 'User Content' },
  { id: 'liability', label: 'Limitation of Liability' },
  { id: 'termination', label: 'Termination' },
  { id: 'governing-law', label: 'Governing Law' },
  { id: 'contact', label: 'Contact Us' },
];

const TermsOfService = () => {
  const [active, setActive] = useState('agreement');

  useEffect(() => {
    const onScroll = () => {
      let current = 'agreement';
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
              <h1 className="text-3xl font-bold text-slate-900 mb-3">Terms of Service</h1>
              <p className="text-sm text-slate-500">Effective date: August 11, 2026 · Governed by the laws of the Republic of India</p>
            </div>

            <div className="prose-legal">

              <section id="agreement" className="mb-10 scroll-mt-24">
                <h2>1. Agreement to Terms</h2>
                <p>By accessing or using JobPortal India (the "Platform"), you agree to be legally bound by these Terms of Service ("Terms"). These Terms apply to all visitors, Job Seekers, Employers, and Affiliate Agents. If you do not agree, please do not use the Platform.</p>
                <p>These Terms are published in compliance with Rule 3(1) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, which requires intermediaries to publish their rules, regulations, privacy policy, and terms of service.</p>
              </section>

              <section id="eligibility" className="mb-10 scroll-mt-24">
                <h2>2. Eligibility</h2>
                <p>You must be at least 18 years of age and competent to enter into a binding contract under the Indian Contract Act, 1872. By registering, you confirm that all information you provide is accurate, complete, and up to date. We reserve the right to suspend or terminate accounts found to have provided false or misleading information.</p>
              </section>

              <section id="job-seekers" className="mb-10 scroll-mt-24">
                <h2>3. Job Seekers</h2>
                <p>Job Seekers may browse and apply to job listings on the Platform free of charge. By using the Platform as a Job Seeker, you agree to:</p>
                <ul>
                  <li>Provide accurate information in your profile, resume, and job applications.</li>
                  <li>Not misrepresent your qualifications, experience, or identity.</li>
                  <li>Not submit duplicate or automated applications.</li>
                </ul>
                <p>JobPortal India acts as an intermediary under Section 79 of the IT Act, 2000, and does not guarantee job placements, interview responses, or employer behaviour.</p>
              </section>

              <section id="employers" className="mb-10 scroll-mt-24">
                <h2>4. Employers</h2>
                <p>Employers may post up to 3 job listings at no cost (lifetime free tier). Additional job posts require the purchase of credits. By posting a listing, you agree that:</p>
                <ul>
                  <li>All job descriptions are accurate, genuine, and for real positions within your organization.</li>
                  <li>You will not charge candidates any fees — including interview fees, training fees, equipment fees, or documentation fees — at any stage of the recruitment process.</li>
                  <li>Job listings must not be discriminatory, deceptive, or violate any applicable Indian labour law.</li>
                  <li>We reserve the right to reject, unpublish, or remove any listing that violates these standards, with or without prior notice.</li>
                </ul>
              </section>

              <section id="pricing" className="mb-10 scroll-mt-24">
                <h2>5. Pricing & Payments</h2>
                <p>Paid job post credits are available in the following bundles, excluding GST:</p>

                <table className="terms-table">
                  <thead>
                    <tr>
                      <th>Bundle</th>
                      <th>Credits</th>
                      <th>Price (excl. GST)</th>
                      <th>GST (18%)</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Starter</td>
                      <td>1 post</td>
                      <td>₹83.90</td>
                      <td>₹15.10</td>
                      <td>₹99.00</td>
                    </tr>
                    <tr>
                      <td>Standard</td>
                      <td>5 posts</td>
                      <td>₹338.14</td>
                      <td>₹60.86</td>
                      <td>₹399.00</td>
                    </tr>
                    <tr>
                      <td>Value</td>
                      <td>10 posts</td>
                      <td>₹592.37</td>
                      <td>₹106.63</td>
                      <td>₹699.00</td>
                    </tr>
                  </tbody>
                </table>

                <p>All payments are processed by <strong>Razorpay</strong>, a PCI-DSS compliant payment gateway. We do not store your card details. A tax invoice will be issued to your registered email address after each successful transaction.</p>
                <p><strong>Refund Policy:</strong> All credit purchases are non-refundable. Credits are added to your account immediately upon payment verification and cannot be exchanged for cash or transferred to another account.</p>
              </section>

              <section id="agents" className="mb-10 scroll-mt-24">
                <h2>6. Affiliate Agents</h2>
                <p>Affiliate Agents are individuals who refer Employers to the Platform in exchange for commission earnings. By registering as an Agent, you agree to the following:</p>
                <ul>
                  <li><strong>KYC compliance:</strong> You must submit a valid government-issued ID (Aadhar, PAN, Voter ID, or Passport) before any payout is disbursed. Payouts will be withheld until verification is complete.</li>
                  <li><strong>Accurate payout details:</strong> You are responsible for the accuracy of your UPI ID or bank account details. To prevent errors, paste functionality is disabled on payout fields; all details must be typed and confirmed manually.</li>
                  <li><strong>No self-referral:</strong> Agents may not refer their own companies, create fictitious employer accounts, or engage in any activity designed to fraudulently generate commission income.</li>
                  <li><strong>Suspension:</strong> Agents may suspend referred employers for legitimate reasons. Abuse of the suspension feature will result in Agent account termination and forfeiture of all accrued earnings.</li>
                </ul>
              </section>

              <section id="prohibited" className="mb-10 scroll-mt-24">
                <h2>7. Prohibited Conduct</h2>
                <p>All users are prohibited from the following, as listed in Rule 3(1)(b) of the IT Rules, 2021:</p>
                <ul>
                  <li>Posting content that is defamatory, obscene, pornographic, or invasive of another person's privacy.</li>
                  <li>Impersonating any person, company, or government entity.</li>
                  <li>Attempting to gain unauthorized access to our systems or another user's account.</li>
                  <li>Using automated scripts, bots, or scraping tools to extract data from the Platform.</li>
                  <li>Publishing content that threatens the sovereignty, integrity, or security of India.</li>
                  <li>Engaging in multi-level marketing, pyramid schemes, or any form of employment fraud.</li>
                </ul>
                <p>Violations may result in immediate account suspension or termination, and may be reported to the relevant authorities.</p>
              </section>

              <section id="content" className="mb-10 scroll-mt-24">
                <h2>8. User Content</h2>
                <p>By submitting content (resumes, job descriptions, profile photos) to the Platform, you grant JobPortal India a non-exclusive, royalty-free licence to display and process that content for the purpose of operating the Platform. You retain ownership of your content. We do not claim any intellectual property rights over it.</p>
                <p>You are solely responsible for ensuring your content does not infringe on any third-party intellectual property rights, contain malware, or violate any law.</p>
              </section>

              <section id="liability" className="mb-10 scroll-mt-24">
                <h2>9. Limitation of Liability</h2>
                <p>JobPortal India is an intermediary under Section 79 of the IT Act, 2000, and is not liable for the conduct of its users or the accuracy of content posted on the Platform. To the maximum extent permitted by law, our total liability for any claim arising out of these Terms shall not exceed the amount you paid to us in the three months preceding the claim.</p>
                <p>We are not liable for any indirect, incidental, special, or consequential damages, including loss of data, income, or business opportunities.</p>
              </section>

              <section id="termination" className="mb-10 scroll-mt-24">
                <h2>10. Termination</h2>
                <p>We may suspend or terminate your account at any time, with or without cause, if you violate these Terms or engage in conduct that we reasonably believe is harmful to the Platform, other users, or third parties. You may delete your account at any time. Upon termination, your right to access the Platform ceases immediately.</p>
              </section>

              <section id="governing-law" className="mb-10 scroll-mt-24">
                <h2>11. Governing Law</h2>
                <p>These Terms are governed by the laws of the Republic of India. Any dispute arising from or relating to these Terms shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka, India. We encourage resolution of disputes through direct communication before initiating legal proceedings.</p>
              </section>

              <section id="contact" className="mb-10 scroll-mt-24">
                <h2>12. Contact Us</h2>
                <p>For questions about these Terms, or to report a violation, please contact:</p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mt-4 space-y-1.5 text-sm">
                  <p><strong>JobPortal India — Legal & Compliance</strong></p>
                  <p><strong>Email:</strong> <a href="mailto:legal@jobportal.in">legal@jobportal.in</a></p>
                  <p><strong>Address:</strong> 4th Floor, Salarpuria GR Tech Park, Whitefield, Bengaluru, Karnataka – 560066</p>
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
        .prose-legal h3 {
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 700;
          color: #374151;
          margin-top: 16px;
          margin-bottom: 6px;
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
        .terms-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 13px;
          margin: 16px 0 20px;
          color: #374151;
        }
        .terms-table th {
          background: #f9fafb;
          font-weight: 600;
          text-align: left;
          padding: 10px 14px;
          border: 1px solid #e5e7eb;
          color: #111827;
        }
        .terms-table td {
          padding: 10px 14px;
          border: 1px solid #e5e7eb;
        }
        .terms-table tr:hover td {
          background: #f9fafb;
        }
      `}</style>
    </div>
  );
};

export default TermsOfService;
