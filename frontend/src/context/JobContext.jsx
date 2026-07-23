import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockJobs } from '../data/mockJobs';

// Controlled via .env → VITE_USE_MOCK_DATA=true|false
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);

  const [employerProfile, setEmployerProfile] = useState(() => {
    const saved = localStorage.getItem('jobportal_employer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
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
    const numbers = salaryStr.replace(/,/g, '').match(/\d+/g);
    if (numbers && numbers.length > 0) {
      return parseInt(numbers[0], 10);
    }
    return 0;
  };

  // Load jobs from API or mock
  useEffect(() => {
    const loadJobs = async () => {
      if (USE_MOCK_DATA) {
        const saved = localStorage.getItem('jobportal_jobs');
        if (saved) {
          try {
            setJobs(JSON.parse(saved));
            return;
          } catch (e) {}
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
        setJobs(initialMock);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/jobs');
        if (response.ok) {
          const data = await response.json();
          const mappedJobs = data.map((job) => {
            const formattedDate = job.created_at 
              ? new Date(job.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'Recently';
            return {
              id: job.id,
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
              views: parseInt(job.views_count) || 0,
              applicantsCount: parseInt(job.applications_count) || 0,
              applyClicks: parseInt(job.applications_count) || 0,
              whatsappNumber: job.whatsappNumber || '+919876543210',
              whatsappMessage: `Hi, I am interested in applying for ${job.title} at ${job.company} posted on JobPortal. Please share more details!`,
              postedDate: formattedDate,
              createdAt: job.created_at || new Date(0).toISOString(),
              minSalary: job.min_salary ? parseInt(job.min_salary) : parseSalaryValue(job.salary),
              applicants: []
            };
          });
          setJobs(mappedJobs);
        }
      } catch (err) {
        console.error('Error fetching jobs from API:', err);
      }
    };

    loadJobs();
  }, []);

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
        ...newJobData
      };
      setJobs((prevJobs) => [newJob, ...prevJobs]);
      return newJob;
    }

    const payload = {
      title: newJobData.title,
      company: newJobData.company || employerProfile.companyName,
      location: newJobData.location || employerProfile.city || 'Bangalore',
      salary: newJobData.salary,
      min_salary: newJobData.minSalary?.toString() || null,
      type: newJobData.type || 'Full-time',
      category: newJobData.category,
      description: newJobData.description || '',
      requirements: newJobData.requirements || '',
      is_urgent: newJobData.isUrgent || false,
      is_featured: newJobData.isFeatured || false,
      employer_id: employerProfile.id || null,
      status: 'Active'
    };

    try {
      const response = await fetch('http://localhost:8000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const job = await response.json();
        const mappedJob = {
          id: job.id,
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
          views: parseInt(job.views_count) || 0,
          applicantsCount: parseInt(job.applications_count) || 0,
          applyClicks: parseInt(job.applications_count) || 0,
          whatsappNumber: newJobData.whatsappNumber || employerProfile.whatsappNumber || '+919876543210',
          whatsappMessage: newJobData.whatsappMessage || `Hi, I am interested in applying for ${job.title} at ${job.company} posted on JobPortal. Please share more details!`,
          postedDate: 'Just now',
          createdAt: job.created_at || new Date().toISOString(),
          applicants: []
        };
        setJobs((prevJobs) => [mappedJob, ...prevJobs]);
        return mappedJob;
      }
    } catch (err) {
      console.error('Error adding job to API:', err);
    }
  };

  const updateJob = async (jobId, updatedData) => {
    if (USE_MOCK_DATA) {
      setJobs((prevJobs) =>
        prevJobs.map((j) => (j.id === jobId ? { ...j, ...updatedData } : j))
      );
      return;
    }

    const payload = {
      title: updatedData.title,
      company: updatedData.company || employerProfile.companyName,
      location: updatedData.location || employerProfile.city || 'Bangalore',
      salary: updatedData.salary,
      min_salary: updatedData.minSalary?.toString() || null,
      type: updatedData.type || 'Full-time',
      category: updatedData.category,
      description: updatedData.description || '',
      requirements: updatedData.requirements || '',
      is_urgent: updatedData.isUrgent || false,
      is_featured: updatedData.isFeatured || false,
      employer_id: employerProfile.id || null,
      status: updatedData.status || 'Active'
    };

    try {
      const response = await fetch(`http://localhost:8000/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const job = await response.json();
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            j.id === jobId
              ? {
                  ...j,
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
                  whatsappMessage: updatedData.whatsappMessage || j.whatsappMessage
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
      setJobs((prevJobs) => prevJobs.filter((j) => j.id !== jobId));
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/jobs/${jobId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setJobs((prevJobs) => prevJobs.filter((j) => j.id !== jobId));
      }
    } catch (err) {
      console.error('Error deleting job via API:', err);
    }
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
      await fetch(`http://localhost:8000/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      employer_id: job.employer_id || employerProfile.id || null,
      status: job.status || 'Active'
    };

    try {
      await fetch(`http://localhost:8000/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      employer_id: job.employer_id || employerProfile.id || null,
      status: job.status || 'Active'
    };

    try {
      await fetch(`http://localhost:8000/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
      status: job.status || 'Active',
      views_count: nextViews.toString(),
      applications_count: job.applicantsCount?.toString() || '0'
    };

    try {
      await fetch(`http://localhost:8000/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
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
  };

  const updateEmployerProfile = (updatedProfile) => {
    setEmployerProfile((prev) => ({ ...prev, ...updatedProfile }));
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

  return (
    <JobContext.Provider
      value={{
        jobs,
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
        getAnalytics
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
