// import React, { useState } from 'react';
// import VolunteerForm from '../components/forms/VolunteerForm';
// import CollaborationForm from '../components/forms/CollaborationForm';
// import { Users, HeartHandshake, BookOpen, Award } from 'lucide-react';
// import { Link } from 'react-router-dom';

// function GetInvolvedPage() {
//   const [activeTab, setActiveTab] = useState('volunteer');

//   return (
//     <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
//       {/* Header */}
//       <div className="text-center max-w-2xl mx-auto space-y-3">
//         <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
//           Join the Movement
//         </span>
//         <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
//           Get Involved with Roshan Safha
//         </h1>
//         <p className="text-slate-600 text-sm leading-relaxed">
//           Whether you want to offer on-ground volunteer hours, sponsor literary drives, or partner as an academic institution, there is a place for you.
//         </p>
//       </div>

//       {/* Quick Links Banner */}
//       <div className="grid sm:grid-cols-2 gap-4">
//         <Link 
//           to="/programs/donations" 
//           className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 p-5 rounded-2xl flex items-center gap-4 transition group"
//         >
//           <div className="p-3 bg-emerald-600 text-white rounded-xl group-hover:scale-105 transition-transform">
//             <BookOpen className="w-5 h-5" />
//           </div>
//           <div>
//             <h4 className="font-bold text-slate-900 text-sm">Have books to donate?</h4>
//             <p className="text-xs text-slate-500">Pledge syllabus and storybooks directly &rarr;</p>
//           </div>
//         </Link>

//         <Link 
//           to="/programs/essays" 
//           className="bg-blue-50 hover:bg-blue-100 border border-blue-200 p-5 rounded-2xl flex items-center gap-4 transition group"
//         >
//           <div className="p-3 bg-blue-600 text-white rounded-xl group-hover:scale-105 transition-transform">
//             <Award className="w-5 h-5" />
//           </div>
//           <div>
//             <h4 className="font-bold text-slate-900 text-sm">Participate in Essay Contests</h4>
//             <p className="text-xs text-slate-500">Junior & Senior writing competition portal &rarr;</p>
//           </div>
//         </Link>
//       </div>

//       {/* Switcher & Form Card */}
//       <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
//         <div className="flex border-b border-slate-200 pb-4 gap-4">
//           <button
//             onClick={() => setActiveTab('volunteer')}
//             className={`flex items-center gap-2 pb-2 text-sm font-bold transition border-b-2 -mb-[18px] ${
//               activeTab === 'volunteer' 
//                 ? 'border-emerald-600 text-emerald-600' 
//                 : 'border-transparent text-slate-400 hover:text-slate-700'
//             }`}
//           >
//             <Users className="w-4 h-4" /> Volunteer Sign-Up
//           </button>
//           <button
//             onClick={() => setActiveTab('collab')}
//             className={`flex items-center gap-2 pb-2 text-sm font-bold transition border-b-2 -mb-[18px] ${
//               activeTab === 'collab' 
//                 ? 'border-emerald-600 text-emerald-600' 
//                 : 'border-transparent text-slate-400 hover:text-slate-700'
//             }`}
//           >
//             <HeartHandshake className="w-4 h-4" /> Institutional Partnership
//           </button>
//         </div>

//         <div className="pt-2">
//           {activeTab === 'volunteer' ? <VolunteerForm /> : <CollaborationForm />}
//         </div>
//       </div>

//     </div>
//   );
// }

// export default GetInvolvedPage;

import React, { useState } from 'react';
import VolunteerForm from '../components/forms/VolunteerForm';
import CollaborationForm from '../components/forms/CollaborationForm';
import { UserCheck, Building2, HeartHandshake } from 'lucide-react';

function GetInvolvedPage() {
  const [activeTab, setActiveTab] = useState('volunteer'); // 'volunteer' or 'collab'

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3.5 py-1.5 rounded-full">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Join Our Mission</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Get Involved with Roshan Safha
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Whether you are an individual wanting to volunteer your time, or an educational institution looking to partner, there is a place for you.
          </p>
        </div>

        {/* Form Selector Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex bg-slate-200/80 p-1 rounded-2xl gap-1">
            <button
              onClick={() => setActiveTab('volunteer')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'volunteer'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Join as Volunteer
            </button>
            <button
              onClick={() => setActiveTab('collab')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'collab'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-emerald-600" />
              Partner / Collaborate
            </button>
          </div>
        </div>

        {/* Active Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10">
          {activeTab === 'volunteer' ? (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Volunteer Registration Form</h3>
                <p className="text-xs text-slate-500">Sign up to help with book restoration, logistics, and student events.</p>
              </div>
              <VolunteerForm />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Institutional Collaboration Proposal</h3>
                <p className="text-xs text-slate-500">Partner with us for school book drives, youth workshops, and joint programs.</p>
              </div>
              <CollaborationForm />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default GetInvolvedPage;