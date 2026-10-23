import React, { useState, useEffect } from 'react';
import { Compass, Target, Eye, Sparkles, HeartHandshake, BookOpen } from 'lucide-react';
import { getPublicPageContent } from '../services/api';

const DEFAULT_ABOUT_CONTENT = {
  heroTitle: 'Rooted in Local Literacy and Action',
  missionBody: 'To bridge book accessibility disparities across regional communities by restoring textbooks, creating sustainable local mini-libraries, and supporting student literacy across Azad Jammu and Kashmir.',
  visionStatement: 'A sustainable network of restored community reading libraries where every curious child, student, and educator has immediate access to rich, mind-expanding literature.'
};

function AboutPage() {
  const [content, setContent] = useState(DEFAULT_ABOUT_CONTENT);

  useEffect(() => {
    const fetchAboutCms = async () => {
      try {
        const res = await getPublicPageContent('about');
        if (res.data?.success && res.data?.content && Object.keys(res.data.content).length > 0) {
          setContent((prev) => ({
            ...prev,
            ...res.data.content
          }));
        }
      } catch (err) {
        console.warn('Using default About CMS content');
      }
    };
    fetchAboutCms();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans space-y-16">
      
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-2xs">
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          <span>Our Story & Guiding Principles</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {content.heroTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Founded with a clear belief: no valuable book should be thrown away, and no eager reader should be left without access to learning.
        </p>
      </section>

      {/* Mission & Vision Cards */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Mission Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Our Mission</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {content.missionBody}
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-800">
            <HeartHandshake className="w-4 h-4" /> Community-Powered Literacy
          </div>
        </div>

        {/* Vision Card */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#E8A94A] flex items-center justify-center font-black">
              <Eye className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">Our Vision</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {content.visionStatement}
            </p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-amber-800">
            <Sparkles className="w-4 h-4 text-[#E8A94A]" /> A Brighter Academic Future
          </div>
        </div>

      </section>

      {/* Core Values Strip */}
      <section className="max-w-6xl mx-auto bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-white">The Values We Stand By</h3>
          <p className="text-xs text-slate-400">Integrity, volunteer transparency, and resource stewardship guide every book collected and repaired.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 text-center">
          <div className="space-y-2">
            <span className="text-2xl font-black text-[#E8A94A]">100% Free</span>
            <p className="text-xs text-slate-300">Books are lent or gifted without any rental fees or charges to regional students.</p>
          </div>
          <div className="space-y-2 border-y sm:border-y-0 sm:border-x border-slate-800 py-4 sm:py-0">
            <span className="text-2xl font-black text-emerald-400">Zero Waste</span>
            <p className="text-xs text-slate-300">Damaged bindings are reinforced and rebound rather than discarded into paper mills.</p>
          </div>
          <div className="space-y-2">
            <span className="text-2xl font-black text-teal-400">Civic Youth</span>
            <p className="text-xs text-slate-300">Volunteer sorting drives give secondary students practical community responsibility.</p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default AboutPage;