import React, { useState } from 'react';
import { useJobs } from '../../context/JobContext';
import { 
  Building2, User, MapPin, Calendar, Phone, MessageSquare, 
  CheckCircle2, Save, ShieldCheck, Globe
} from 'lucide-react';

const PRESET_LOGOS = [
  'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80'
];

const CompanyProfile = () => {
  const { employerProfile, updateEmployerProfile } = useJobs();

  const [formData, setFormData] = useState({
    fullName: employerProfile.fullName || '',
    companyName: employerProfile.companyName || '',
    industry: employerProfile.industry || '',
    logo: employerProfile.logo || PRESET_LOGOS[0],
    establishmentYear: employerProfile.establishmentYear || '',
    city: employerProfile.city || '',
    address: employerProfile.address || '',
    whatsappNumber: employerProfile.whatsappNumber || '',
    defaultMessage: employerProfile.defaultMessage || 'Hi, I am interested in applying for {title} at {company} listed on JobPortal.'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  // Calculate completion percentage
  const fields = [formData.fullName, formData.companyName, formData.logo, formData.establishmentYear, formData.city, formData.address, formData.whatsappNumber];
  const filledFields = fields.filter(f => f && f.trim().length > 0).length;
  const completionPercentage = Math.round((filledFields / fields.length) * 100);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const errors = {};

    // 1 & 3: Contact Person Full Name
    const fullNameVal = formData.fullName.trim();
    if (!fullNameVal) {
      errors.fullName = 'Contact person full name is required';
    } else if (fullNameVal.length < 2) {
      errors.fullName = 'Full name must be at least 2 characters long';
    } else if (fullNameVal.length > 100) {
      errors.fullName = 'Full name must not exceed 100 characters';
    } else if (/\d/.test(fullNameVal)) {
      errors.fullName = 'Please enter a valid full name (numeric characters are not allowed)';
    } else if (!/^[a-zA-ZÀ-ÖØ-öø-ÿĀ-žА-яÁ-ú\s\-'.]+$/.test(fullNameVal)) {
      errors.fullName = 'Full name contains invalid characters';
    }

    // 2: Company Name
    const companyVal = formData.companyName.trim();
    if (!companyVal) {
      errors.companyName = 'Company name is required';
    } else if (companyVal.length < 2) {
      errors.companyName = 'Company name must be at least 2 characters long';
    } else if (companyVal.length > 100) {
      errors.companyName = 'The Company Name field should allow a maximum of 100 characters only';
    } else if (/<[^>]+>/.test(companyVal)) {
      errors.companyName = 'Company name must not contain HTML tags';
    }

    // 4: Establishment Year
    const yearVal = formData.establishmentYear.trim();
    const currentYear = new Date().getFullYear();
    if (yearVal) {
      if (!/^\d{4}$/.test(yearVal)) {
        errors.establishmentYear = 'Please enter a valid 4-digit numeric year (e.g. 2016)';
      } else {
        const yNum = parseInt(yearVal, 10);
        if (yNum < 1800 || yNum > currentYear) {
          errors.establishmentYear = `Establishment year must be between 1800 and ${currentYear}`;
        }
      }
    }

    // 5, 6, 7: Custom Logo URL
    const logoVal = formData.logo.trim();
    if (logoVal) {
      const lowerLogo = logoVal.toLowerCase();
      if (!lowerLogo.startsWith('http://') && !lowerLogo.startsWith('https://')) {
        errors.logo = 'Please enter a valid HTTPS image URL';
      } else if (/javascript:|data:|vbscript:/.test(lowerLogo)) {
        errors.logo = 'Please enter a valid HTTPS image URL';
      } else {
        try {
          const parsed = new URL(lowerLogo);
          const host = parsed.hostname.toLowerCase();
          if (
            host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' || host === '169.254.169.254' || host === '::1' ||
            /^10\./.test(host) || /^192\.168\./.test(host) || /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host) || /^169\.254\./.test(host)
          ) {
            errors.logo = 'Internal, loopback, or localhost URLs are not allowed';
          }
        } catch (_) {}
        const cleanPath = lowerLogo.split('?')[0].split('#')[0];
        if (/\.(pdf|doc|docx|exe|zip|rar|txt|html|php|bin|tar|gz|mp4|mp3)$/.test(cleanPath)) {
          errors.logo = 'Please enter a valid image URL (.jpg, .png, .webp, .svg). Non-image files like .pdf are rejected';
        }
      }
    }

    // 8 & 9: City Name
    const cityVal = formData.city.trim();
    if (!cityVal) {
      errors.city = 'Please enter a valid city name';
    } else if (cityVal.length < 2) {
      errors.city = 'Please enter a valid city name';
    } else if (cityVal.length > 100) {
      errors.city = 'City name must not exceed 100 characters';
    } else if (!/[a-zA-ZÀ-ÖØ-öø-ÿĀ-žА-яÁ-ú]/.test(cityVal) || /^[\-'.\s]+$/.test(cityVal) || /^\d+$/.test(cityVal)) {
      errors.city = 'Please enter a valid city name';
    }

    // 10 & 11: Address
    const addressVal = formData.address.trim();
    if (addressVal) {
      if (addressVal.length < 5) {
        errors.address = 'Please enter a valid address';
      } else if (addressVal.length > 255) {
        errors.address = 'Address must not exceed 255 characters';
      } else if (/<[^>]+>|<script/i.test(addressVal)) {
        errors.address = 'Address field must not contain HTML or <script> tags';
      }
    }

    // 12: Primary WhatsApp / Phone Number
    const phoneVal = formData.whatsappNumber.trim();
    if (!phoneVal) {
      errors.whatsappNumber = 'Please enter a valid phone number';
    } else if (/<[^>]+>|<script/i.test(phoneVal)) {
      errors.whatsappNumber = 'Please enter a valid phone number';
    } else if (!/^\+?[0-9\s\-\(\)]+$/.test(phoneVal)) {
      errors.whatsappNumber = 'Please enter a valid phone number without special characters';
    } else {
      const cleanPhone = phoneVal.replace(/\D/g, '');
      if (cleanPhone.length < 10 || cleanPhone.length > 15) {
        errors.whatsappNumber = 'Please enter a valid phone number (10 to 15 digits)';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    updateEmployerProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Completion Meter */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck size={13} />
              Company Profile Settings
            </span>
          </div>
          <h2 className="h2 text-slate-900">Company & Contact Settings</h2>
          <p className="body-text text-slate-500 text-xs mt-0.5">
            Configure contact person details, company logo branding, and default WhatsApp candidate apply templates.
          </p>
        </div>

        {/* Completion Progress Meter */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 w-full md:w-auto min-w-[200px]">
          <div className="flex justify-between items-center text-xs font-bold mb-1">
            <span className="text-slate-500 text-[10px]">Profile Status</span>
            <span className={completionPercentage === 100 ? 'text-emerald-600 font-extrabold' : 'text-primary font-bold'}>
              {completionPercentage}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${
                completionPercentage === 100 ? 'bg-emerald-500' : 'bg-primary'
              }`}
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 font-extrabold text-xs animate-fade-in shadow-2xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          Company profile updated successfully! All new job posts will use your updated contact details.
        </div>
      )}

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
        
        {/* Section 1: Contact Person & Company Basic Info */}
        <div className="space-y-4">
          <h3 className="h3 text-xs font-bold text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
            <User size={15} className="text-primary" />
            1. Contact Person & Company Info
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="form-label block text-xs font-bold text-slate-700 mb-1.5">
                Contact Person Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Rajesh Sharma"
                  required
                  className={`w-full pl-9 pr-4 py-2 rounded-xl border ${fieldErrors.fullName ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900`}
                />
              </div>
              {fieldErrors.fullName && (
                <p className="text-[11px] font-semibold text-rose-600 mt-1">{fieldErrors.fullName}</p>
              )}
            </div>

            <div>
              <label className="form-label block text-xs font-bold text-slate-700 mb-1.5">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  maxLength={100}
                  placeholder="e.g. Tech Solutions Pvt Ltd"
                  required
                  className={`w-full pl-9 pr-4 py-2 rounded-xl border ${fieldErrors.companyName ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900`}
                />
              </div>
              {fieldErrors.companyName && (
                <p className="text-[11px] font-semibold text-rose-600 mt-1">{fieldErrors.companyName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Establishment Year
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  type="text"
                  name="establishmentYear"
                  value={formData.establishmentYear}
                  onChange={handleChange}
                  maxLength={4}
                  placeholder="e.g. 2016"
                  className={`w-full pl-9 pr-4 py-2 rounded-xl border ${fieldErrors.establishmentYear ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900`}
                />
              </div>
              {fieldErrors.establishmentYear && (
                <p className="text-[11px] font-semibold text-rose-600 mt-1">{fieldErrors.establishmentYear}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Industry Sector
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g. Information Technology / Software"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Logo Selection */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Globe size={15} className="text-primary" />
            2. Company Branding & Logo
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Select Logo Preset or Custom Image URL
            </label>
            
            <div className="flex items-center gap-3 mb-3">
              {PRESET_LOGOS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, logo: url }));
                    if (fieldErrors.logo) setFieldErrors(prev => ({ ...prev, logo: null }));
                  }}
                  className={`w-12 h-12 rounded-xl border-2 overflow-hidden transition-all cursor-pointer ${
                    formData.logo === url ? 'border-primary ring-2 ring-primary/20 scale-105' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Select logo preset ${i + 1}`}
                >
                  <img src={url} alt="Logo preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <input
              type="text"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="Paste custom logo image URL..."
              className={`w-full px-3 py-2 rounded-xl border ${fieldErrors.logo ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900`}
            />
            {fieldErrors.logo && (
              <p className="text-[11px] font-semibold text-rose-600 mt-1">{fieldErrors.logo}</p>
            )}
          </div>
        </div>

        {/* Section 3: Location & Address */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 flex items-center gap-2 border-b border-slate-100 pb-2">
            <MapPin size={15} className="text-primary" />
            3. City & Address
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Bangalore"
                required
                className={`w-full px-3 py-2 rounded-xl border ${fieldErrors.city ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900`}
              />
              {fieldErrors.city && (
                <p className="text-[11px] font-semibold text-rose-600 mt-1">{fieldErrors.city}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Full Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="e.g. Plot 42, Electronic City Phase 1, Bangalore"
                className={`w-full px-3 py-2 rounded-xl border ${fieldErrors.address ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-200'} focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900`}
              />
              {fieldErrors.address && (
                <p className="text-[11px] font-semibold text-rose-600 mt-1">{fieldErrors.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Direct WhatsApp Contact Settings */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/90 space-y-3">
          <h3 className="text-xs font-bold text-emerald-950 flex items-center gap-2">
            <Phone size={15} className="text-emerald-600" />
            4. Direct WhatsApp Candidate Apply Defaults
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                Primary WhatsApp Number <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 text-emerald-600" size={16} />
                <input
                  type="text"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  placeholder="e.g. +919876543210"
                  required
                  className={`w-full pl-9 pr-4 py-2 rounded-xl border ${fieldErrors.whatsappNumber ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-emerald-300'} focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs font-bold text-emerald-950 bg-white`}
                />
              </div>
              {fieldErrors.whatsappNumber && (
                <p className="text-[11px] font-semibold text-rose-600 mt-1">{fieldErrors.whatsappNumber}</p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                Default Candidate WhatsApp Message Template
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-2.5 text-emerald-600" size={16} />
                <input
                  type="text"
                  name="defaultMessage"
                  value={formData.defaultMessage}
                  onChange={handleChange}
                  placeholder="e.g. Hi, I am interested in applying for {title}..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium text-emerald-950 bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20 flex items-center gap-1.5 text-xs cursor-pointer border-0 w-full sm:w-auto justify-center"
          >
            <Save size={16} />
            Save Profile & WhatsApp Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default CompanyProfile;

