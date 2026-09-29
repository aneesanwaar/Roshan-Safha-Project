import React, { useState } from 'react';
import { Sparkles, Users, BookOpen, CheckCircle2, MapPin, Calendar } from 'lucide-react';
import EventForm from "../../components/forms/EventForm";

function SummerCirclePage() {
  const [registered, setRegistered] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header */}
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

        {/* Pillars Grid */}
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

          {/* Registration Box using EventForm */}
          <div className="bg-white rounded-2xl p-5 text-slate-900 shadow-md">
            {registered ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-sm text-slate-900">Registration Confirmed!</h3>
                <p className="text-xs text-slate-600">
                  We have sent confirmation details to your email address and will reach out with schedule reminders.
                </p>
                <button
                  type="button"
                  onClick={() => setRegistered(false)}
                  className="text-xs text-emerald-600 font-bold hover:underline pt-2 inline-block cursor-pointer"
                >
                  Register another attendee
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900">
                    Reserve a Free Seat
                  </h3>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                    100% Free
                  </span>
                </div>

                <EventForm 
                  defaultEventName="SDGs Summer Circle 2026" 
                  onSuccess={() => setRegistered(true)} 
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default SummerCirclePage;