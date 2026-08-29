import React, { useState } from 'react';
import { Sparkles, Users, BookOpen, CheckCircle2, MapPin, Calendar, Send } from 'lucide-react';

function SummerCirclePage() {
  const [registered, setRegistered] = useState(false);
  const [participant, setParticipant] = useState({
    parentName: '',
    studentName: '',
    ageGroup: '7-11 Years (Elementary)',
    phone: '',
    selectedSession: 'Batch A (July 5 - July 15)'
  });

  const pillars = [
    {
      icon: <BookOpen className="w-5 h-5 text-emerald-600" />,
      title: 'SDG 4: Quality Literacy',
      desc: 'Interactive Urdu & English story circles designed to spark imagination and reading confidence.'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-amber-600" />,
      title: 'Book Upcycling Clinics',
      desc: 'Hands-on practical sessions teaching youth the craft of binding and caring for pre-loved books.'
    },
    {
      icon: <Users className="w-5 h-5 text-blue-600" />,
      title: 'Community Swap Meets',
      desc: 'Neighborhood book exchange fairs where children experience circular sharing firsthand.'
    }
  ];

  const handleRegister = (e) => {
    e.preventDefault();
    setRegistered(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Harmonized Header Matching Donate Books */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full">
            <span>🌱</span>
            <span>Community Sustainability & Hands-on Workshops</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            SDGs-Based Summer Circle & Workshops
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Engaging children and youth through interactive storytelling, book repair clinics, and environmental literacy aligned with UN Sustainable Development Goals.
          </p>
        </div>

        {/* Guidelines / Pillars Grid (Matching Donate Books 3-Card Header) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {pillars.map((p, idx) => (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start gap-3">
              <div className="p-2.5 bg-slate-50 rounded-xl shrink-0 border border-slate-100">
                {p.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{p.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Schedule & Registration Section */}
        <div className="bg-linear-to-br from-emerald-800 to-teal-900 rounded-3xl text-white p-6 sm:p-10 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200 bg-white/10 px-2.5 py-1 rounded-md">
              Summer 2026 Cohorts
            </span>
            <h2 className="text-2xl font-bold leading-snug">
              10-Day Experiential Workshop
            </h2>
            <p className="text-xs text-emerald-100 leading-relaxed">
              Every morning filled with critical thinking, restoration arts, and storytelling. Free learning kits and certificates provided.
            </p>

            <div className="space-y-1.5 text-xs pt-1 text-emerald-50">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>Secretariat Road Center, Muzaffarabad</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span>Batch A: July 5 – 15 | Batch B: July 20 – 30</span>
              </div>
            </div>
          </div>

          {/* Registration Box */}
          <div className="bg-white rounded-2xl p-5 text-slate-900 shadow-md">
            {registered ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-sm text-slate-900">Seat Reserved!</h3>
                <p className="text-xs text-slate-600">We will message you on WhatsApp with schedule details.</p>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-3">
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 border-b border-slate-100 pb-2">
                  Reserve a Free Seat
                </h3>
                
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Guardian Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rashid Khan"
                    value={participant.parentName}
                    onChange={e => setParticipant({ ...participant, parentName: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Student / Child Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ali Rashid"
                    value={participant.studentName}
                    onChange={e => setParticipant({ ...participant, studentName: e.target.value })}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">Age Group</label>
                    <select
                      value={participant.ageGroup}
                      onChange={e => setParticipant({ ...participant, ageGroup: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none"
                    >
                      <option value="7-11 Years (Elementary)">7-11 Years</option>
                      <option value="12-16 Years (Middle/High)">12-16 Years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-700 mb-0.5">WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      placeholder="0300 1234567"
                      value={participant.phone}
                      onChange={e => setParticipant({ ...participant, phone: e.target.value })}
                      className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs shadow-sm transition mt-1 cursor-pointer"
                >
                  Confirm Registration
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default SummerCirclePage;