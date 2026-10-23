import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Trophy, 
  Users, 
  ArrowRight, 
  BookCheck, 
  CheckCircle2, 
  HeartHandshake, 
  Library, 
  ShieldCheck, 
  Sparkles,
  MapPin
} from 'lucide-react';
import { getPublicPageContent } from '../services/api';

const DEFAULT_HOME_CONTENT = {
  heroHeadline: 'Second Chances for Everyone & Everything.',
  heroSubtext: 'Roshan Safha is dedicated to restoring books, igniting creative minds through essay competitions, and driving community literacy across Muzaffarabad and beyond.',
  impactBooks: '1,450+',
  impactStudents: '3,800+',
  impactSchools: '52+'
};

function HomePage() {
  const [content, setContent] = useState(DEFAULT_HOME_CONTENT);

  useEffect(() => {
    const fetchCmsData = async () => {
      try {
        const res = await getPublicPageContent('home');
        if (res.data?.success && res.data?.content && Object.keys(res.data.content).length > 0) {
          setContent((prev) => ({
            ...prev,
            ...res.data.content
          }));
        }
      } catch (err) {
        console.warn('Using default Home CMS content fallback');
      }
    };
    fetchCmsData();
  }, []);

  return (
    <div className="min-h-screen bg-[#FBFBFA] text-stone-900 space-y-20 sm:space-y-28 pb-24 font-sans selection:bg-[#E8A94A]/30">
      
      {/* 1. Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-7">
        


        {/* Dynamic Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-stone-950 leading-[1.12]">
          {content.heroHeadline.includes('&') ? (
            <>
              {content.heroHeadline.split('&')[0]} & <br className="hidden sm:inline" />
              <span className="text-emerald-800">
                {content.heroHeadline.split('&')[1]}
              </span>
            </>
          ) : (
            <span>{content.heroHeadline}</span>
          )}
        </h1>

        {/* Dynamic Mission Narrative */}
        <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
          {content.heroSubtext}
        </p>

        {/* Streamlined, Two-Button CTA (Clean, No Button Clutter) */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          
          <Link
            to="/programs/donate-books"
            className="flex items-center gap-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-7 py-3.5 rounded-full text-xs sm:text-sm shadow-sm hover:shadow-md transition active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            <span>Donate Books</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
          </Link>

          <Link
            to="/programs/essays"
            className="flex items-center gap-2.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold px-7 py-3.5 rounded-full text-xs sm:text-sm shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-[#E8A94A]" />
            <span>Annual Essay Contests</span>
          </Link>

        </div>

        {/* Trust Badges */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-semibold text-stone-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Free Community Circulation</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Physical Reading Hub</span>
          </div>
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-[#E8A94A]" />
            <span>100% Volunteer Driven</span>
          </div>
        </div>

      </section>

      {/* 2. Impact Counters (Muted Warm Stone Cards, Not Pure White) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          
          {/* Stat 1: Books */}
          <div className="bg-white border border-stone-200/90 p-8 rounded-3xl shadow-xs hover:shadow-md transition-all space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
              Resource Circulation
            </span>
            <div className="text-4xl sm:text-5xl font-black text-emerald-800 tracking-tight pt-1">
              {content.impactBooks}
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Books Restored & Rebound
            </p>
            <p className="text-xs text-stone-600 leading-relaxed pt-1">
              Salvaged curriculum and literature delivered freely to students across AJK.
            </p>
          </div>

          {/* Stat 2: Students */}
          <div className="bg-white border border-stone-200/90 p-8 rounded-3xl shadow-xs hover:shadow-md transition-all space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-50 px-2.5 py-1 rounded-md">
              Youth Engagement
            </span>
            <div className="text-4xl sm:text-5xl font-black text-amber-700 tracking-tight pt-1">
              {content.impactStudents}
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Students Reached & Supported
            </p>
            <p className="text-xs text-stone-600 leading-relaxed pt-1">
              Participating in essay competitions, reading hubs, and learning circles.
            </p>
          </div>

          {/* Stat 3: Schools */}
          <div className="bg-white border border-stone-200/90 p-8 rounded-3xl shadow-xs hover:shadow-md transition-all space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-stone-800 bg-stone-100 px-2.5 py-1 rounded-md">
              Institutional Network
            </span>
            <div className="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight pt-1">
              {content.impactSchools}
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Partner Schools & Colleges
            </p>
            <p className="text-xs text-stone-600 leading-relaxed pt-1">
              Colleges and secondary academies hosting drop boxes and reading centers.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Core Program Pillars */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-black uppercase tracking-wider text-[#E8A94A]">What We Do</span>
          <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
            Empowering Grassroots Literacy
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            A sustainable model to salvage educational volumes, foster creative writing, and build local community libraries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Pillar 1 */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                <BookCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 leading-snug">
                Textbook Recycling & Repair
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Collecting used Matric, Intermediate, and university textbooks, professionally rebinding damaged volumes, and distributing them to low-income students.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <Link 
                to="/programs/book-catalog" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:gap-2 transition-all"
              >
                <span>Browse Restored Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#E8A94A] flex items-center justify-center font-bold">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-stone-900 leading-snug">
                Annual Creative Writing Contests
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Sparking critical reasoning, independent thought, and literacy among youth across Azad Kashmir through structured essay competitions and laureates.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <Link 
                to="/programs/essays" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:gap-2 transition-all"
              >
                <span>View Guidelines & Topics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-3xl border border-stone-200/90 p-8 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6 text-emerald-800" />
              </div>
              <h3 className="text-base font-bold text-stone-900 leading-snug">
                SDGs Youth Summer Circle
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Interactive learning circles centered on environmental stewardship, United Nations SDGs, and peer-to-peer educational mentorship.
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <Link 
                to="/programs/summer-circle" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-800 hover:gap-2 transition-all"
              >
                <span>Explore Summer Circle</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Volunteer CTA Banner (Clean Dark Card, No Out-of-place Pills) */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 border border-stone-800 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-sm">
          <div className="space-y-2 text-center lg:text-left max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Become a Roshan Safha Youth Ambassador
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Help us collect, sort, bind, and circulate books to underserved students. Your hours make a direct impact on grassroots literacy across Azad Kashmir.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <Link
              to="/get-involved"
              className="bg-[#E8A94A] hover:bg-[#d99839] text-stone-950 font-bold px-6 py-3 rounded-full text-xs shadow-xs transition active:scale-95 text-center cursor-pointer"
            >
              Register as Volunteer
            </Link>
            <Link
              to="/contact"
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold px-6 py-3 rounded-full text-xs border border-stone-700 transition active:scale-95 text-center cursor-pointer"
            >
              Contact Team
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

export default HomePage;