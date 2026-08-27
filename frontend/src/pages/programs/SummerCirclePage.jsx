import React from 'react';
import EventForm from '../../components/forms/EventForm';
import { Calendar, Globe2, Sparkles, Users } from 'lucide-react';

function SummerCirclePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
          Program 03 • Experiential Learning
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          SDGs-Based Summer Circle & Workshops
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          Engaging children and youth through interactive storytelling, book repair clinics, and environmental literacy aligned with UN Sustainable Development Goals.
        </p>
      </div>

      {/* Workshop Formats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-sm">
          <Globe2 className="w-8 h-8 text-brand-600" />
          <h3 className="font-bold text-slate-900">SDG 4: Quality Education</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Reading circles designed to spark curiosity, comprehension, and vocabulary among elementary learners.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-sm">
          <Sparkles className="w-8 h-8 text-amber-600" />
          <h3 className="font-bold text-slate-900">Book Upcycling Workshops</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Hands-on sessions teaching youth the craft of paper conservation, book repairing, and zero-waste care.</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-sm">
          <Users className="w-8 h-8 text-blue-600" />
          <h3 className="font-bold text-slate-900">Community Exchange Fairs</h3>
          <p className="text-xs text-slate-500 leading-relaxed">Open neighborhood book swap events where kids bring old books to exchange for new titles.</p>
        </div>
      </div>

      {/* Event Registration Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-600" />
            Register for Upcoming Workshops & Summer Circles
          </h2>
          <p className="text-xs text-slate-500 mt-1">Reserve seats for your children or students.</p>
        </div>
        <EventForm />
      </div>

    </div>
  );
}

export default SummerCirclePage;