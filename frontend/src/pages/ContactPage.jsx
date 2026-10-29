import React, { useEffect, useState } from "react";
import { Mail, MapPin, Phone, Clock, ArrowUpRight, MessageSquare } from "lucide-react";
import ContactForm from "../components/forms/ContactForm";
import { getPublicPageContent } from "../services/api";

const DEFAULT_CONTACT_CONTENT = {
  hubAddress: "Roshan Safha Reading Hub, Near Neelum Bridge, Muzaffarabad, Azad Jammu and Kashmir",
  whatsapp: "+92 300 1234567",
};

function ContactPage() {
  const [content, setContent] = useState(DEFAULT_CONTACT_CONTENT);

  useEffect(() => {
    let mounted = true;
    getPublicPageContent("contact")
      .then((res) => {
        if (mounted && res.data?.content && typeof res.data.content === "object") {
          setContent((prev) => ({ ...prev, ...res.data.content }));
        }
      })
      .catch((err) => console.warn("Contact CMS unavailable; using defaults.", err));
    return () => { mounted = false; };
  }, []);

  const details = [
    { icon: MapPin, label: "Reading hub", value: content.hubAddress },
    { icon: Phone, label: "WhatsApp", value: content.whatsapp },
    { icon: Mail, label: "Email", value: "contact@roshansafha.org" },
    { icon: Clock, label: "Hours", value: "Mon–Sat · 10 AM–5 PM" },
  ];

  return (
    <main className="min-h-screen overflow-x-clip bg-[#FFF9EF] pb-16 font-sans">
      <header className="bg-[#193E32] px-4 py-10 text-white sm:px-6 sm:py-12">
        <div className="mx-auto max-w-6xl">
          <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.17em] text-[#E8A94A]">
            <MessageSquare className="h-4 w-4" /> Contact Roshan Safha
          </p>
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Let's start a conversation.</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/75">
            Questions about books, programs or partnerships? We're here to help.
          </p>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl min-w-0 items-start gap-5 px-4 pt-8 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-7">
        <aside className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-[#DCE6DB] bg-white p-5 sm:p-6">
            <h2 className="text-lg font-extrabold text-[#193E32]">Get in touch</h2>
            <p className="mt-1 text-xs leading-6 text-slate-500">Reach our community coordination team.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {details.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex min-w-0 items-start gap-3 rounded-xl bg-[#F5F8F3] p-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E7EEE5] text-[#276B56]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wide text-[#6D8778]">{label}</p>
                    <p className="mt-1 break-words text-xs font-semibold leading-5 text-[#193E32]">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <a
            href="/get-involved"
            className="
    group flex w-full items-center justify-between gap-4
    rounded-2xl bg-[#E7EEE5] px-5 py-4
    text-[#193E32] transition-all duration-200
    hover:bg-[#D8E6D8] hover:shadow-md
    focus-visible:outline-2
    focus-visible:outline-offset-2
    focus-visible:outline-[#276B56]
  "
          >
            <div className="min-w-0">
              <p className="text-sm font-bold leading-6">
                Help us bring books to more learners.
              </p>

              <span className="mt-1 block text-xs font-semibold text-[#276B56]">
                Explore Ways to Help
              </span>
            </div>

            <ArrowUpRight
              className="
      h-5 w-5 shrink-0
      transition-transform duration-200
      group-hover:-translate-y-0.5
      group-hover:translate-x-0.5
    "
            />
          </a>
        </aside>

        <section id="contact-form" className="scroll-mt-28 min-w-0 rounded-2xl border border-[#DCE6DB] bg-white p-4 shadow-[0_10px_30px_rgba(25,62,50,0.05)] sm:p-6 lg:p-7">
          <ContactForm />
        </section>
      </div>
    </main>
  );
}

export default ContactPage;
