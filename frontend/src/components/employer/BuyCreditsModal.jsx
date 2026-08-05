import React, { useState, useEffect } from 'react';
import { useJobs } from '../../context/JobContext';
import { 
  X, CheckCircle2, ShieldCheck, Sparkles, CreditCard, 
  Zap, Award, Loader2, IndianRupee, HelpCircle 
} from 'lucide-react';

const CREDIT_PACKS = [
  {
    id: 'single',
    name: 'Single Post',
    tagline: 'Ideal for occasional hiring needs',
    price: 99,
    credits: 1,
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    popular: false,
  },
  {
    id: 'bundle_5',
    name: 'Growth Bundle',
    tagline: 'Save 20% compared to single posts',
    price: 399,
    credits: 5,
    tag: 'Save ₹96',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    popular: true,
  },
  {
    id: 'bundle_10',
    name: 'Recruiter Bundle',
    tagline: 'Best value for active local recruiters',
    price: 699,
    credits: 10,
    tag: 'Best Value',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    popular: false,
  }
];

const BuyCreditsModal = ({ isOpen, onClose, onSuccess }) => {
  const { createPaymentOrder, verifyPayment, employerProfile, employerCredits } = useJobs();
  const [selectedPack, setSelectedPack] = useState('bundle_5');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // State for mock payment simulator modal
  const [showSandboxModal, setShowSandboxModal] = useState(false);
  const [mockOrderDetails, setMockOrderDetails] = useState(null);

  useEffect(() => {
    // Load Razorpay checkout script
    if (isOpen) {
      setError(null);
      setPaymentSuccess(false);
      
      const scriptId = 'razorpay-checkout-script';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Create order on backend
      const order = await createPaymentOrder(selectedPack);
      
      // 2. Check if we should use sandbox/mock mode
      if (order.mock_mode) {
        setMockOrderDetails(order);
        setShowSandboxModal(true);
        setLoading(false);
        return;
      }

      // 3. Trigger Real Razorpay Checkout
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'JobPortal India',
        description: `Purchase ${selectedPack === 'single' ? '1 post credit' : selectedPack === 'bundle_5' ? '5 post credits' : '10 post credits'}`,
        order_id: order.razorpay_order_id,
        handler: async (response) => {
          setLoading(true);
          try {
            // Verify payment
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              pack_id: selectedPack
            });
            setPaymentSuccess(true);
            setTimeout(() => {
              onClose();
              if (onSuccess) onSuccess();
            }, 2000);
          } catch (err) {
            setError(err.message || 'Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: employerProfile.fullName || '',
          email: employerProfile.email || '',
          contact: employerProfile.whatsappNumber || ''
        },
        theme: {
          color: '#6366f1' // Indigo-500 matching the portal's primary color
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.message || 'Failed to initialize checkout. Please try again.');
      setLoading(false);
    }
  };

  const handleSimulatePayment = async (success) => {
    setShowSandboxModal(false);
    if (!success) {
      setError('Simulated payment failed / cancelled.');
      return;
    }

    setLoading(true);
    try {
      await verifyPayment({
        razorpay_order_id: mockOrderDetails.razorpay_order_id,
        razorpay_payment_id: `pay_mock_${Math.random().toString(36).substr(2, 9)}`,
        razorpay_signature: 'mock_signature_valid',
        is_mocked: true,
        pack_id: selectedPack
      });
      setPaymentSuccess(true);
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Mock payment verification failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs animate-fade-in p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden relative my-8 animate-scale-in">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
          >
            <X size={18} />
          </button>
          
          <div className="flex items-center gap-2 mb-2 text-indigo-400">
            <Sparkles size={16} className="fill-indigo-400 animate-pulse" />
            <span className="text-[10px] uppercase tracking-widest font-black">Pay-Per-Post Credits</span>
          </div>
          
          <h3 className="text-xl font-bold font-display">Purchase Post Credits</h3>
          <p className="text-xs text-indigo-200 mt-1 font-medium max-w-md">
            Unlock additional job posts instantly. Choose a pack that suits your immediate hiring timeline. No subscription lock-in.
          </p>

          {/* User Current Balance Indicator */}
          <div className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/15 flex items-center gap-2">
            <span className="text-[10px] font-bold text-indigo-200">Current Balance:</span>
            <span className="text-xs font-black text-emerald-400">{employerCredits?.credits || 0} Credits</span>
          </div>
        </div>

        {paymentSuccess ? (
          /* Payment Success State */
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-4 animate-scale-in">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center border-2 border-emerald-300">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 fill-emerald-100" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Payment Successful!</h4>
            <p className="text-xs text-slate-500 max-w-sm font-medium">
              Credits have been successfully added to your employer profile. You can now publish your job listing.
            </p>
          </div>
        ) : (
          /* Main Purchase UI */
          <div className="p-6 space-y-6">
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-shake">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
                {error}
              </div>
            )}

            {/* Credit Bundles Selectors */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CREDIT_PACKS.map((pack) => {
                const isSelected = selectedPack === pack.id;
                return (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedPack(pack.id)}
                    className={`border rounded-2xl p-4.5 cursor-pointer relative flex flex-col justify-between transition-all duration-200 ${
                      isSelected 
                        ? 'border-indigo-600 bg-indigo-50/20 ring-2 ring-indigo-600/10' 
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {pack.tag && (
                      <span className="absolute -top-2.5 left-4 px-2 py-0.5 text-[8px] font-extrabold text-indigo-700 bg-indigo-100 rounded-full border border-indigo-200">
                        {pack.tag}
                      </span>
                    )}

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">{pack.name}</span>
                        {isSelected && <div className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5 text-white fill-indigo-600" /></div>}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium leading-normal">{pack.tagline}</p>
                    </div>

                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-900 tracking-tight">₹{pack.price}</span>
                      <span className="text-[10px] text-slate-400 font-medium">/ {pack.credits} {pack.credits === 1 ? 'post' : 'posts'}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Key Trust Badges */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-wrap gap-4 justify-between items-center text-[10px] text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="text-indigo-600 shrink-0" size={14} />
                <span>Secure Payments via Razorpay</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="text-indigo-600 shrink-0" size={14} />
                <span>Credits Credited Instantly</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="text-indigo-600 shrink-0" size={14} />
                <span>Credits Never Expire</span>
              </div>
            </div>

            {/* Pay Button */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100">
              <div className="text-left">
                <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wide">Total Payable</span>
                <span className="text-lg font-black text-slate-900">₹{CREDIT_PACKS.find(p => p.id === selectedPack)?.price}</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition-all text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold transition-all shadow-md shadow-indigo-600/20 text-xs cursor-pointer flex items-center gap-1.5 border-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Initializing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={15} />
                      Pay Securely
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sandbox Payment Simulator Modal */}
      {showSandboxModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80 p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 text-white text-center space-y-6 shadow-2xl relative animate-scale-in">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
              <HelpCircle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-bold">Razorpay Sandbox Simulator</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                We detected that you're running in <strong>Mock/Developer Mode</strong> (no valid credentials provided in `.env`). Simulating a successful transaction adds credits offline.
              </p>
            </div>

            <div className="bg-slate-950 rounded-2xl p-4 border border-slate-850 text-left text-xs font-mono space-y-1.5 text-slate-300">
              <div><span className="text-slate-500">Order ID:</span> {mockOrderDetails?.razorpay_order_id}</div>
              <div><span className="text-slate-500">Amount:</span> INR {mockOrderDetails?.amount / 100}</div>
              <div><span className="text-slate-500">Gateway:</span> Razorpay Sandbox</div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleSimulatePayment(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-700 bg-transparent hover:bg-slate-800 transition-colors font-bold text-xs cursor-pointer text-slate-300"
              >
                Simulate Fail
              </button>
              <button
                onClick={() => handleSimulatePayment(true)}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 transition-colors font-bold text-xs text-white cursor-pointer border-0 shadow-md shadow-emerald-600/20"
              >
                Simulate Success
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyCreditsModal;
