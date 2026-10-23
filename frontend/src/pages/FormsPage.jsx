import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import EssayForm from '../components/forms/EssayForm';
import DonationForm from '../components/forms/DonationForm';
import VolunteerForm from '../components/forms/VolunteerForm';
import ContactForm from '../components/forms/ContactForm';
import EventForm from '../components/forms/EventForm';
import CollaborationForm from '../components/forms/CollaborationForm';
import { 
  Award, 
  BookOpen, 
  Users, 
  Mail, 
  Calendar, 
  HeartHandshake, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Info 
} from 'lucide-react';
import { getPublicPageContent } from '../services/api';

function FormsPage() {
  const [params, setParams] = useSearchParams();
  const currentTab = params.get('tab') || 'essay';

  // CMS Content State Stores
  const [cmsContent, setCmsContent] = useState({
    programs: {
      donationHeading: 'Book Drive & Circulation Cycle',
      donationRules: 'Accepting academic course books, fiction, history, and general reference volumes.'
    },
    getInvolved: {
      volunteerPitch: 'Join our local teams in sorting, binding, cataloging, and dispatching books.',
      partnerPitch: 'Collaborate with educational institutions to set up local drop boxes.'
    },
    contact: {
      hubAddress: 'Roshan Safha Reading Hub, Muzaffarabad, AJK',
      whatsapp: '+92 300 1234567'
    }
  });

  // Fetch Live CMS Content on Component Mount
  useEffect(() => {
    const fetchAllCms = async () => {
      try {
        const [programsRes, getInvolvedRes, contactRes] = await Promise.allSettled([
          getPublicPageContent('programs'),
          getPublicPageContent('getInvolved'),
          getPublicPageContent('contact')
        ]);

        setCmsContent((prev) => ({
          programs: programsRes.status === 'fulfilled' && programsRes.value?.data?.content ? { ...prev.programs, ...programsRes.value.data.content } : prev.programs,
          getInvolved: getInvolvedRes.status === 'fulfilled' && getInvolvedRes.value?.data?.content ? { ...prev.getInvolved, ...getInvolvedRes.value.data.content } : prev.getInvolved,
          contact: contactRes.status === 'fulfilled' && contactRes.value?.data?.content ? { ...prev.contact, ...contactRes.value.data.content } : prev.contact
        }));
      } catch {
        // Safe fallback to defaults
      }
    };

    fetchAllCms();
  }, []);

  const tabs = [
    { id: 'essay', label: 'Essay Contest', icon: Award, component: <EssayForm />, desc: 'Submit your entry for the Annual Writing Contest.' },
    { id: 'donations', label: 'Book Donations', icon: BookOpen, component: <DonationForm />, desc: 'Pledge books to support community libraries and drives.' },
    { id: 'volunteers', label: 'Volunteers', icon: Users, component: <VolunteerForm />, desc: 'Register to become an active youth literacy volunteer.' },
    { id: 'contact', label: 'General Inquiry', icon: Mail, component: <ContactForm />, desc: 'Send a message or general question to our administrators.' },
    { id: 'events', label: 'Event Registration', icon: Calendar, component: <EventForm />, desc: 'Reserve seats for upcoming literacy workshops and fairs.' },
    { id: 'collab', label: 'Partnerships', icon: HeartHandshake, component: <CollaborationForm />, desc: 'Propose a partnership or joint community campaign.' },
  ];

  const activeTabObj = tabs.find((t) => t.id === currentTab) || tabs[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 font-sans">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Portals & Intake Forms</h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Select a category below to submit applications, pledges, or inquiries directly to the Roshan Safha team.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setParams({ tab: t.id })}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition cursor-pointer ${
              currentTab === t.id
                ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <t.icon className={`w-4 h-4 ${currentTab === t.id ? 'text-emerald-600' : 'text-slate-400'}`} />
            <span className="truncate">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Active Form Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        
        {/* Tab Header */}
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <activeTabObj.icon className="w-5 h-5 text-emerald-600" />
            {currentTab === 'donations' ? cmsContent.programs?.donationHeading || activeTabObj.label : activeTabObj.label}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{activeTabObj.desc}</p>
        </div>

        {/* Dynamic CMS Notice Banners Based on Current Tab */}
        
        {/* 1. Book Donations Tab Notice */}
        {currentTab === 'donations' && cmsContent.programs?.donationRules && (
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-4 space-y-1">
            <h3 className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#E8A94A]" /> Material Guidelines & Scope:
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {cmsContent.programs.donationRules}
            </p>
          </div>
        )}

        {/* 2. Volunteers Tab Notice */}
        {currentTab === 'volunteers' && cmsContent.getInvolved?.volunteerPitch && (
          <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-4 space-y-1">
            <h3 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-emerald-600" /> Volunteer Program Focus:
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {cmsContent.getInvolved.volunteerPitch}
            </p>
          </div>
        )}

        {/* 3. Partnerships Tab Notice */}
        {currentTab === 'collab' && cmsContent.getInvolved?.partnerPitch && (
          <div className="bg-blue-50/80 border border-blue-200/90 rounded-2xl p-4 space-y-1">
            <h3 className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-blue-600" /> Collaboration Scope:
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {cmsContent.getInvolved.partnerPitch}
            </p>
          </div>
        )}

        {/* 4. General Inquiry Tab Notice */}
        {currentTab === 'contact' && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#E8A94A] shrink-0 mt-0.5" />
              <span><strong>Hub:</strong> {cmsContent.contact?.hubAddress}</span>
            </div>
            <div className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Official WhatsApp:</strong> {cmsContent.contact?.whatsapp}</span>
            </div>
          </div>
        )}

        {/* The Form Component */}
        {activeTabObj.component}
      </div>

    </div>
  );
}

export default FormsPage;