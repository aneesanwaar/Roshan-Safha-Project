import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  BookOpen,
  HeartHandshake,
  FileText,
  Mail,
  ArrowRight,
  Scale,
  Sparkles,
  CalendarDays,
} from "lucide-react";

const LAST_UPDATED = "October 29, 2026";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    content: [
      "Welcome to Roshan Safha. By accessing or using our website, you agree to follow these Terms & Conditions.",
      "Roshan Safha is a community-driven initiative focused on promoting literacy, giving books a second life, and creating meaningful learning opportunities.",
      "If you do not agree with these terms, please discontinue using the website.",
    ],
  },
  {
    id: "website-use",
    title: "Use of Our Website",
    content: [
      "Our website provides information about literacy initiatives, book donations, book requests, volunteering, educational programs, contests, and community activities.",
      "Visitors must use the website responsibly and must not submit misleading information, interfere with website operations, or attempt unauthorized access to restricted areas.",
      "We may restrict access to website features where necessary to protect the platform and its users.",
    ],
  },
  {
    id: "book-donations",
    title: "Book Donations",
    content: [
      "Visitors may submit book donation pledges through the Book Donation Form.",
      "Submitting a donation form records your intention to donate books. It does not mean the books have already been collected or added to our inventory.",
      "Our team may contact donors using the information provided to coordinate collection or drop-off.",
      "Books are recorded as collected only after their physical receipt and quantity have been verified.",
      "Roshan Safha may assess donated books for suitability, condition, and potential educational use before cataloging or distributing them.",
    ],
  },
  {
    id: "book-requests",
    title: "Book Requests",
    content: [
      "Visitors may browse available educational books and submit requests through the website.",
      "Submitting a book request does not guarantee that a requested book will be provided.",
      "Requests are subject to available inventory, verification, and review by the Roshan Safha team.",
      "Applicants are expected to provide accurate contact information so the team can communicate regarding their requests.",
    ],
  },
  {
    id: "volunteering",
    title: "Volunteering and Collaboration",
    content: [
      "Individuals and organizations may express interest in volunteering or collaborating with Roshan Safha through the relevant forms.",
      "Submitting a registration or collaboration inquiry does not automatically establish a volunteer position, partnership, or formal agreement.",
      "Participation opportunities may depend on organizational needs, availability, and further communication.",
      "Volunteers and collaborators are expected to act respectfully and support the organization's educational and community-focused objectives.",
    ],
  },
  {
    id: "contests",
    title: "Essay Contests and Educational Events",
    content: [
      "Roshan Safha may organize essay contests, educational programs, workshops, and community events.",
      "Participation may be subject to additional rules, eligibility requirements, submission deadlines, and event-specific instructions.",
      "Participants should review the relevant program or contest information before submitting an entry.",
      "Submission of an entry does not guarantee selection, recognition, or an award.",
    ],
  },
  {
    id: "information",
    title: "Accuracy of Submitted Information",
    content: [
      "Users should provide accurate and up-to-date information when submitting forms.",
      "Incorrect or incomplete information may prevent Roshan Safha from processing requests, coordinating donations, or responding to inquiries.",
      "Personal information submitted through the website should be handled in accordance with our Privacy Policy.",
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: [
      "The Roshan Safha name, branding, original website content, graphics, and other materials may be protected by applicable intellectual property laws.",
      "Visitors may view website content for personal, informational, and educational purposes.",
      "Unauthorized commercial reproduction or misuse of protected materials is not permitted.",
      "Content submitted by users remains subject to any applicable rights and contest-specific conditions.",
    ],
  },
  {
    id: "ai-assistant",
    title: "AI Assistant Disclaimer",
    content: [
      "The Roshan Safha AI Assistant helps visitors find information about book donations, requests, volunteering, contests, and other website services.",
      "The assistant uses automated language-processing techniques and may occasionally misunderstand questions or provide incomplete or inaccurate responses.",
      "Chatbot responses are intended for general guidance and should not be treated as official confirmation of eligibility, availability, acceptance, or organizational decisions.",
      "For important inquiries, visitors should contact the Roshan Safha team directly.",
    ],
  },
  {
    id: "external-links",
    title: "External Links",
    content: [
      "Our website may contain links to third-party websites or social media platforms.",
      "Roshan Safha does not control external websites and is not responsible for their content, availability, or privacy practices.",
      "Visitors should review the policies of any external services they choose to use.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    content: [
      "We aim to keep the website accurate, secure, and accessible, but uninterrupted operation or complete accuracy cannot be guaranteed.",
      "Information about books, events, contests, and programs may change over time.",
      "To the extent permitted by applicable law, Roshan Safha is not responsible for losses arising solely from reliance on outdated website information or temporary service interruptions.",
      "Nothing in these terms excludes liability that cannot legally be excluded.",
    ],
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    content: [
      "Roshan Safha may update these Terms & Conditions to reflect changes in website features, organizational processes, or applicable requirements.",
      "The latest version will be made available on this page with an updated revision date.",
      "Visitors are encouraged to review this page periodically.",
    ],
  },
];

const highlights = [
  {
    icon: BookOpen,
    title: "Responsible Book Sharing",
    description:
      "Clear expectations for book donations, requests, and availability.",
  },
  {
    icon: HeartHandshake,
    title: "Community Participation",
    description:
      "Guidelines for volunteering, partnerships, and educational activities.",
  },
  {
    icon: ShieldCheck,
    title: "Transparency & Trust",
    description:
      "Straightforward information about website use and responsibilities.",
  },
];

export default function TermsConditionsPage() {
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
            <Scale size={15} />
            Legal Information
          </div>

          <h1 className="max-w-3xl font-serif text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Terms <span className="text-[#E8A94A]">&</span> Conditions
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-8 text-[#D3E1D8] sm:text-base">
            Please read these terms to understand how our website,
            book-sharing services, and community programs operate.
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

      {/* HIGHLIGHTS */}
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

              <nav aria-label="Terms sections">
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
                        13.
                      </span>
                      <span>Contact Us</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </aside>

          {/* TERMS */}
          <div className="min-w-0">
            <div className="mb-8 rounded-2xl border border-[#E7EEE5] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF1D7] text-[#193E32]">
                <Sparkles size={21} />
              </div>

              <h2 className="font-serif text-2xl font-bold">
                Our Commitment to the Community
              </h2>

              <p className="mt-4 text-sm leading-8 text-slate-600">
                Roshan Safha believes in accessible education,
                responsible book reuse, and meaningful community
                participation. These terms explain the general
                expectations for visitors using our platform.
              </p>
            </div>

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
                13. Questions About These Terms?
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-8 text-[#D3E1D8]">
                If you have questions about these Terms & Conditions,
                please contact the Roshan Safha team.
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

            {/* PRIVACY POLICY LINK */}
            <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#E7EEE5] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-sm font-bold">Your Privacy Matters</h3>
                <p className="mt-1 text-xs leading-6 text-slate-600">
                  Learn how information submitted through our website
                  is handled.
                </p>
              </div>

              <Link
                to="/privacy-policy"
                className="inline-flex shrink-0 items-center gap-2 text-xs font-bold text-[#276B56] hover:text-[#193E32]"
              >
                Read Privacy Policy
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}