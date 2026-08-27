import React, { useState } from 'react';
import VolunteerForm from '../components/forms/VolunteerForm';
import CollaborationForm from '../components/forms/CollaborationForm';
import { Users, HeartHandshake, BookOpen, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

function GetInvolvedPage() {
  const [activeTab, setActiveTab] = useState('volunteer');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Join the Movement
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Get Involved with Roshan Safha
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Whether you want to offer on-ground volunteer hours, sponsor literary drives, or partner as an academic institution, there is a place for you.
        </p>
      </div>

      {/* Quick Links Banner */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link 
          to="/programs/donations" 
          className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 p-5 rounded-2xl flex items-center gap-4 transition group"
        >
          <div className="p-3 bg-emerald-600 text-white rounded-xl group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Have books to donate?</h4>
            <p className="text-xs text-slate-500">Pledge syllabus and storybooks directly &rarr;</p>
          </div>
        </Link>

        <Link 
          to="/programs/essays" 
          className="bg-blue-50 hover:bg-blue-100 border border-blue-200 p-5 rounded-2xl flex items-center gap-4 transition group"
        >
          <div className="p-3 bg-blue-600 text-white rounded-xl group-hover:scale-105 transition-transform">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Participate in Essay Contests</h4>
            <p className="text-xs text-slate-500">Junior & Senior writing competition portal &rarr;</p>
          </div>
        </Link>
      </div>

      {/* Switcher & Form Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex border-b border-slate-200 pb-4 gap-4">
          <button
            onClick={() => setActiveTab('volunteer')}
            className={`flex items-center gap-2 pb-2 text-sm font-bold transition border-b-2 -mb-[18px] ${
              activeTab === 'volunteer' 
                ? 'border-emerald-600 text-emerald-600' 
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Users className="w-4 h-4" /> Volunteer Sign-Up
          </button>
          <button
            onClick={() => setActiveTab('collab')}
            className={`flex items-center gap-2 pb-2 text-sm font-bold transition border-b-2 -mb-[18px] ${
              activeTab === 'collab' 
                ? 'border-emerald-600 text-emerald-600' 
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <HeartHandshake className="w-4 h-4" /> Institutional Partnership
          </button>
        </div>

        <div className="pt-2">
          {activeTab === 'volunteer' ? <VolunteerForm /> : <CollaborationForm />}
        </div>
      </div>

    </div>
  );
}

export default GetInvolvedPage;