import React from 'react';
import { Search, Briefcase } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-16 mb-24 animate-fade-in">
          <div className="flex-1">
            <p className="text-primary font-bold tracking-widest text-sm mb-4">The Pulse of Progress</p>
            <h1 className="mb-6 leading-tight">
              Bridging the gap between India's finest talent and industry leaders.
            </h1>
            <p className="body-text text-slate-600 max-w-lg leading-relaxed">
              JobPortal India is more than a job board; it's a structural engine for the modern workforce. We combine the industrious spirit of traditional corporate values with the velocity of a neo-brutalist digital edge.
            </p>
          </div>
          <div className="flex-1 relative">
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary z-0"></div>
            <img
              src="/office.png"
              alt="Office environment"
              className="relative z-10 w-full rounded-lg shadow-xl object-cover h-[400px]"
            />
          </div>
        </div>

        {/* Mission Section */}
        <div className="text-center mb-24 animate-fade-in [animation-delay:100ms]">
          <h2 className="mb-8">Our Mission</h2>
          <div className="relative max-w-4xl mx-auto p-10 border border-dashed border-slate-300 rounded-lg bg-slate-50">
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-white px-4 text-primary text-4xl font-serif leading-none font-bold">
              "
            </div>
            <p className="body-text text-xl italic font-medium text-slate-800">
              To organize India's professional landscape through clarity, speed, and structural integrity, ensuring every industrious individual finds their place in the gears of progress.
            </p>
          </div>
        </div>

        {/* How It Works Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24 animate-fade-in [animation-delay:200ms]">
          {/* Job Seekers Card */}
          <div className="border border-slate-200 p-10 rounded-xl bg-white flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-indigo-50 text-primary rounded-lg flex items-center justify-center mb-6">
              <Search size={28} />
            </div>
            <h3 className="mb-6">How Job Seekers Can Search</h3>
            <ul className="space-y-6 mb-10 flex-1">
              <li className="flex gap-4">
                <span className="text-primary font-bold">01.</span>
                <span className="body-text text-slate-600 text-sm leading-relaxed">Utilize our high-density search grid to filter by industry, experience, and specific regional divisions.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-bold">02.</span>
                <span className="body-text text-slate-600 text-sm leading-relaxed">Create detailed professional profiles that mirror the clarity of a traditional executive summary.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-primary font-bold">03.</span>
                <span className="body-text text-slate-600 text-sm leading-relaxed">Receive instant notifications for listings that match your industrious skill set.</span>
              </li>
            </ul>
            <button className="w-full py-4 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors rounded-lg">
              Find Jobs Now
            </button>
          </div>

          {/* Employers Card */}
          <div className="bg-slate-900 text-white p-10 rounded-xl flex flex-col h-full shadow-xl">
            <div className="w-14 h-14 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-6">
              <Briefcase size={28} />
            </div>
            <h3 className="mb-6 text-white">How Employers Can Post</h3>
            <ul className="space-y-6 mb-10 flex-1">
              <li className="flex gap-4">
                <span className="text-blue-400 font-bold">01.</span>
                <span className="body-text text-slate-300 text-sm leading-relaxed">Access the Admin Panel to post high-precision job descriptions within minutes.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-blue-400 font-bold">02.</span>
                <span className="body-text text-slate-300 text-sm leading-relaxed">Manage listings using our column-rich inspired dashboard for maximum information density.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-blue-400 font-bold">03.</span>
                <span className="body-text text-slate-300 text-sm leading-relaxed">Screen applications through a centralized pipeline optimized for rapid decision-making.</span>
              </li>
            </ul>
            <button className="w-full py-4 bg-blue-500 hover:bg-blue-600 transition-colors text-white rounded-lg">
              Post a Position
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in [animation-delay:300ms]">
          <div className="border border-slate-200 p-8 rounded-xl text-center bg-white shadow-sm">
            <h2 className="text-primary mb-1">50k+</h2>
            <p className="text-slate-500 text-xs font-bold tracking-wider">Active Seekers</p>
          </div>
          <div className="border border-slate-200 p-8 rounded-xl text-center bg-white shadow-sm">
            <h2 className="text-primary mb-1">1.2k+</h2>
            <p className="text-slate-500 text-xs font-bold tracking-wider">Top Employers</p>
          </div>
          <div className="border border-slate-200 p-8 rounded-xl text-center bg-white shadow-sm">
            <h2 className="text-primary mb-1">150+</h2>
            <p className="text-slate-500 text-xs font-bold tracking-wider">Daily Postings</p>
          </div>
          <div className="border border-slate-200 p-8 rounded-xl text-center bg-white shadow-sm">
            <h2 className="text-primary mb-1">24h</h2>
            <p className="text-slate-500 text-xs font-bold tracking-wider">Avg. Response</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
