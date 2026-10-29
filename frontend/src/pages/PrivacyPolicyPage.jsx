import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  LockKeyhole,
  Database,
  FileText,
  Mail,
  ArrowRight,
  CalendarDays,
  Eye,
  Users,
  Sparkles,
} from "lucide-react";

const LAST_UPDATED = "October 29, 2026";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    content: [
      "Roshan Safha respects the privacy of visitors, donors, students, volunteers, collaborators, and other individuals who interact with our website.",
      "This Privacy Policy explains what personal information we may collect, why we collect it, how we use it, and the choices available to individuals who share information with us.",
      "Our website supports book donations, book requests, educational programs, volunteering, partnerships, and community engagement.",
    ],
  },
  {
    id: "information-collected",
    title: "Information We Collect",
    content: [
      "When you complete a website form, we may collect information such as your name, email address, phone number, city, and the details you voluntarily provide.",
      "Book donation forms may collect information about the number and types of books, preferred drop-off or collection arrangements, and additional messages.",
      "Book request forms may collect details about the requested books and information needed to review or coordinate the request.",
      "Volunteer, collaboration, contest, event, and contact forms may collect information relevant to your inquiry, registration, or submission.",
      "We may also process limited technical information necessary for website operation, security, and troubleshooting.",
    ],
  },
  {
    id: "information-use",
    title: "How We Use Your Information",
    content: [
      "We use submitted information to respond to inquiries, coordinate book donations, review book requests, manage registrations, and communicate about relevant Roshan Safha activities.",
      "Information may also be used to maintain administrative records, improve our services, and understand participation in our literacy initiatives.",
      "We do not use information submitted through our forms to make unrelated decisions about individuals.",
    ],
  },
  {
    id: "book-donations",
    title: "Book Donations and Requests",
    content: [
      "When you pledge books for donation, we use your contact details and donation information to communicate about collection or drop-off arrangements.",
      "Donation records may include the pledged quantity, verified received quantity, and progress of adding collected books to our inventory.",
      "When you request books, we use the information provided to review the request and coordinate any subsequent communication.",
      "Submitting a form does not automatically confirm collection, approval, or fulfillment.",
    ],
  },
  {
    id: "programs",
    title: "Volunteering, Collaborations, and Programs",
    content: [
      "Information submitted through volunteer or collaboration forms may be used to assess interest, communicate opportunities, and coordinate community activities.",
      "Contest and event submissions may be processed to manage participation, review entries, and communicate relevant updates.",
      "Where a program has additional privacy or participation requirements, those details should be communicated through the relevant program information.",
    ],
  },
  {
    id: "ai-chatbot",
    title: "AI Chatbot and Automated Assistance",
    content: [
      "Our website provides an AI-assisted chatbot to help visitors find information about Roshan Safha, book donations, book requests, volunteering, contests, and other services.",
      "Messages sent to the chatbot are processed to identify the user's question and generate a relevant response.",
      "The chatbot uses automated language-processing techniques and may occasionally provide incomplete or inaccurate information.",
      "Please avoid entering passwords, financial details, identity document numbers, or other highly sensitive information into the chatbot.",
      "The chatbot interface may temporarily store conversation history in your browser session so that messages remain available when navigating between pages.",
    ],
  },
  {
    id: "storage",
    title: "Data Storage and Security",
    content: [
      "Information submitted through website forms may be stored in the databases and services used to operate Roshan Safha.",
      "Administrative features are intended for authorized personnel who manage submissions, books, donations, and other website activities.",
      "We aim to apply reasonable technical and organizational safeguards to protect information against unauthorized access, loss, alteration, or misuse.",
      "However, no internet-based system can guarantee absolute security.",
    ],
  },
  {
    id: "sharing",
    title: "Information Sharing",
    content: [
      "Personal information may be accessed by authorized Roshan Safha team members when necessary to process requests, coordinate activities, or respond to inquiries.",
      "We may use third-party technical service providers to operate website infrastructure, store data, deliver notifications, or support other website functionality.",
      "We do not intend to sell personal information submitted through our website.",
      "Information may be disclosed where required by applicable law or where necessary to protect the rights and safety of users and the organization.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies and Browser Storage",
    content: [
      "Our website may use browser storage and similar technologies to support essential functionality and improve the user experience.",
      "For example, the chatbot may use session storage to retain conversation messages and its open or minimized state during a browsing session.",
      "Other website features may use browser storage to maintain application preferences or authentication-related functionality.",
      "You can manage or clear browser storage using your browser settings, although doing so may affect some website features.",
    ],
  },
  {
    id: "retention",
    title: "Data Retention",
    content: [
      "We aim to retain personal information only for as long as reasonably necessary to manage the purpose for which it was collected, maintain relevant records, or meet applicable obligations.",
      "Retention periods may vary depending on the type of submission, operational needs, and legal requirements.",
      "Information that is no longer required should be reviewed for deletion or other appropriate handling.",
    ],
  },
  {
    id: "rights",
    title: "Your Privacy Choices",
    content: [
      "You may contact Roshan Safha to ask questions about information you have submitted through our website.",
      "You may also request correction of inaccurate information or ask whether information associated with your submission can be deleted.",
      "We will review requests in accordance with applicable law, identity-verification needs, and legitimate recordkeeping requirements.",
      "Some information may need to be retained where necessary for lawful or operational reasons.",
    ],
  },
  {
    id: "children",
    title: "Children's Privacy",
    content: [
      "Roshan Safha supports educational opportunities for children and young people.",
      "Where children participate in programs or submit information, appropriate parental, guardian, or organizational involvement may be required depending on the activity and applicable requirements.",
      "Children should not submit sensitive personal information through the website without appropriate guidance.",
      "Parents or guardians with privacy concerns may contact our team.",
    ],
  },
  {
    id: "external-links",
    title: "External Websites and Services",
    content: [
      "Our website may contain links to social media platforms and other external websites.",
      "These services operate independently and may have their own privacy policies and data-handling practices.",
      "We encourage visitors to review the privacy information provided by external services before sharing personal information.",
    ],
  },
  {
    id: "updates",
    title: "Updates to This Privacy Policy",
    content: [
      "Roshan Safha may update this Privacy Policy as website features, organizational practices, or applicable requirements change.",
      "When changes are made, the revised policy and its updated date will be published on this page.",
      "Visitors are encouraged to review this policy periodically.",
    ],
  },
];

