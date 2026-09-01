import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Trophy, Users, Sparkles, ArrowRight, BookCheck } from 'lucide-react';

function HomePage() {
  return (
    <div className="min-h-screen relative overflow-hidden space-y-16 sm:space-y-24 pb-20">
      
      {/* 1. Ambient Green Glow Top Shadow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-emerald-100/80 via-emerald-50/40 to-transparent blur-3xl rounded-full"></div>
      </div>

      {/* 2. Hero Section */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-6">
        
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200/80 px-4 py-1.5 rounded-full text-xs font-bold shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Empowering Youth & Literacy in Azad Kashmir</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 leading-tight">
          Second Chances for <br className="hidden sm:inline" />
          <span className="text-emerald-700">Everyone & Everything</span>
        </h1>

        {/* Subtext Quote */}
        <p className="text-base sm:text-lg text-slate-600 font-medium max-w-2xl mx-auto italic leading-relaxed">
          "Roshan Safha is dedicated to restoring books, igniting creative minds through essay competitions, and driving community literacy across Muzaffarabad and beyond."
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to="/programs/donate-books"
            className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-sm hover:shadow-md transition active:scale-95 cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            Donate Books
          </Link>

          <Link
            to="/programs/essays"
            className="flex items-center gap-2 bg-slate-950 hover:bg-slate-800 text-[#E8A94A] font-extrabold px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-sm hover:shadow-md transition active:scale-95 border border-slate-900 cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-[#E8A94A]" />
            Contest 2026
          </Link>

          <Link
            to="/get-involved"
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm border border-slate-200 shadow-2xs transition active:scale-95 cursor-pointer"
          >
            <Users className="w-4 h-4 text-emerald-700" />
            Volunteer
          </Link>

          <Link
            to="/gallery"
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-3.5 rounded-2xl text-xs sm:text-sm transition active:scale-95 cursor-pointer"
          >
            View Gallery
          </Link>
        </div>

      </section>

      {/* 3. Impact Counters */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white border border-slate-200/80 p-8 rounded-3xl shadow-xs">
          
          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-700">1,450+</div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Books Restored & Distributed</p>
          </div>

          <div className="text-center space-y-1 border-y sm:border-y-0 sm:border-x border-slate-200 py-4 sm:py-0">
            <div className="text-3xl sm:text-4xl font-black text-[#E8A94A]">3,800+</div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Students Supported</p>
          </div>

          <div className="text-center space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-900">52+</div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Partner Schools & Colleges</p>
          </div>

        </div>
      </section>

      {/* 4. Core Program Highlights */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-extrabold uppercase text-[#E8A94A] tracking-wider">What We Do</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Empowering Grassroots Education</h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Our multi-pronged approach ensures educational materials find their way to deserving students while fostering creative writing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 hover:border-slate-300 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <BookCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Textbook Recycling & Repair</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Collecting used Matric, Intermediate, and general curriculum books, professionally rebinding them, and making them freely available in our Muzaffarabad hub.
              </p>
            </div>
            <Link to="/programs/book-catalog" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 hover:gap-2 transition">
              Browse Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 hover:border-slate-300 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#E8A94A] flex items-center justify-center font-bold">
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Annual Essay Contests</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Igniting critical thinking and literacy among junior and senior students across Azad Kashmir with prizes, shields, and publication awards.
              </p>
            </div>
            <Link to="/programs/essays" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-700 hover:gap-2 transition">
              View Guidelines <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 hover:border-slate-300 transition flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">SDGs Summer Circle</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Interactive youth learning circles centered on environmental stewardship, United Nations SDGs, and peer-led book discussion groups.
              </p>
            </div>
            <Link to="/programs/summer-circle" className="inline-flex items-center gap-1.5 text-xs font-extrabold text-blue-700 hover:gap-2 transition">
              Explore Circle <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
}

export default HomePage;