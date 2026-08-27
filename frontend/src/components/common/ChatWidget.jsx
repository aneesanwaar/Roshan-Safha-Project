import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' or 'ur'
  const [input, setInput] = useState('');
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello! Welcome to Roshan Safha. I am your literacy assistant. How can I help you today?",
      textUr: "السلام علیکم! روشن صفحہ میں خوش آمدید۔ میں آپ کی کیا مدد کر سکتا ہوں؟"
    }
  ]);

  // Intent Knowledge Base (English & Urdu Keywords)
  const knowledgeBase = [
    {
      keywords: ['donate', 'give books', 'pledge', 'کتابیں', 'عطیہ', 'جمع'],
      responseEn: "You can donate old or new textbooks directly through our Book Donations portal! We also accept syllabus guides and storybooks.",
      responseUr: "آپ ہمارے بک ڈونیشن پورٹل کے ذریعے کتابیں عطیہ کر سکتے ہیں۔ ہم پرانی اور نئی نصابی کتب وصول کرتے ہیں۔",
      actionLink: "/programs/donations",
      actionText: "Donate Books Form"
    },
    {
      keywords: ['contest', 'essay', 'competition', 'prize', 'مضمون', 'مقابلہ', 'انعام'],
      responseEn: "Our Annual Youth Essay Contest is open for Junior (Under 16) and Senior (16+) students. Prizes include shields, certificates, and book hampers.",
      responseUr: "ہمارا سالانہ مضمون نویسی کا مقابلہ جاری ہے۔ جونیئر اور سینئر دونوں کیٹیگریز کے طلباء حصہ لے سکتے ہیں۔",
      actionLink: "/programs/essays",
      actionText: "Essay Contest Portal"
    },
    {
      keywords: ['volunteer', 'join', 'help', 'کام', 'رضاکار', 'شمولیت'],
      responseEn: "We welcome passionate volunteers for book restoration, logistics, and organizing reading workshops across Azad Kashmir.",
      responseUr: "ہم کتابوں کی مرمت اور ورکشاپس کے لیے رضاکاروں کو خوش آمدید کہتے ہیں۔",
      actionLink: "/get-involved",
      actionText: "Volunteer Sign-Up"
    },
    {
      keywords: ['contact', 'email', 'phone', 'location', 'address', 'رابطہ', 'فون', 'پتہ'],
      responseEn: "Roshan Safha is based in Muzaffarabad, AJK. You can email us at roshansafha@gmail.com or WhatsApp +92 300 5966967.",
      responseUr: "روشن صفحہ مظفرآباد، آزاد کشمیر میں واقع ہے۔ ای میل: roshansafha@gmail.com | فون: 03005966967",
      actionLink: "/contact",
      actionText: "Contact Us Page"
    }
  ];

  const handleSend = (textToSend) => {
    const query = (textToSend || input).trim().toLowerCase();
    if (!query) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query, textUr: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      let matched = knowledgeBase.find(k => k.keywords.some(kw => query.includes(kw)));

      let botResponse = matched 
        ? {
            id: Date.now() + 1,
            sender: 'bot',
            text: matched.responseEn,
            textUr: matched.responseUr,
            actionLink: matched.actionLink,
            actionText: matched.actionText
          }
        : {
            id: Date.now() + 1,
            sender: 'bot',
            text: "I can assist you with Book Donations, Essay Contests, Volunteering, or Contact info. Please pick a topic or visit our direct portals.",
            textUr: "میں کتابوں کے عطیات، مضمون نویسی کے مقابلے یا رضاکارانہ خدمات میں مدد کر سکتا ہوں۔ برائے مہربانی اپنا سوال منتخب کریں۔"
          };

      setMessages(prev => [...prev, botResponse]);
    }, 400);
  };

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
      }}
    >
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white p-4 rounded-full shadow-2xl flex items-center gap-2 font-bold text-xs transition-all duration-200 border-2 border-white cursor-pointer"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="hidden sm:inline">AI Assistant</span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-80 sm:w-96 overflow-hidden flex flex-col h-[520px] animate-in fade-in zoom-in-95">
          
          {/* Top Bar */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-600 rounded-xl text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-xs">Roshan Safha AI</h4>
                <span className="text-[10px] text-emerald-400 font-semibold block">Online • English / اردو</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setLanguage(language === 'en' ? 'ur' : 'en')}
                className="text-[11px] font-bold bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer"
              >
                {language === 'en' ? 'اردو' : 'EN'}
              </button>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-xs'
                }`}>
                  {language === 'ur' && m.textUr ? m.textUr : m.text}
                </div>
                {m.actionLink && (
                  <button
                    onClick={() => { setIsOpen(false); navigate(m.actionLink); }}
                    className="mt-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg hover:bg-emerald-100 transition cursor-pointer"
                  >
                    &rarr; {m.actionText}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Quick Suggestions */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[10px]">
            <button onClick={() => handleSend("Donate books")} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full shrink-0 cursor-pointer">
              📚 Book Donation
            </button>
            <button onClick={() => handleSend("Essay Contest")} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full shrink-0 cursor-pointer">
              ✍️ Essay Contest
            </button>
            <button onClick={() => handleSend("Volunteer")} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full shrink-0 cursor-pointer">
              🌱 Volunteer
            </button>
          </div>

          {/* Input Box */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)}
              placeholder={language === 'ur' ? 'اپنا سوال لکھیں...' : 'Ask a question...'}
              className="flex-1 text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button type="submit" className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}

export default ChatWidget;