const highlights = [
  {
    icon: ShieldCheck,
    title: "Privacy Awareness",
    description:
      "Clear information about the personal details visitors may share.",
  },
  {
    icon: LockKeyhole,
    title: "Responsible Handling",
    description:
      "Information is intended to support legitimate website activities.",
  },
  {
    icon: Users,
    title: "Your Choices",
    description:
      "Visitors can contact our team about their submitted information.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#FFF9EF] text-[#193E32]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#193E32] text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border border-white/10"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-8 -top-16 h-72 w-72 rounded-full border border-white/10"
        />

        <div className="rs-container relative py-16 sm:py-20 lg:py-24">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E8A94A]/30 bg-white/10 px-4 py-2 text-xs font-semibold text-[#F3BD65]">
            <ShieldCheck size={15} />
            Privacy & Data Protection
          </div>

          <h1 className="max-w-3xl font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Privacy <span className="text-[#E8A94A]">Policy</span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-8 text-[#D3E1D8] sm:text-base">
            Your trust matters to us. Learn how Roshan Safha collects,
            uses, and handles information shared through our website
            and community programs.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs text-[#D3E1D8]">
            <span className="inline-flex items-center gap-2">
              <CalendarDays size={15} className="text-[#E8A94A]" />
              Last updated: {LAST_UPDATED}
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-[#E8A94A] sm:block" />

            <span>Roshan Safha · Muzaffarabad, AJK</span>
          </div>
        </div>
      </section>

      {/* PRIVACY HIGHLIGHTS */}
      <section className="rs-container relative z-10 -mt-8 pb-12">
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-2xl border border-[#E7EEE5] bg-white p-6 shadow-[0_12px_35px_rgba(25,62,50,0.06)]"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E7EEE5] text-[#276B56]">
                  <Icon size={21} />
                </div>

                <h2 className="text-base font-bold">{item.title}</h2>

                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="rs-container pb-20">
        <div className="grid items-start gap-8 lg:grid-cols-[270px_minmax(0,1fr)]">
          {/* TABLE OF CONTENTS */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-[#E7EEE5] bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <FileText size={18} className="text-[#276B56]" />
                <h2 className="text-sm font-bold">On This Page</h2>
              </div>

              <nav aria-label="Privacy policy sections">
                <ul className="max-h-[65vh] space-y-3 overflow-y-auto pr-2">
                  {sections.map((section, index) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="flex items-start gap-2 text-xs leading-5 text-slate-600 transition hover:text-[#276B56]"
                      >
                        <span className="font-semibold text-[#276B56]">
                          {String(index + 1).padStart(2, "0")}.
                        </span>

                        <span>{section.title}</span>
                      </a>
                    </li>
                  ))}

                  <li>
                    <a
                      href="#contact"
                      className="flex items-start gap-2 text-xs leading-5 text-slate-600 transition hover:text-[#276B56]"
                    >
                      <span className="font-semibold text-[#276B56]">
                        15.
                      </span>
                      <span>Contact Us</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          {/* POLICY CONTENT */}
          <div className="min-w-0">
            {/* INTRODUCTION CARD */}
            <div className="mb-8 rounded-2xl border border-[#E7EEE5] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF1D7] text-[#193E32]">
                <Eye size={21} />
              </div>

              <h2 className="font-serif text-2xl font-bold">
                Your Privacy Matters
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                Roshan Safha is committed to responsible handling of
                information shared by people participating in our
                literacy and community initiatives. This page explains
                our general approach to personal information.
              </p>
            </div>

            {/* POLICY SECTIONS */}
            <div className="space-y-5">
              {sections.map((section, index) => (
                <article
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 rounded-2xl border border-[#E7EEE5] bg-white p-6 shadow-sm sm:p-8"
                >
                  <div className="mb-5 flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#E7EEE5] text-sm font-extrabold text-[#276B56]">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <h2 className="pt-1 font-serif text-xl font-bold sm:text-2xl">
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-4 pl-0 sm:pl-14">
                    {section.content.map((paragraph, paragraphIndex) => (
                      <p
                        key={paragraphIndex}
                        className="text-sm leading-8 text-slate-600"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            {/* CONTACT */}
            <section
              id="contact"
              className="mt-6 scroll-mt-28 rounded-2xl bg-[#193E32] p-7 text-white sm:p-10"
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8A94A] text-[#193E32]">
                <Mail size={23} />
              </div>

              <h2 className="font-serif text-2xl font-bold">
                15. Privacy Questions or Requests?
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-8 text-[#D3E1D8]">
                If you have questions about this Privacy Policy or
                would like to discuss information you submitted
                through our website, please contact our team.
              </p>

              <a
                href="mailto:roshansafha@gmail.com"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#F3BD65] hover:text-white"
              >
                roshansafha@gmail.com
                <ArrowRight size={17} />
              </a>

              <div className="mt-7">
                <Link
                  to="/contact#contact-form"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#E8A94A] px-5 py-3 text-xs font-bold text-[#193E32] transition hover:bg-[#F3BD65]"
                >
                  Open Contact Form
                  <ArrowRight size={16} />
                </Link>
              </div>
            </section>

            {/* TERMS LINK */}
            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#E7EEE5] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold">Website Terms & Conditions</h3>
                <p className="mt-1 text-xs leading-6 text-slate-600">
                  Read the guidelines for using Roshan Safha's website,
                  services, and community programs.
                </p>
              </div>

              <Link
                to="/terms"
                className="inline-flex shrink-0 items-center gap-2 text-xs font-bold text-[#276B56] hover:text-[#193E32]"
              >
                Read Terms
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}