import React from 'react';
import { useSearchParams } from 'react-router-dom';
import EssayForm from '../components/forms/EssayForm';
import DonationForm from '../components/forms/DonationForm';
import VolunteerForm from '../components/forms/VolunteerForm';
import ContactForm from '../components/forms/ContactForm';
import EventForm from '../components/forms/EventForm';
import CollaborationForm from '../components/forms/CollaborationForm';
import { Award, BookOpen, Users, Mail, Calendar, HeartHandshake } from 'lucide-react';

function FormsPage() {
  const [params, setParams] = useSearchParams();
  const currentTab = params.get('tab') || 'essay';

  const tabs = [
    { id: 'essay', label: 'Essay Contest', icon: Award, component: <EssayForm />, desc: 'Submit your entry for the Annual Writing Contest.' },
    { id: 'donations', label: 'Book Donations', icon: BookOpen, component: <DonationForm />, desc: 'Pledge books to support community libraries and drives.' },
    { id: 'volunteers', label: 'Volunteers', icon: Users, component: <VolunteerForm />, desc: 'Register to become an active youth literacy volunteer.' },
    { id: 'contact', label: 'General Inquiry', icon: Mail, component: <ContactForm />, desc: 'Send a message or general question to our administrators.' },
    { id: 'events', label: 'Event Registration', icon: Calendar, component: <EventForm />, desc: 'Reserve seats for upcoming literacy workshops and fairs.' },
    { id: 'collab', label: 'Partnerships', icon: HeartHandshake, component: <CollaborationForm />, desc: 'Propose a partnership or joint community campaign.' },
  ];

  const activeTabObj = tabs.find(t => t.id === currentTab) || tabs[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Portals & Intake Forms</h1>
        <p className="text-slate-500 text-sm max-w-xl mx-auto">
          Select a category below to submit applications, pledges, or inquiries directly to the Roshan Safha team.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setParams({ tab: t.id })}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold transition ${
              currentTab === t.id
                ? 'bg-white text-brand-700 shadow-sm border border-slate-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <t.icon className={`w-4 h-4 ${currentTab === t.id ? 'text-brand-600' : 'text-slate-400'}`} />
            <span className="truncate">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Active Form Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <activeTabObj.icon className="w-5 h-5 text-brand-600" />
            {activeTabObj.label}
          </h2>
          <p className="text-xs text-slate-500 mt-1">{activeTabObj.desc}</p>
        </div>
        {activeTabObj.component}
      </div>

    </div>
  );
}

export default FormsPage;