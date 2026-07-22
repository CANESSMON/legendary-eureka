import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockJobs } from '../data/mockJobs';

const JobContext = createContext();

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('jobportal_jobs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map(j => ({
          ...j,
          whatsappMessage: (j.whatsappMessage || '')
            .replace(/\[Job Title\]/gi, j.title)
            .replace(/\{Job Title\}/gi, j.title)
            .replace(/\[title\]/gi, j.title)
            .replace(/\{title\}/gi, j.title)
        }));
      } catch (e) {
        console.error('Failed to parse saved jobs', e);
      }
    }

    // Enrich mockJobs with stats, badges, status, and whatsapp contact details
    return mockJobs.map((job, index) => ({
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
      requirements: job.requirements || 'Key Skills: Communication, Problem Solving, Domain Expertise',
      applicants: job.applicants || [
        {
          id: `app-1-${job.id}`,
          name: 'Ananya Sharma',
          email: 'ananya.s@example.com',
          appliedDate: '2 hours ago',
          experience: '4 years',
          status: 'Direct WhatsApp Contact',
          resumeUrl: '#'
        },
        {
          id: `app-2-${job.id}`,
          name: 'Rohan Verma',
          email: 'rohan.v@example.com',
          appliedDate: '1 day ago',
          experience: '2 years',
          status: 'Direct WhatsApp Contact',
          resumeUrl: '#'
        }
      ]
    }));
  });

  const [employerProfile, setEmployerProfile] = useState(() => {
    const saved = localStorage.getItem('jobportal_employer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      fullName: 'Rajesh Sharma',
      companyName: 'TECH SOLUTIONS',
      industry: 'Information Technology',
      logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=150&auto=format&fit=crop&q=80',
      establishmentYear: '2016',
      city: 'Bangalore',
      address: 'Plot 42, Electronic City Phase 1, Bangalore, Karnataka - 560100',
      whatsappNumber: '+919876543210',
      defaultMessage: 'Hi, I saw your post for {title} on JobPortal. I am interested in applying and would like to connect!',
      verified: true
    };
  });

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('jobportal_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('jobportal_employer_profile', JSON.stringify(employerProfile));
  }, [employerProfile]);

  // Actions
  const addJob = (newJobData) => {
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
  };

  const updateJob = (jobId, updatedData) => {
    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.id === jobId ? { ...j, ...updatedData } : j))
    );
  };

  const deleteJob = (jobId) => {
    setJobs((prevJobs) => prevJobs.filter((j) => j.id !== jobId));
  };

  const toggleJobStatus = (jobId) => {
    setJobs((prevJobs) =>
      prevJobs.map((j) => {
        if (j.id === jobId) {
          const nextStatus = j.status === 'Active' ? 'Paused' : 'Active';
          return { ...j, status: nextStatus };
        }
        return j;
      })
    );
  };

  const toggleUrgentBadge = (jobId) => {
    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.id === jobId ? { ...j, isUrgent: !j.isUrgent } : j))
    );
  };

  const toggleFeaturedBadge = (jobId) => {
    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.id === jobId ? { ...j, isFeatured: !j.isFeatured } : j))
    );
  };

  const incrementJobViews = (jobId) => {
    setJobs((prevJobs) =>
      prevJobs.map((j) => (j.id === jobId ? { ...j, views: (j.views || 0) + 1 } : j))
    );
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
