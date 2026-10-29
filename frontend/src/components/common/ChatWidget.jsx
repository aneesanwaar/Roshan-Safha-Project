import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, User, Minimize2, ArrowUpRight, BookOpen, HeartHandshake, PenLine, RotateCcw } from 'lucide-react';

const resolveChatAction = (link) => {
  if (!link) return null;
  const pathname = link.split(/[?#]/)[0].replace(/\/$/, '');
  const routes = {
    '/programs/donate-books': ['/programs/donate-books#donation-form', 'Open Book Donation Form'],
    '/get-involved': ['/get-involved#volunteer-form', 'Open Volunteer Form'],
    '/programs/essays': ['/programs/essays#essay-submission-form', 'Open Essay Submission Form'],
    '/programs/essay-contests': ['/programs/essays#essay-submission-form', 'Open Essay Submission Form'],
    '/programs/summer-circle': ['/programs/summer-circle#event-registration-form', 'Open Event Registration Form'],
    '/events': ['/programs/summer-circle#event-registration-form', 'Open Event Registration Form'],
    '/contact': ['/contact#contact-form', 'Open Contact Form'],
    '/programs/book-catalog': ['/programs/book-catalog', 'Browse Books to Request'],
  };
  if (link === '/collaboration' || link === '/collaborations' || link === '/get-involved#collaboration-form') return { href: '/get-involved#collaboration-form', label: 'Open Partnership Form' };
  if (link.includes('#collaboration-form')) return { href: '/get-involved#collaboration-form', label: 'Open Partnership Form' };
  const match = routes[pathname];
  return match ? { href: match[0], label: match[1] } : { href: link, label: 'Open Related Page' };
};

const CHAT_STORAGE_KEY = 'roshan_chat_session_v1';
const WELCOME_MESSAGE = {
  id: 'welcome_msg', sender: 'bot',
  text: 'Salam! I am the Roshan Safha AI Assistant. How can I help you today? / میں روشن صفحہ کے متعلق آپ کی کیا مدد کر سکتا ہوں؟',
  timestamp: 'Just now'
};

function loadChatSession() {
  try {
    const raw = sessionStorage.getItem(CHAT_STORAGE_KEY);
    if (!raw) return { isOpen: false, messages: [WELCOME_MESSAGE] };
    const parsed = JSON.parse(raw);
    const messages = Array.isArray(parsed.messages)
      ? parsed.messages.filter(m => m && ['bot', 'user'].includes(m.sender) && typeof m.text === 'string').slice(-100)
      : [];
    return { isOpen: parsed.isOpen === true, messages: messages.length ? messages : [WELCOME_MESSAGE] };
  } catch {
    return { isOpen: false, messages: [WELCOME_MESSAGE] };
  }
}

function ChatWidget() {
  const [initialSession] = useState(loadChatSession);
  const [isOpen, setIsOpen] = useState(initialSession.isOpen);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(initialSession.messages);

  // Persist both conversation and expanded/minimized state across route changes,
  // including full reloads caused by ordinary anchor links.
  useEffect(() => {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({ isOpen, messages: messages.slice(-100) }));
    } catch (error) {
      console.warn('Chat session could not be saved:', error);
    }
  }, [isOpen, messages]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.parentElement?.scrollTo({ top: messagesEndRef.current.parentElement.scrollHeight, behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'Donate books',
    'Request a textbook',
    'Join as a volunteer',
    'How do I collaborate?'
  ];

  // Stage 1: use the existing Node -> Python NLP endpoint.
  const handleSendMessage = async (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const timestamp = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, {
      id: `usr_${Date.now()}_${Math.random()}`, sender: 'user', text: query, timestamp: timestamp()
    }]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
      const response = await fetch(`${baseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });
      const data = await response.json();
      if (!response.ok || data.success === false) {
        throw new Error(data.error || 'Chat service unavailable');
      }
      if (typeof data.reply !== 'string' || !data.reply.trim()) {
        throw new Error('Empty chatbot response');
      }
      const actionLink = typeof data.actionLink === 'string' && /^\/(?!\/)[a-zA-Z0-9/_#?=&.%-]*$/.test(data.actionLink)
        ? data.actionLink : null;
      setMessages((prev) => [...prev, {
        id: `bot_${Date.now()}_${Math.random()}`, sender: 'bot', text: data.reply,
        actionLink: resolveChatAction(actionLink), timestamp: timestamp()
      }]);
    } catch (error) {
      console.error('Chatbot request failed:', error);
      setMessages((prev) => [...prev, {
        id: `bot_error_${Date.now()}`, sender: 'bot',
        text: 'The assistant is temporarily unavailable. Please try again or use our Contact page.',
        actionLink: resolveChatAction('/contact'), timestamp: timestamp()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside aria-label="Roshan Safha AI Assistant" className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] max-w-[calc(100vw-2rem)]">
      {!isOpen ? (
        <button type="button" onClick={() => setIsOpen(true)} aria-label="Open Roshan Safha AI Assistant"
          className="group flex items-center gap-2 rounded-full bg-[#193E32] py-1.5 pl-1.5 pr-3.5 text-white shadow-[0_14px_40px_rgba(25,62,50,0.3)] ring-1 ring-white/20 transition hover:-translate-y-1 hover:bg-[#276B56] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E8A94A]">
          <span className="relative grid h-8 w-8 place-items-center rounded-full bg-[#E8A94A] text-[#193E32]">
            <Sparkles size={16} strokeWidth={2.3}/>
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#193E32] bg-emerald-400" />
          </span>
          <span className="text-left text-[12px] font-bold leading-tight">Ask Roshan AI</span>
        </button>
      ) : (
        <section aria-label="Chat conversation" className="flex h-[min(610px,calc(100dvh-2rem))] w-[min(410px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[26px] border border-[#E7EEE5] bg-white shadow-[0_25px_90px_rgba(12,35,29,0.28)]">
          <header className="relative shrink-0 overflow-hidden bg-[#193E32] px-5 pb-4 pt-5 text-white">
            <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-16 h-44 w-44 rounded-full border border-white/10" />
            <div aria-hidden="true" className="pointer-events-none absolute -right-5 -top-8 h-28 w-28 rounded-full border border-white/10" />
            <div className="relative flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#E8A94A] text-[#193E32] shadow-inner"><Sparkles size={21}/></div>
                <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="text-[15px] font-extrabold tracking-tight">Roshan Safha AI</h2><span className="rounded-full bg-white/15 px-2 py-0.5 text-[9px] font-semibold text-[#F9E6BD]">EN · اردو</span></div><p className="mt-0.5 text-[11px] text-emerald-100/85">Your literacy & community guide</p></div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Minimize assistant" title="Minimize"
                className="rounded-xl p-2 text-white/80 transition hover:bg-white/15 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8A94A]"><Minimize2 size={17}/></button>
            </div>
            <div className="relative mt-4 flex items-center gap-2 text-[10px] text-emerald-100"><span className="h-2 w-2 rounded-full bg-emerald-400"/> Ready to help you find the right form or information</div>
          </header>
          <div className="flex min-h-0 flex-1 flex-col bg-[#F7F9F6]">
            <div className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5" role="log" aria-live="polite" aria-relevant="additions text">
              <div className="mx-auto w-fit rounded-full border border-[#E7EEE5] bg-white px-3 py-1 text-[10px] font-medium text-slate-500">Roshan Safha assistant</div>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.sender === 'bot' && <div className="mb-1 grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-[#E8A94A]/25 text-[#193E32]"><Bot size={15}/></div>}
                  <div className={`max-w-[83%] rounded-[19px] px-3.5 py-3 text-[12px] leading-[1.7] shadow-sm ${msg.sender === 'user' ? 'rounded-br-md bg-[#193E32] text-white' : 'rounded-bl-md border border-[#E7EEE5] bg-white text-slate-700'}`}>
                    <p dir="auto" className="whitespace-pre-wrap break-words">{msg.text}</p>
                    {msg.sender === 'bot' && msg.actionLink && (
                      <a href={msg.actionLink.href} className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-xl bg-[#193E32] px-3 py-2 text-[11px] font-bold leading-snug text-white transition hover:bg-[#276B56] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E8A94A]">
                        <span>{msg.actionLink.label}</span><ArrowUpRight size={14} className="shrink-0"/>
                      </a>
                    )}
                    <time className={`mt-1.5 block text-[9px] ${msg.sender === 'user' ? 'text-emerald-100/70' : 'text-slate-400'}`}>{msg.timestamp}</time>
                  </div>
                  {msg.sender === 'user' && <div className="mb-1 grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-[#E7EEE5] text-[#193E32]"><User size={15}/></div>}
                </div>
              ))}
              {isLoading && <div className="flex items-center gap-2 pl-9 text-[11px] text-slate-500"><span className="flex gap-1 rounded-2xl border border-[#E7EEE5] bg-white px-3 py-3"><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#276B56]"/><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#276B56] [animation-delay:150ms]"/><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#276B56] [animation-delay:300ms]"/></span>Thinking…</div>}
              <div ref={messagesEndRef}/>
            </div>
            {messages.length <= 2 && (
              <div className="shrink-0 border-t border-[#E7EEE5] bg-white/80 px-4 py-3">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#276B56]">Try asking</p>
                <div className="flex flex-wrap gap-2">{quickPrompts.map((prompt, idx) => (
                  <button key={prompt} type="button" onClick={() => handleSendMessage(prompt)} disabled={isLoading}
                    className="rounded-full border border-[#DDE9E0] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#193E32] transition hover:border-[#276B56] hover:bg-[#E7EEE5] disabled:opacity-50">{prompt}</button>
                ))}</div>
              </div>
            )}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="shrink-0 border-t border-[#E7EEE5] bg-white px-4 pb-3 pt-3">
            <div className="flex items-center gap-2 rounded-2xl border border-[#DDE9E0] bg-[#F7F9F6] px-2 py-1.5 transition-colors focus-within:border-[#E8A94A] focus-within:ring-2 focus-within:ring-[#E8A94A]/25">
              <input type="text" aria-label="Your message" placeholder="Ask anything / سوال پوچھیں…" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} maxLength={1000}
                className="!m-0 !min-w-0 !w-full !flex-1 !rounded-none !border-0 !bg-transparent !px-2 !py-2 !text-[12px] !text-[#193E32] !shadow-none !outline-none !ring-0 placeholder:!text-slate-400 focus:!border-0 focus:!outline-none focus:!ring-0 focus:!shadow-none" />
              <button type="submit" aria-label="Send message" disabled={!inputMessage.trim() || isLoading} className="!m-0 grid h-9 w-9 shrink-0 place-items-center rounded-xl border-0 bg-[#193E32] p-0 text-white shadow-none transition hover:bg-[#276B56] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8A94A] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"><Send size={16}/></button>
            </div>
            <p className="mt-2 text-center text-[9px] text-slate-400">Powered by Roshan Safha · English & Urdu</p>
          </form>
        </section>
      )}
    </aside>
  );
}

export default ChatWidget;
