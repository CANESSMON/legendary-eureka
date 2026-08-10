import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockJobs } from '../data/mockJobs';
import { API_BASE_URL } from '../config';

// Controlled via .env → VITE_USE_MOCK_DATA=true|false
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole') || null);
  const [employerCredits, setEmployerCredits] = useState({ credits: 0, free_posts_used: 0, free_posts_limit: 3 });

  const [employerProfile, setEmployerProfile] = useState(() => {
    const saved = localStorage.getItem('jobportal_employer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return {
      id: '',
      userId: '',
      fullName: '',
      companyName: '',
      industry: '',
      logo: '',
      establishmentYear: '',
      city: '',
      address: '',
      whatsappNumber: '',
      defaultMessage: 'Hi, I saw your post for {title} on JobPortal. I am interested in applying and would like to connect!',
      verified: false
    };
  });

  // Helper to parse number from salary string
  const parseSalaryValue = (salaryStr) => {
    if (!salaryStr) return 0;
    const cleanStr = salaryStr.toLowerCase().replace(/,/g, '');

    // 1. Check for Lakh / L suffix (e.g. 12L or 12 Lakh)
    const lakhMatch = cleanStr.match(/(\d+(?:\.\d+)?)\s*(?:l|lakh|lac)/);
    if (lakhMatch) {
      const val = parseFloat(lakhMatch[1]) * 100000;
      if (cleanStr.includes('month') || cleanStr.includes('/mo') || cleanStr.includes('pm')) {
        return val * 12;
      }
      return val;
    }

    // 2. Otherwise extract the first number sequence
    const numberMatch = cleanStr.match(/\d+/);
    if (numberMatch) {
      let val = parseInt(numberMatch[0], 10);
      if (cleanStr.includes('month') || cleanStr.includes('/mo') || cleanStr.includes('pm') || cleanStr.includes('internship') || cleanStr.includes('stipend')) {
        if (val < 150000) {
          return val * 12;
        }
      }
      return val;
    }
    return 0;
  };

  const login = (newToken, newRole, newProfile) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userRole', newRole);
    setToken(newToken);
    setUserRole(newRole);
    if (newRole === 'EMPLOYER' && newProfile) {
      const empProfile = newProfile.employer_profile || {};
      const formattedProfile = {
        id: empProfile.id || '',
        userId: newProfile.id || '',
        fullName: newProfile.full_name || '',
        companyName: empProfile.company_name || newProfile.full_name || '',
        industry: empProfile.industry || '',
        logo: empProfile.logo || '',
        establishmentYear: empProfile.establishment_year || '',
        city: empProfile.city || '',
        address: empProfile.address || '',
        whatsappNumber: empProfile.whatsapp_number || '',
        defaultMessage: empProfile.default_message || 'Hi, I saw your post for {title} on JobPortal. I am interested in applying and would like to connect!',
        verified: empProfile.is_verified || false,
        status: empProfile.status || 'Active',
        suspension_reason: empProfile.suspension_reason || '',
        subscription_plan: empProfile.subscription_plan || 'Free',
        subscription_status: empProfile.subscription_status || 'Active'
      };
      setEmployerProfile(formattedProfile);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('jobportal_employer_profile');
    setToken(null);
    setUserRole(null);
    setEmployerProfile({
      id: '',
      userId: '',
      fullName: '',
      companyName: '',
      industry: '',
      logo: '',
      establishmentYear: '',
      city: '',
      address: '',
      whatsappNumber: '',
      defaultMessage: 'Hi, I saw your post for {title} on JobPortal. I am interested in applying and would like to connect!',
      verified: false
    });
  };

  const fetchEmployerCredits = async () => {
    if (!token || userRole !== 'EMPLOYER') return;
    if (USE_MOCK_DATA) {
      const savedCredits = localStorage.getItem('jobportal_mock_credits');
      if (savedCredits) {
        setEmployerCredits(JSON.parse(savedCredits));
      } else {
        const defaultCredits = { credits: 0, free_posts_used: 0, free_posts_limit: 3 };
        setEmployerCredits(defaultCredits);
        localStorage.setItem('jobportal_mock_credits', JSON.stringify(defaultCredits));
      }
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/employer/credits`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setEmployerCredits(data);
      } else if (response.status === 401) {
        logout();
      }
    } catch (err) {
      console.error('Error fetching employer credits:', err);
    }
  };

  const createPaymentOrder = async (packId) => {
    if (USE_MOCK_DATA) {
      return {
        id: `txn_${Math.random().toString(36).substr(2, 9)}`,
        razorpay_order_id: `order_mock_${Math.random().toString(36).substr(2, 14)}`,
        amount: packId === 'single' ? 9900 : packId === 'bundle_5' ? 39900 : 69900,
        currency: 'INR',
        key_id: 'rzp_test_mock_key',
        mock_mode: true
      };
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pack_id: packId })
      });
      if (response.ok) {
        return await response.json();
      } else {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to initiate payment.');
      }
    } catch (err) {
      console.error('Error creating payment order:', err);
      throw err;
    }
  };

  const verifyPayment = async (verificationData) => {
    if (USE_MOCK_DATA) {
      const savedCredits = localStorage.getItem('jobportal_mock_credits');
      let parsed = savedCredits ? JSON.parse(savedCredits) : { credits: 0, free_posts_used: 3, free_posts_limit: 3 };
      
      let added = 1;
      if (verificationData.razorpay_order_id.includes('bundle_5') || verificationData.pack_id === 'bundle_5') added = 5;
      else if (verificationData.razorpay_order_id.includes('bundle_10') || verificationData.pack_id === 'bundle_10') added = 10;
      
      parsed.credits += added;
      setEmployerCredits(parsed);
      localStorage.setItem('jobportal_mock_credits', JSON.stringify(parsed));
      return { status: 'success', message: 'Mock payment verified!', credits: parsed.credits };
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(verificationData)
      });
      if (response.ok) {
        const data = await response.json();
        await fetchEmployerCredits();
        return data;
      } else {
        const err = await response.json();
        throw new Error(err.detail || 'Payment verification failed.');
      }
    } catch (err) {
      console.error('Error verifying payment:', err);
      throw err;
    }
  };

  const refreshEmployerProfile = async () => {
    if (!token || userRole !== 'EMPLOYER') return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/employer/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const empProfile = await response.json();
        setEmployerProfile(prev => ({
          ...prev,
          id: empProfile.id || prev.id,
          companyName: empProfile.company_name || prev.companyName,
          industry: empProfile.industry || prev.industry,
          logo: empProfile.logo || prev.logo,
          city: empProfile.city || prev.city,
          address: empProfile.address || prev.address,
          whatsappNumber: empProfile.whatsapp_number || prev.whatsappNumber,
          verified: empProfile.is_verified,
          status: empProfile.status || prev.status,
          suspension_reason: empProfile.suspension_reason || prev.suspension_reason,
          subscription_plan: empProfile.subscription_plan || prev.subscription_plan,
          subscription_status: empProfile.subscription_status || prev.subscription_status
        }));
      } else if (response.status === 401) {
        logout();
      }
      await fetchEmployerCredits();
    } catch (err) {
      console.error('Error refreshing employer profile:', err);
    }
  };

  const loadJobs = async () => {
    if (USE_MOCK_DATA) {
      const saved = localStorage.getItem('jobportal_jobs');
      if (saved) {
        try {
          setJobs(JSON.parse(saved));
          return;
        } catch (e) { }
      }

      const initialMock = mockJobs.map((job, index) => ({
        ...job,
        isUrgent: job.isUrgent ?? (index % 4 === 0),
        isFeatured: job.isFeatured ?? (index % 5 === 1),
        status: job.status || 'Active',
        views: job.views || Math.floor(Math.random() * 450) + 50,
        applicantsCount: job.applicantsCount || Math.floor(Math.random() * 35) + 3,
        applyClicks: job.applyClicks || Math.floor(Math.random() * 40) + 10,
        whatsappNumber: job.whatsappNumber || '+919876543210',
        whatsappMessage: job.whatsappMessage || `Hi, I am interested in applying for ${job.title} at ${job.company} posted on JobPortal. Please share more details!`,
        postedDate: job.time || 'Recently',
        createdAt: new Date(Date.now() - index * 12 * 60 * 60 * 1000).toISOString(),
        minSalary: job.minSalary || parseSalaryValue(job.salary),
        requirements: job.requirements || 'Key Skills: Communication, Problem Solving, Domain Expertise',
        applicants: job.applicants || []
      }));
      initialMock.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setJobs(initialMock);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs`);
      if (response.ok) {
        const data = await response.json();
        const mappedJobs = data.map((job) => {
          const formattedDate = job.created_at
            ? new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'Recently';
          return {
            id: job.id,
            reference_number: job.reference_number,
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            type: job.type || 'Full-time',
            category: job.category,
            description: job.description || '',
            requirements: job.requirements || 'Key Skills: Communication, Problem Solving, Domain Expertise',
            isUrgent: job.is_urgent,
            isFeatured: job.is_featured,
            status: job.status || 'Active',
            views: job.views_count || 0,
            applicantsCount: job.applications_count || 0,
            applyClicks: job.applications_count || 0,
            whatsappNumber: job.whatsapp_number || '+919876543210',
            whatsappMessage: `Hi, I am interested in applying for ${job.title} at ${job.company} posted on JobPortal. Please share more details!`,
            postedDate: formattedDate,
            createdAt: job.created_at || new Date(0).toISOString(),
            salary_min: job.salary_min,
            salary_max: job.salary_max,
            salary_period: job.salary_period || 'year',
            minSalary: job.salary_min ? (job.salary_period === 'month' ? job.salary_min * 12 : job.salary_min * 100000) : (job.min_salary ? parseInt(job.min_salary) : parseSalaryValue(job.salary)),
            applicants: [],
            employerId: job.employer_id,
            moderationReason: job.moderation_reason,
            appealText: job.appeal_text,
            appealStatus: job.appeal_status,
            classified_heading: job.classified_heading
          };
        });
        mappedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setJobs(mappedJobs);
      }
    } catch (err) {
      console.error('Error fetching jobs from API:', err);
    }
  };

  // Initial load & background polling
  useEffect(() => {
    loadJobs();
    refreshEmployerProfile();
    fetchPlans();

    const interval = setInterval(() => {
      loadJobs();
      refreshEmployerProfile();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [token, userRole]);

  // Save to localStorage on change ONLY when in mock mode
  useEffect(() => {
    if (USE_MOCK_DATA && jobs.length > 0) {
      localStorage.setItem('jobportal_jobs', JSON.stringify(jobs));
    }
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('jobportal_employer_profile', JSON.stringify(employerProfile));
  }, [employerProfile]);

  // Actions
  const addJob = async (newJobData) => {
    if (USE_MOCK_DATA) {
      const employerJobs = jobs.filter(j => j.employerId === employerProfile.id);
      let usedPaidCredit = false;

      if (employerJobs.length >= 3) {
        const savedCredits = localStorage.getItem('jobportal_mock_credits');
        let parsed = savedCredits ? JSON.parse(savedCredits) : { credits: 0, free_posts_used: 3, free_posts_limit: 3 };
        
        if (parsed.credits <= 0) {
          const err = new Error('CREDITS_EXHAUSTED');
          err.status = 402;
          err.code = 'CREDITS_EXHAUSTED';
          throw err;
        }
        parsed.credits -= 1;
        setEmployerCredits(parsed);
        localStorage.setItem('jobportal_mock_credits', JSON.stringify(parsed));
        usedPaidCredit = true;
      }

      const newJob = {
        id: Date.now(),
        company: newJobData.company || employerProfile.companyName,
        whatsappNumber: newJobData.whatsappNumber || employerProfile.whatsappNumber,
        whatsappMessage: newJobData.whatsappMessage || `Hi, I am interested in applying for ${newJobData.title} at ${newJobData.company || employerProfile.companyName} listed on JobPortal.`,
        time: 'Just now',
        postedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        iconBg: newJobData.category === 'IT' ? 'bg-indigo-50' : 'bg-emerald-50',
        iconColor: newJobData.category === 'IT' ? 'text-indigo-600' : 'text-emerald-600',
        views: 0,
        applicantsCount: 0,
        applyClicks: 0,
        applicants: [],
        status: 'Active',
        minSalary: parseInt(newJobData.salary) || 10,
        employerId: employerProfile.id,
        used_paid_credit: usedPaidCredit,
        ...newJobData
      };
      setJobs((prevJobs) => [newJob, ...prevJobs]);
      return newJob;
    }

    let salaryString = newJobData.salary || '';
    if (newJobData.salary_min && newJobData.salary_max) {
      if (newJobData.salary_period === 'month') {
        const formattedMin = parseInt(newJobData.salary_min).toLocaleString('en-IN');
        const formattedMax = parseInt(newJobData.salary_max).toLocaleString('en-IN');
        salaryString = `₹${formattedMin} - ₹${formattedMax} PM`;
      } else {
        salaryString = `₹${newJobData.salary_min}L - ₹${newJobData.salary_max}L PA`;
      }
    }

    const payload = {
      title: newJobData.title,
      company: newJobData.company || employerProfile.companyName,
      location: newJobData.location || employerProfile.city || 'Bangalore',
      salary: salaryString,
      min_salary: newJobData.salary_min ? (newJobData.salary_period === 'month' ? (parseInt(newJobData.salary_min) * 12).toString() : (parseInt(newJobData.salary_min) * 100000).toString()) : (newJobData.minSalary?.toString() || null),
      type: newJobData.type || 'Full-time',
      category: newJobData.category,
      description: newJobData.description || '',
      requirements: newJobData.requirements || '',
      is_urgent: newJobData.isUrgent || false,
      is_featured: newJobData.isFeatured || false,
      employer_id: employerProfile.id || null,
      status: 'Active',
      classified_heading: newJobData.classified_heading || null,
      salary_min: newJobData.salary_min ? parseInt(newJobData.salary_min) : null,
      salary_max: newJobData.salary_max ? parseInt(newJobData.salary_max) : null,
      salary_period: newJobData.salary_period || 'year'
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const job = await response.json();
        const mappedJob = {
          id: job.id,
          reference_number: job.reference_number,
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          type: job.type || 'Full-time',
          category: job.category,
          description: job.description || '',
          requirements: job.requirements || 'Key Skills: Communication, Problem Solving, Domain Expertise',
          isUrgent: job.is_urgent,
          isFeatured: job.is_featured,
          status: job.status || 'Active',
          views: job.views_count || 0,
          applicantsCount: job.applications_count || 0,
          applyClicks: job.applications_count || 0,
          whatsappNumber: newJobData.whatsappNumber || employerProfile.whatsappNumber || '+919876543210',
          whatsappMessage: newJobData.whatsappMessage || `Hi, I am interested in applying for ${job.title} at ${job.company} posted on JobPortal. Please share more details!`,
          postedDate: 'Just now',
          createdAt: job.created_at || new Date().toISOString(),
          applicants: [],
          classified_heading: job.classified_heading,
          salary_min: job.salary_min,
          salary_max: job.salary_max,
          salary_period: job.salary_period || 'year',
          minSalary: job.salary_min ? (job.salary_period === 'month' ? job.salary_min * 12 : job.salary_min * 100000) : parseSalaryValue(job.salary)
        };
        setJobs((prevJobs) => [mappedJob, ...prevJobs]);
        return mappedJob;
      } else {
        const errStatus = response.status;
        let errMsg = 'Failed to create job posting.';
        try {
          const errData = await response.json();
          errMsg = errData.detail || errMsg;
        } catch (e) {}
        const error = new Error(errMsg);
        error.status = errStatus;
        throw error;
      }
    } catch (err) {
      console.error('Error adding job to API:', err);
      throw err;
    }
  };

  const updateJob = async (jobId, updatedData) => {
    if (USE_MOCK_DATA) {
      setJobs((prevJobs) =>
        prevJobs.map((j) => (j.id === jobId ? { ...j, ...updatedData } : j))
      );
      return;
    }

    let salaryString = updatedData.salary || '';
    if (updatedData.salary_min && updatedData.salary_max) {
      if (updatedData.salary_period === 'month') {
        const formattedMin = parseInt(updatedData.salary_min).toLocaleString('en-IN');
        const formattedMax = parseInt(updatedData.salary_max).toLocaleString('en-IN');
        salaryString = `₹${formattedMin} - ₹${formattedMax} PM`;
      } else {
        salaryString = `₹${updatedData.salary_min}L - ₹${updatedData.salary_max}L PA`;
      }
    }

    const payload = {
      title: updatedData.title,
      company: updatedData.company || employerProfile.companyName,
      location: updatedData.location || employerProfile.city || 'Bangalore',
      salary: salaryString,
      min_salary: updatedData.salary_min ? (updatedData.salary_period === 'month' ? (parseInt(updatedData.salary_min) * 12).toString() : (parseInt(updatedData.salary_min) * 100000).toString()) : (updatedData.minSalary?.toString() || null),
      type: updatedData.type || 'Full-time',
      category: updatedData.category,
      description: updatedData.description || '',
      requirements: updatedData.requirements || '',
      is_urgent: updatedData.isUrgent || false,
      is_featured: updatedData.isFeatured || false,
      employer_id: employerProfile.id || null,
      status: updatedData.status || 'Active',
      classified_heading: updatedData.classified_heading || null,
      salary_min: updatedData.salary_min ? parseInt(updatedData.salary_min) : null,
      salary_max: updatedData.salary_max ? parseInt(updatedData.salary_max) : null,
      salary_period: updatedData.salary_period || 'year'
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const job = await response.json();
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            j.id === jobId
              ? {
                ...j,
                reference_number: job.reference_number,
                title: job.title,
                company: job.company,
                location: job.location,
                salary: job.salary,
                type: job.type,
                category: job.category,
                description: job.description || '',
                requirements: job.requirements || 'Key Skills: Communication, Problem Solving, Domain Expertise',
                isUrgent: job.is_urgent,
                isFeatured: job.is_featured,
                status: job.status || 'Active',
                whatsappNumber: updatedData.whatsappNumber || j.whatsappNumber,
                whatsappMessage: updatedData.whatsappMessage || j.whatsappMessage,
                classified_heading: job.classified_heading,
                salary_min: job.salary_min,
                salary_max: job.salary_max,
                salary_period: job.salary_period,
                minSalary: job.salary_min ? (job.salary_period === 'month' ? job.salary_min * 12 : job.salary_min * 100000) : parseSalaryValue(job.salary)
              }
              : j
          )
        );
      }
    } catch (err) {
      console.error('Error updating job via API:', err);
    }
  };

  const deleteJob = async (jobId) => {
    if (USE_MOCK_DATA) {
      setJobs((prevJobs) =>
        prevJobs.map((j) => (j.id === jobId ? { ...j, status: 'Deleted' } : j))
      );
      return true;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        setJobs((prevJobs) =>
          prevJobs.map((j) => (j.id === jobId ? { ...j, status: 'Deleted' } : j))
        );
        return true;
      } else {
        const errData = await response.json().catch(() => ({}));
        console.error('Failed to delete job:', response.status, errData);
        alert(`Failed to delete job: ${errData.detail || response.statusText || 'Server Error'}`);
        return false;
      }
    } catch (err) {
      console.error('Error deleting job via API:', err);
      alert(`Error deleting job: ${err.message || err}`);
      return false;
    }
  };

  const suspendJob = async (jobId, reason) => {
    if (USE_MOCK_DATA) {
      setJobs((prevJobs) =>
        prevJobs.map((j) =>
          j.id === jobId
            ? {
              ...j,
              status: 'Suspended',
              moderationReason: reason,
              appealStatus: null,
              appealText: null
            }
            : j
        )
      );
      return true;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });
      if (response.ok) {
        const job = await response.json();
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            j.id === jobId
              ? {
                ...j,
                status: job.status,
                moderationReason: job.moderation_reason,
                appealStatus: job.appeal_status,
                appealText: job.appeal_text
              }
              : j
          )
        );
        return true;
      }
    } catch (err) {
      console.error('Error suspending job via API:', err);
    }
    return false;
  };

  const submitAppeal = async (jobId, appealText) => {
    if (USE_MOCK_DATA) {
      setJobs((prevJobs) =>
        prevJobs.map((j) =>
          j.id === jobId
            ? {
              ...j,
              appealStatus: 'Pending',
              appealText: appealText
            }
            : j
        )
      );
      return true;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/appeal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ appeal_text: appealText })
      });
      if (response.ok) {
        const job = await response.json();
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            j.id === jobId
              ? {
                ...j,
                appealStatus: job.appeal_status,
                appealText: job.appeal_text
              }
              : j
          )
        );
        return true;
      }
    } catch (err) {
      console.error('Error submitting appeal via API:', err);
    }
    return false;
  };

  const restoreJob = async (jobId) => {
    if (USE_MOCK_DATA) {
      setJobs((prevJobs) =>
        prevJobs.map((j) =>
          j.id === jobId
            ? {
              ...j,
              status: 'Active',
              moderationReason: null,
              appealStatus: null,
              appealText: null
            }
            : j
        )
      );
      return true;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs/${jobId}/restore`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const job = await response.json();
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            j.id === jobId
              ? {
                ...j,
                status: job.status,
                moderationReason: job.moderation_reason,
                appealStatus: job.appeal_status,
                appealText: job.appeal_text
              }
              : j
          )
        );
        return true;
      }
    } catch (err) {
      console.error('Error restoring job via API:', err);
    }
    return false;
  };

  const toggleJobStatus = async (jobId) => {
    let nextStatus = 'Active';
    setJobs((prevJobs) =>
      prevJobs.map((j) => {
        if (j.id === jobId) {
          nextStatus = j.status === 'Active' ? 'Paused' : 'Active';
          return { ...j, status: nextStatus };
        }
        return j;
      })
    );

    if (USE_MOCK_DATA) return;

    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const payload = {
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      min_salary: job.minSalary?.toString() || null,
      type: job.type || 'Full-time',
      category: job.category,
      description: job.description || '',
      requirements: job.requirements || '',
      is_urgent: job.isUrgent,
      is_featured: job.isFeatured,
      employer_id: job.employer_id || employerProfile.id || null,
      status: nextStatus
    };

    try {
      await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Error toggling job status via API:', err);
    }
  };

  const toggleUrgentBadge = async (jobId) => {
    let nextUrgent = false;
    setJobs((prevJobs) =>
      prevJobs.map((j) => {
        if (j.id === jobId) {
          nextUrgent = !j.isUrgent;
          return { ...j, isUrgent: nextUrgent };
        }
        return j;
      })
    );

    if (USE_MOCK_DATA) return;

    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const payload = {
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      min_salary: job.minSalary?.toString() || null,
      type: job.type || 'Full-time',
      category: job.category,
      description: job.description || '',
      requirements: job.requirements || '',
      is_urgent: nextUrgent,
      is_featured: job.isFeatured,
      employer_id: job.employerId || employerProfile.id || null,
      status: job.status || 'Active'
    };

    try {
      await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Error toggling urgent badge via API:', err);
    }
  };

  const toggleFeaturedBadge = async (jobId) => {
    let nextFeatured = false;
    setJobs((prevJobs) =>
      prevJobs.map((j) => {
        if (j.id === jobId) {
          nextFeatured = !j.isFeatured;
          return { ...j, isFeatured: nextFeatured };
        }
        return j;
      })
    );

    if (USE_MOCK_DATA) return;

    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    const payload = {
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary,
      min_salary: job.minSalary?.toString() || null,
      type: job.type || 'Full-time',
      category: job.category,
      description: job.description || '',
      requirements: job.requirements || '',
      is_urgent: job.isUrgent,
      is_featured: nextFeatured,
      employer_id: job.employerId || employerProfile.id || null,
      status: job.status || 'Active'
    };

    try {
      await fetch(`${API_BASE_URL}/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    } catch (err) {
      console.error('Error toggling featured badge via API:', err);
    }
  };

  const incrementJobViews = async (jobId) => {
    let nextViews = 0;
    setJobs((prevJobs) =>
      prevJobs.map((j) => {
        if (j.id === jobId) {
          nextViews = (j.views || 0) + 1;
          return { ...j, views: nextViews };
        }
        return j;
      })
    );

    if (USE_MOCK_DATA) return;

    try {
      await fetch(`${API_BASE_URL}/api/jobs/${jobId}/view`, {
        method: 'POST'
      });
    } catch (err) {
      console.error('Error incrementing job views via API:', err);
    }
  };

  // Helper to format clean WhatsApp apply message with dynamic job title
  const formatWhatsAppMessage = (rawMsg, jobTitle, companyName) => {
    const comp = companyName || employerProfile.companyName || 'the company';
    if (!rawMsg) {
      return `Hi, I am interested in applying for ${jobTitle} at ${comp} listed on JobPortal.`;
    }

    let text = rawMsg
      .replace(/\[Job Title\]/gi, jobTitle)
      .replace(/\{Job Title\}/gi, jobTitle)
      .replace(/\[title\]/gi, jobTitle)
      .replace(/\{title\}/gi, jobTitle)
      .replace(/\[Company Name\]/gi, comp)
      .replace(/\{Company Name\}/gi, comp)
      .replace(/\[company\]/gi, comp)
      .replace(/\{company\}/gi, comp);

    // If the message still doesn't contain the job title, replace cleanly
    if (!text.toLowerCase().includes(jobTitle.toLowerCase())) {
      text = `Hi, I am interested in applying for ${jobTitle} at ${comp} listed on JobPortal.`;
    }

    return text;
  };

  // Direct WhatsApp contact apply click handler
  const trackWhatsAppApply = (jobId, candidateName = 'Job Seeker') => {
    let whatsappUrl = '#';

    setJobs((prevJobs) =>
      prevJobs.map((j) => {
        if (j.id === jobId) {
          const phone = (j.whatsappNumber || employerProfile.whatsappNumber || '+919876543210').replace(/\D/g, '');
          const messageText = formatWhatsAppMessage(j.whatsappMessage, j.title, j.company);

          whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(messageText)}`;

          const newApp = {
            id: `wa-click-${Date.now()}`,
            name: candidateName,
            email: 'Direct Contact Candidate',
            appliedDate: 'Just now',
            experience: 'Direct Apply Contact',
            status: 'Applied / Contacted',
            resumeUrl: '#'
          };

          return {
            ...j,
            applyClicks: (j.applyClicks || 0) + 1,
            applicantsCount: (j.applicantsCount || 0) + 1,
            applicants: [newApp, ...(j.applicants || [])]
          };
        }
        return j;
      })
    );

    if (whatsappUrl !== '#') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }

    if (!USE_MOCK_DATA) {
      fetch(`${API_BASE_URL}/api/jobs/${jobId}/apply`, {
        method: 'POST'
      }).catch((err) => console.error('Error tracking apply via API:', err));
    }
  };

  const updateEmployerProfile = async (updatedProfile) => {
    setEmployerProfile((prev) => ({ ...prev, ...updatedProfile }));

    if (USE_MOCK_DATA) return true;

    try {
      const response = await fetch(`${API_BASE_URL}/api/employer/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedProfile)
      });
      if (response.ok) {
        const responseData = await response.json();
        setJobs(prevJobs =>
          prevJobs.map(j => {
            if (j.employerId === responseData.id || j.company.toLowerCase() === responseData.company_name.toLowerCase()) {
              return { ...j, whatsappNumber: responseData.whatsapp_number };
            }
            return j;
          })
        );
        return true;
      }
    } catch (err) {
      console.error('Error saving employer profile to API:', err);
    }
    return false;
  };



  // Helper getters
  const getEmployerJobs = (companyName = employerProfile.companyName) => {
    return jobs.filter((j) => j.company.toLowerCase() === companyName.toLowerCase());
  };

  const getAnalytics = (companyName = employerProfile.companyName) => {
    const empJobs = getEmployerJobs(companyName);
    const activeJobs = empJobs.filter((j) => j.status === 'Active').length;
    const totalViews = empJobs.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalApplyClicks = empJobs.reduce((acc, curr) => acc + (curr.applyClicks || curr.applicantsCount || 0), 0);
    const conversionRate = totalViews > 0 ? ((totalApplyClicks / totalViews) * 100).toFixed(1) : 0;
    const urgentCount = empJobs.filter((j) => j.isUrgent).length;

    return {
      totalJobs: empJobs.length,
      activeJobs,
      totalViews,
      totalApplyClicks,
      totalApplications: totalApplyClicks,
      conversionRate,
      urgentCount
    };
  };

  // Admin and Category Actions
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/categories/public`);
      if (response.ok) {
        return await response.json();
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
    return [];
  };

  const addCategory = async (name) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      if (response.ok) return await response.json();
    } catch (err) {
      console.error('Error adding category:', err);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response;
    } catch (err) {
      console.error('Error deleting category:', err);
      return null;
    }
  };

  const fetchAdminStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) return await response.json();
    } catch (err) {
      console.error('Error fetching admin stats:', err);
    }
  };

  const fetchActivityLogs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) return await response.json();
    } catch (err) {
      console.error('Error fetching activity logs:', err);
    }
  };

  const fetchAdminEmployers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/employers`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) return await response.json();
    } catch (err) {
      console.error('Error fetching admin employers:', err);
    }
  };

  const verifyEmployer = async (employerId) => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/employers/${employerId}/verify`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Error verifying employer:', err);
    }
  };

  const updateEmployerSubscription = async (employerId, plan, status) => {
    try {
      await fetch(`${API_BASE_URL}/api/admin/employers/${employerId}/subscription`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subscription_plan: plan, subscription_status: status })
      });
    } catch (err) {
      console.error('Error updating subscription:', err);
    }
  };

  const fetchAdminAgents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/agents`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) return await response.json();
    } catch (err) {
      console.error('Error fetching admin agents:', err);
    }
  };

  const [plans, setPlans] = useState([]);

  const fetchPlans = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/plans/public`);
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
        return data;
      }
    } catch (err) {
      console.error('Error fetching plans:', err);
    }
    return [];
  };

  const updatePlan = async (planId, updatedPlanData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/plans/${planId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedPlanData)
      });
      if (response.ok) {
        fetchPlans();
        return true;
      }
    } catch (err) {
      console.error('Error updating plan:', err);
    }
    return false;
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        token,
        userRole,
        login,
        logout,
        employerProfile,
        setEmployerProfile,
        updateEmployerProfile,
        addJob,
        updateJob,
        deleteJob,
        toggleJobStatus,
        toggleUrgentBadge,
        toggleFeaturedBadge,
        incrementJobViews,
        trackWhatsAppApply,
        getEmployerJobs,
        getAnalytics,
        fetchCategories,
        addCategory,
        deleteCategory,
        fetchAdminStats,
        fetchAdminEmployers,
        verifyEmployer,
        updateEmployerSubscription,
        fetchAdminAgents,
        plans,
        fetchPlans,
        updatePlan,
        suspendJob,
        submitAppeal,
        restoreJob,
        fetchActivityLogs,
        employerCredits,
        setEmployerCredits,
        fetchEmployerCredits,
        createPaymentOrder,
        verifyPayment
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
