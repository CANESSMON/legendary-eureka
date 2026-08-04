import React, { useState } from 'react';
import { 
  CreditCard, Check, Sparkles, Zap, ShieldCheck, 
  Building2, CheckCircle2, Flame, Users, ArrowRight
} from 'lucide-react';
import { useJobs } from '../../context/JobContext';

const FALLBACK_PLANS = [
  {
    id: 'starter',
    name: 'Starter Business',
    tagline: 'Ideal for small businesses & quick local hiring',
    price: 'Free',
    period: 'Forever Free',
    isCurrent: true,
    isPopular: false,
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    buttonText: 'Current Plan',
    buttonStyle: 'bg-slate-100 text-slate-600 border border-slate-200 cursor-default',
    features: [
      'Post up to 3 active job listings',
      'Direct candidate WhatsApp apply redirection',
      'Basic candidate click lead analytics',
      'Standard search placement',
      'Community email support'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Employer',
    tagline: 'Best for fast-growing companies seeking top talent',
    price: '₹1,999',
    period: 'per month',
    isCurrent: false,
    isPopular: true,
    badgeColor: 'bg-primary/10 text-primary border-primary/20',
    buttonText: 'Upgrade to Pro',
    buttonStyle: 'bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/25 cursor-pointer',
    features: [
      'Unlimited active job postings',
      'Unlimited Direct WhatsApp candidate leads',
      'Priority Urgent & Featured title badges included',
      'Top search result placement',
      'Custom WhatsApp candidate apply templates',
      'Real-time candidate inquiry breakdown analytics',
      '24/7 Priority WhatsApp support'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Growth',
    tagline: 'Comprehensive hiring solution for large teams',
    price: '₹4,999',
    period: 'per month',
    isCurrent: false,
    isPopular: false,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    buttonText: 'Contact Sales',
    buttonStyle: 'bg-slate-900 hover:bg-slate-800 text-white shadow-md cursor-pointer',
    features: [
      'Everything in Pro Employer plan',
      'Verified Gold Employer Badge',
      'Dedicated hiring account manager',
      'Multi-user team workspace access',
      'Custom branding & logo highlights',
      'Automated candidate follow-up broadcasts'
    ]
  }
];

const EmployerPlans = () => {
  const [selectedBilling, setSelectedBilling] = useState('monthly'); // 'monthly' | 'annual'
  const [successMessage, setSuccessMessage] = useState('');
  const { employerProfile, plans } = useJobs();

  const isCurrentPlan = (planId) => {
    const current = (employerProfile?.subscription_plan || 'Free').toLowerCase();
    if (planId === 'starter') return current === 'free';
    if (planId === 'pro') return current === 'basic' || current === 'pro';
    if (planId === 'enterprise') return current === 'premium' || current === 'enterprise';
    return false;
  };

  const displayedPlans = plans && plans.length > 0 ? plans.map((p) => {
    const featureList = p.features ? p.features.split('\n').filter(f => f.trim().length > 0) : [];
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
    const design = designMap[p.id] || {
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
      buttonText: 'Subscribe',
      buttonStyle: 'bg-primary hover:bg-primary-hover text-white cursor-pointer',
      isPopular: false
    };

    const isCurrent = isCurrentPlan(p.id);

    return {
      id: p.id,
      name: p.name,
      tagline: p.tagline,
      price: p.price,
      period: p.period || 'per month',
      features: featureList,
      ...design,
      isCurrent,
      buttonText: isCurrent ? 'Current Active Plan' : design.buttonText,
      buttonStyle: isCurrent ? 'bg-slate-100 text-slate-600 border border-slate-200 cursor-default' : design.buttonStyle
    };
  }) : FALLBACK_PLANS;

  const handleSelectPlan = (plan) => {
    if (plan.isCurrent) return;
    setSuccessMessage(`Plan choice noted! Please request your Administrator to update your plan to ${plan.name} via the Admin subscription dropdown.`);
    setTimeout(() => setSuccessMessage(''), 6000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-indigo-100/90 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
              <CreditCard size={13} />
              Employer Membership & Plans
            </span>
          </div>
          <h2 className="h2 text-slate-900">Buy Employer Subscription Plans</h2>
          <p className="body-text text-slate-500 text-xs mt-0.5">
            Unlock unlimited job postings, priority badging, and direct candidate WhatsApp redirection.
          </p>
        </div>

        {/* Billing Cycle Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setSelectedBilling('monthly')}
            className={`px-3.5 py-1.5 rounded-lg transition-all border-0 cursor-pointer ${
              selectedBilling === 'monthly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Monthly Billing
          </button>
          <button
            type="button"
            onClick={() => setSelectedBilling('annual')}
            className={`px-3.5 py-1.5 rounded-lg transition-all border-0 cursor-pointer flex items-center gap-1 ${
              selectedBilling === 'annual' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Annual Billing
            <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.2 rounded-full">Save 20%</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 font-bold text-xs animate-fade-in shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          {successMessage}
        </div>
      )}

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayedPlans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-white rounded-2xl border transition-all p-6 flex flex-col justify-between relative shadow-2xs hover:shadow-md ${
              plan.isPopular ? 'border-2 border-primary ring-4 ring-primary/10' : 'border-slate-200/90'
            }`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-[10px] font-extrabold px-3 py-0.5 rounded-full tracking-wide shadow-sm flex items-center gap-1">
                <Sparkles size={11} fill="currentColor" /> Most Popular Choice
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${plan.badgeColor}`}>
                  {plan.name}
                </span>
                {plan.isCurrent && (
                  <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                    ● Current Active Plan
                  </span>
                )}
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {selectedBilling === 'annual' && plan.price !== 'Free'
                      ? `₹${Math.round(parseInt(plan.price.replace(/\D/g, '')) * 0.8)}`
                      : plan.price}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{plan.period}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{plan.tagline}</p>
              </div>

              <div className="border-t border-slate-100 pt-4 mb-6 space-y-3">
                <span className="text-[11px] font-bold text-slate-400 tracking-wide block">Included Features:</span>
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all border-0 flex items-center justify-center gap-1.5 ${plan.buttonStyle}`}
              >
                {plan.buttonText}
                {!plan.isCurrent && <ArrowRight size={14} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Benefits Banner */}
      <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-200">
            <Zap size={15} className="text-amber-400 fill-amber-400" />
            Why Upgrade Your Employer Account?
          </div>
          <h3 className="text-lg font-bold text-white">Get Direct Candidate WhatsApp Inquiries 3x Faster</h3>
          <p className="text-xs text-indigo-200 max-w-xl leading-relaxed">
            Featured and Urgent badged listings appear at the top of candidate search feeds and receive immediate WhatsApp contact messages.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSelectPlan(PLANS[1])}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md shrink-0 border-0 cursor-pointer flex items-center gap-2"
        >
          <Sparkles size={16} />
          Upgrade to Pro Plan
        </button>
      </div>
    </div>
  );
};

export default EmployerPlans;
