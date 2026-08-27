import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
  BookOpen, 
  Award, 
  Users, 
  ArrowRight, 
  Sparkles, 
  BookCheck, 
  GraduationCap, 
  Trophy, 
  Heart,
  Calendar,
  ChevronRight
} from 'lucide-react';

function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  );
}

function Home() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const loadRecentUpdates = async () => {
      try {
        const data = await api.getAnnouncements();
        setAnnouncements(data.slice(0, 3));
      } catch (err) {
        console.error("Error loading updates:", err);
      }
    };
    loadRecentUpdates();
  }, []);

  const impactStats = [
    { label: "Books Donated & Restored", value: "1,250+", icon: BookCheck, color: "text-emerald-600 bg-emerald-50" },
    { label: "Children & Youth Reached", value: "3,400+", icon: GraduationCap, color: "text-blue-600 bg-blue-50" },
    { label: "Contests & Workshops Held", value: "18+", icon: Trophy, color: "text-amber-600 bg-amber-50" },
    { label: "Active Volunteers Network", value: "120+", icon: Heart, color: "text-rose-600 bg-rose-50" },
  ];

  const instaPosts = [
    { id: 1, img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80", caption: "Community Book Drive in Muzaffarabad!" },
    { id: 2, img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80", caption: "Youth Creative Writing Workshop underway ✍️" },
    { id: 3, img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80", caption: "Restoring damaged books for local school libraries 📚" },
    { id: 4, img: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80", caption: "Prize distribution ceremony for our junior writers 🎉" },
    { id: 5, img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80", caption: "Class-wise books catalog ready for distribution." },
    { id: 6, img: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80", caption: "Second chances for books, second chances for dreams ✨" },
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50/80 via-white to-slate-50 pt-20 pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full text-xs font-bold text-brand-800 border border-brand-200 shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-600" />
            Empowering Youth & Literacy in Azad Kashmir
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-tight">
            Second Chances for <br className="hidden sm:block" />
            <span className="text-brand-600">Everyone & Everything.</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed italic">
            “Roshan Safha is dedicated to restoring books, igniting creative minds through essay competitions, and driving community literacy across Muzaffarabad and beyond.”
          </p>

{/* 4 Main Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-6">
            
            {/* 1. Primary Green - Donate Books */}
            <Link 
              to="/programs/donations" 
              className="group inline-flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-bold px-6 py-3.5 rounded-2xl shadow-md shadow-emerald-600/20 hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-200"
            >
              <BookOpen className="w-4 h-4 group-hover:rotate-6 transition-transform" />
              <span>Donate Books</span>
            </Link>

            {/* 2. Slate/Navy Dark - Register for Contest */}
            <Link 
              to="/programs/essays" 
              className="group inline-flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-sm font-bold px-6 py-3.5 rounded-2xl shadow-md shadow-slate-900/20 hover:shadow-lg hover:shadow-slate-900/30 transition-all duration-200"
            >
              <Award className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Register for Contest</span>
            </Link>

            {/* 3. Subtle Clean Outline - Volunteer */}
            <Link 
              to="/get-involved" 
              className="group inline-flex items-center gap-2.5 bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 hover:text-emerald-700 text-sm font-bold px-5 py-3.5 rounded-2xl border border-slate-300 hover:border-emerald-300 shadow-sm transition-all duration-200"
            >
              <Users className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>Volunteer</span>
            </Link>

            {/* 4. Minimal - View Gallery */}
            <Link 
              to="/gallery" 
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 text-sm font-bold px-5 py-3.5 rounded-2xl transition-all duration-200"
            >
              <span>View Gallery</span>
            </Link>

          </div>

        </div>
      </section>

      {/* 2. EDITABLE IMPACT STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Our On-Ground Impact</h2>
            <p className="text-xs sm:text-sm text-slate-500">Measurable grassroots change created through community collaboration.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {impactStats.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                <div className={`p-3.5 rounded-2xl ${item.color}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight block">{item.value}</span>
                  <span className="text-xs font-semibold text-slate-500 mt-1 block">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED ACTIVE CONTEST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl">
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold border border-amber-400/30">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> Active Writing Contest
              </div>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
                Annual Youth Creative Essay Competition
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Open for Junior (Under 16) and Senior (16+) students. Express your literary voice, win certificates, prizes, and get featured in Roshan Safha publications.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link 
                  to="/programs/essays" 
                  className="bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition flex items-center gap-2 shadow-lg"
                >
                  Submit Your Essay Now <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-slate-400 font-medium">Deadline: Ongoing 2026</span>
              </div>
            </div>

            <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/60 p-6 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Contest Highlights</h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-[10px] shrink-0">1</span>
                  <span><strong>Junior Category:</strong> Age under 16 • Theme: <em>Books in My Life</em></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-[10px] shrink-0">2</span>
                  <span><strong>Senior Category:</strong> Age 16+ • Theme: <em>The Role of Youth in Literacy</em></span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-[10px] shrink-0">3</span>
                  <span><strong>Acceptance:</strong> PDF / Word document with online verification.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. RECENT ANNOUNCEMENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Recent Announcements</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Official updates, winner lists, and upcoming activities.</p>
          </div>
          <Link to="/announcements" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            View All Updates <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {announcements.map((item) => (
            <article key={item._id} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
              {item.imageUrl && (
                <div className="aspect-[16/10] bg-slate-100 overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-brand-600" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-2">{item.title}</h3>
                  <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">{item.content}</p>
                </div>
                <Link to="/announcements" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 pt-2">
                  Read Full Notice <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. INSTAGRAM FEED EMBED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-pink-600 text-xs font-bold">
            <InstagramIcon className="w-4 h-4" /> @roshansafha
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Follow Our Community Stories</h2>
          <p className="text-xs text-slate-500">Live moments from our collection centers, school visits, and donation drives.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {instaPosts.map((post) => (
            <div key={post.id} className="group relative rounded-2xl overflow-hidden aspect-square bg-slate-100 border border-slate-200 shadow-sm cursor-pointer">
              <img src={post.img} alt={post.caption} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
              <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
                <p className="text-white text-[11px] font-medium leading-snug line-clamp-3">{post.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

export default Home;