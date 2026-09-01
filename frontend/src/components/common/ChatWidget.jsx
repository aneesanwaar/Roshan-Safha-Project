import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User, Minimize2 } from 'lucide-react';

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const [messages, setMessages] = useState([
    {
      id: 'welcome_msg',
      sender: 'bot',
      text: 'Salam! I am the Roshan Safha AI Assistant. How can I help you today? / میں روشن صفحہ کے متعلق آپ کی کیا مدد کر سکتا ہوں؟',
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'How do I donate syllabus books?',
    'کتابیں کیسے عطیہ کریں؟',
    'Where is the Muzaffarabad hub located?',
    'What are the 2026 Essay Contest rules?'
  ];

  const generateAssistantReply = (userQuery) => {
    const q = userQuery.toLowerCase();

    if (q.includes('donate') || q.includes('عطیہ') || q.includes('کتابیں جمع')) {
      return "You can donate Matric (9th-10th), FSc/Intermediate, and general reading books! Visit our 'Programs > Donate Books' page to log your drop-off or courier parcel to our Muzaffarabad central hub. / آپ میٹرک، ایف ایس سی اور دیگر نصابی کتب ہمارے مظفرآباد مرکز پر جمع کروا سکتے ہیں۔";
    }

    if (q.includes('hub') || q.includes('location') || q.includes('address') || q.includes('پتہ') || q.includes('دفتر')) {
      return "Our central physical hub is located near University Ground, Muzaffarabad, Azad Kashmir. We are open Monday to Saturday from 10:00 AM to 5:00 PM for textbook collection and student book pickups.";
    }

    if (q.includes('essay') || q.includes('contest') || q.includes('مقابلہ') || q.includes('مضمون')) {
      return "The 2026 Annual Essay Competition is open for Junior (under 16) and Senior (16+) categories. Junior Topic: 'The Book That Changed My Perspective'. Senior Topic: 'Sustainable Literacy in the AI Century'. Submissions close October 30, 2026!";
    }

    if (q.includes('summer') || q.includes('circle') || q.includes('sdg') || q.includes('ورکشاپ')) {
      return "The SDGs Summer Circle is our youth cohort focusing on climate awareness and community reading circles. Registrations are open on the 'SDGs Summer Circle' page.";
    }

    if (q.includes('volunteer') || q.includes('رضاکار') || q.includes('join')) {
      return "We welcome volunteers for textbook restoration, binding, sorting, and mentoring! Please sign up using the form on our 'Get Involved' page.";
    }

    return "Thank you for reaching out! You can explore our restored book catalog, donate syllabus sets, or register for upcoming essay competitions right from the navigation menu above. For direct contact, WhatsApp us at +92 300 1234567.";
  };

  const handleSendMessage = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const replyText = generateAssistantReply(query);
      const botReply = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, botReply]);
      setIsLoading(false);
    }, 600);
  };

  return (
    <aside aria-label="AI Assistant" className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 bg-slate-950 hover:bg-slate-900 text-[#E8A94A] px-4 py-3 rounded-full shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95 border border-[#E8A94A]/40 cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-[#E8A94A] text-slate-950 flex items-center justify-center font-bold text-xs">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-black tracking-wide pr-1">AI Assistant</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </button>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-[90vw] sm:w-[380px] h-[520px] max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-slate-950 text-white p-4 flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E8A94A] text-slate-950 flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white flex items-center gap-1.5">
                  Roshan Safha AI
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded">Bilingual</span>
                </h3>
                <p className="text-[10px] text-slate-400">Literacy & Program Guide</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-6 h-6 rounded-full bg-[#E8A94A] text-slate-950 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`p-3 rounded-2xl max-w-[82%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-950 text-white rounded-tr-xs shadow-xs font-medium'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[9px] block mt-1 ${msg.sender === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-1.5 items-center text-slate-400 text-xs italic pl-8">
                <span className="w-1.5 h-1.5 bg-[#E8A94A] rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-[#E8A94A] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-[#E8A94A] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span className="text-[10px] ml-1">Roshan AI is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex flex-wrap gap-1.5 shrink-0">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="text-[10px] font-bold bg-white text-slate-700 border border-slate-200 px-2 py-1 rounded-lg hover:bg-[#E8A94A] hover:text-slate-950 transition cursor-pointer text-left"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              placeholder="Ask anything / سوال پوچھیں..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 text-xs bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:bg-white focus:ring-2 focus:ring-[#E8A94A]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="bg-[#E8A94A] hover:bg-[#d99839] disabled:bg-slate-200 text-slate-950 p-2 rounded-xl transition cursor-pointer disabled:cursor-not-allowed shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </aside>
  );
}

export default ChatWidget;