import React from 'react';
import { BookOpen, Target, Globe, Award, Sparkles, MapPin, Calendar, Heart } from 'lucide-react';

function AboutPage() {
  const sdgs = [
    { number: "04", title: "Quality Education", desc: "Equipping underserved children with restored textbooks, literary guides, and educational access." },
    { number: "10", title: "Reduced Inequalities", desc: "Bridging the resource gap between urban centers and regional school districts across Azad Kashmir." },
    { number: "12", title: "Responsible Consumption", desc: "Promoting circular paper conservation by restoring damaged books instead of discarding them." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* 1. Header & Mission Summary */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-emerald-200">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Established in 2025 • Muzaffarabad, AJK
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Our Mission & Story
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          Roshan Safha was founded on a simple conviction: <em>second chances are for everyone and everything</em>. We transform worn, neglected books into catalysts of literacy and empower youth through creative self-expression.
        </p>
      </section>

      {/* 2. Founder Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" 
              alt="Aamna Saleem Khan - Founder" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:col-span-2 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
              Founder & Initiative Lead
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Aamna Saleem Khan</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              "Starting Roshan Safha in Muzaffarabad was rooted in the realization that thousands of books sit unused or lightly damaged in storerooms while eager young students lack access to basic syllabus materials and creative outlets. By pairing book restoration with annual writing competitions, we foster both educational equity and literary confidence".
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-emerald-600" /> Muzaffarabad, AJK, Pakistan</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-emerald-600" /> Founded 2025</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SDG Alignment */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">United Nations SDG Alignment</h2>
          <p className="text-xs text-slate-500">How our grassroots programs map directly to sustainable development goals.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {sdgs.map((sdg, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-sm hover:border-emerald-300 transition">
              <span className="text-3xl font-black text-emerald-600">SDG {sdg.number}</span>
              <h3 className="text-lg font-bold text-slate-900">{sdg.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{sdg.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default AboutPage;