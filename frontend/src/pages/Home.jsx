import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Award, Users, HeartHandshake, ArrowRight, Sparkles, CheckCircle } from 'lucide-react';

function Home() {
  const cards = [
    {
      title: "Annual Essay Contest",
      desc: "Junior and Senior writing competitions with certificate recognition, publication, and rewards.",
      icon: Award,
      link: "/forms?tab=essay",
      badge: "Open Now",
      color: "bg-amber-500",
      cta: "Submit Essay"
    },
    {
      title: "Book Donations",
      desc: "Pledge educational, literary, or reference books to enrich regional community reading drives.",
      icon: BookOpen,
      link: "/forms?tab=donations",
      badge: "Ongoing",
      color: "bg-emerald-600",
      cta: "Donate Books"
    },
    {
      title: "Volunteer Registration",
      desc: "Join our on-ground team to manage workshops, logistics, literacy drives, and event operations.",
      icon: Users,
      link: "/forms?tab=volunteers",
      badge: "Recruiting",
      color: "bg-blue-600",
      cta: "Join as Volunteer"
    },
    {
      title: "Institutional Partnerships",
      desc: "Collaborate with schools, colleges, and local organizations for literacy and skills workshops.",
      icon: HeartHandshake,
      link: "/forms?tab=collab",
      badge: "Partners",
      color: "bg-purple-600",
      cta: "Partner With Us"
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 py-20 px-4 sm:px-6 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-800 border border-brand-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            Empowering Youth Through Literary Development
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Nurturing Literacy & <span className="text-brand-600">Inspiring Youth</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Roshan Safha is dedicated to building strong educational foundations through active reading drives, creative writing competitions, and youth-led learning initiatives.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link 
              to="/forms?tab=essay" 
              className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl shadow-sm transition flex items-center gap-2 text-sm"
            >
              Submit to Essay Contest <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/forms" 
              className="bg-white hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl border border-slate-200 transition text-sm shadow-sm"
            >
              Explore Portals
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap justify-center items-center gap-6 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-brand-600" /> Verified Submissions</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-brand-600" /> Cloud Secure Storage</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-brand-600" /> Automated Confirmations</span>
          </div>
        </div>
      </section>

      {/* Core Programs Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Our Core Programs</h2>
          <p className="text-sm text-slate-500">Select a program below to apply, donate, or register directly.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c, i) => (
            <div 
              key={i} 
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-brand-300 transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-xl text-white ${c.color} shadow-sm`}>
                    <c.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md">
                    {c.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">{c.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{c.desc}</p>
              </div>

              <div className="pt-6">
                <Link 
                  to={c.link} 
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 px-4 rounded-lg bg-slate-50 hover:bg-brand-50 text-slate-700 hover:text-brand-700 border border-slate-200 hover:border-brand-200 transition"
                >
                  {c.cta} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;