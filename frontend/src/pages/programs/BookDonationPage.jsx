import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Heart,
  MapPin,
  PackageCheck,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";

import DonationForm from "../../components/forms/DonationForm";

const headingFont = {
  fontFamily: "'Playfair Display', Georgia, serif",
};

const processSteps = [
  {
    number: "01",
    title: "Collect",
    description:
      "We receive pre-loved textbooks, reference materials, and reading books from people who want to share the gift of learning.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Restore",
    description:
      "Our team reviews donated books and restores suitable copies when needed, helping useful learning materials last longer.",
    icon: RefreshCw,
  },
  {
    number: "03",
    title: "Donate",
    description:
      "Usable books are prepared for redistribution to students and readers who can benefit from them.",
    icon: Heart,
  },
];

const acceptedBooks = [
  "Primary and middle school textbooks",
  "Matric / Class 9–10 textbooks",
  "FSc and intermediate textbooks",
  "University and reference books",
  "English and Urdu literature",
  "Children's storybooks and educational reading materials",
];

const guidelines = [
  {
    title: "Check the condition",
    description:
      "Books should be readable and reasonably complete. Minor wear or binding damage is generally fine.",
    icon: CheckCircle2,
  },
  {
    title: "Tell us what you have",
    description:
      "Mention the approximate number, categories, and condition of your books in the donation form.",
    icon: PackageCheck,
  },
  {
    title: "Choose your preference",
    description:
      "Select drop-off or request pickup. Our team will confirm the available handover arrangements.",
    icon: Truck,
  },
];

function BookDonationPage() {
  return (
    <main className="overflow-hidden bg-[#FFFDF8] text-[#193E32]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#193E32]">
        <div
          className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full border border-white/10"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-40 left-[-100px] h-96 w-96 rounded-full bg-[#276B56]/35 blur-3xl"
          aria-hidden="true"
        />

        <div className="rs-container relative mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-[#F6D6A2]">
                <Heart size={15} />
                ROSHAN SAFHA · BOOK DONATIONS
              </div>

              <h1
                className="max-w-3xl text-4xl font-bold leading-[1.15] text-white sm:text-5xl lg:text-6xl"
                style={headingFont}
              >
                A Book You Share.
                <br />
                <span className="text-[#E8A94A]">
                  A Future You Brighten.
                </span>
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-[#E0EAE3] sm:text-lg">
                The books on your shelf could become someone else's
                opportunity to learn. Donate your pre-loved books and help
                make education more accessible, one page at a time.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <a
                  href="#donation-form"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E8A94A] px-7 py-3.5 text-sm font-bold text-[#193E32] transition hover:bg-[#F3BF6D]"
                >
                  Donate Your Books
                  <ArrowRight size={17} />
                </a>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  How It Works
                </a>
              </div>
            </div>

            {/* HERO VISUAL */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <div className="absolute -inset-5 rounded-[40px] border border-white/10" />

              <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-[#275646] p-8 shadow-2xl sm:p-10">
                <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[#E8A94A]/10 blur-3xl" />

                <div className="relative flex min-h-[300px] flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8A94A] text-[#193E32]">
                      <BookOpen size={29} strokeWidth={1.7} />
                    </div>

                    <Sparkles
                      size={29}
                      className="text-[#E8A94A]"
                      strokeWidth={1.5}
                    />
                  </div>

                  <div className="my-12">
                    <div className="flex items-end justify-center gap-3">
                      <div className="h-32 w-12 -rotate-6 rounded-md border-l-4 border-[#E8A94A] bg-[#EFCB89] shadow-xl" />
                      <div className="h-44 w-14 rotate-3 rounded-md border-l-4 border-[#9ABBA4] bg-[#DCE9D9] shadow-xl" />
                      <div className="h-36 w-12 -rotate-3 rounded-md border-l-4 border-[#D48F48] bg-[#F4D9B5] shadow-xl" />
                      <div className="h-28 w-12 rotate-6 rounded-md border-l-4 border-[#B4D4BE] bg-[#A4C4AD] shadow-xl" />
                    </div>
                    <div className="mx-auto mt-3 h-3 w-64 max-w-full rounded-full bg-[#173D30]/70" />
                  </div>

                  <div className="border-t border-white/15 pt-5">
                    <p
                      className="text-2xl font-bold text-white"
                      style={headingFont}
                    >
                      Give stories a second life.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#DCE9DE]">
                      Your books deserve another reader.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-4 rounded-2xl border border-[#E7EEE5] bg-white px-5 py-4 shadow-xl sm:-left-8">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E7EEE5] text-[#276B56]">
                    <Heart size={20} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#193E32]">
                      Share Knowledge
                    </p>
                    <p className="text-xs text-[#718072]">
                      Inspire Learning
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="bg-[#FFF9EF] py-16 sm:py-20">
        <div className="rs-container mx-auto max-w-7xl px-5 text-center sm:px-8 lg:px-12">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#276B56]">
            Why Your Donation Matters
          </span>

          <h2
            className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight sm:text-4xl"
            style={headingFont}
          >
            Every Book Has More Than One Story to Tell
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-[#66766A]">
            A book does not stop being valuable when its first reader
            finishes it. Through Roshan Safha's book donation initiative,
            we aim to keep educational resources in circulation and
            connect them with people who need them.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="scroll-mt-24 bg-white py-20 sm:py-24"
      >
        <div className="rs-container mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#276B56]">
              Our Simple Process
            </span>

            <h2
              className="mt-4 text-3xl font-bold sm:text-4xl"
              style={headingFont}
            >
              Collect. Restore. Donate.
            </h2>

            <p className="mt-5 leading-8 text-[#66766A]">
              We believe useful books should keep reaching new readers.
              Here's how the donation process works.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {processSteps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="group relative rounded-[28px] border border-[#E3EAE0] bg-[#FAFCF8] p-8 transition hover:-translate-y-1 hover:border-[#B8CEBC] hover:shadow-xl"
                >
                  <div className="mb-7 flex items-center justify-between">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E7EEE5] text-[#276B56] transition group-hover:bg-[#193E32] group-hover:text-white">
                      <Icon size={29} strokeWidth={1.7} />
                    </div>

                    <span
                      className="text-4xl font-bold text-[#D6E2D7]"
                      style={headingFont}
                    >
                      {step.number}
                    </span>
                  </div>

                  <h3
                    className="text-2xl font-bold text-[#193E32]"
                    style={headingFont}
                  >
                    {step.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-[#68786C]">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ACCEPTED BOOKS */}
      <section className="bg-[#E7EEE5]/60 py-20 sm:py-24">
        <div className="rs-container mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#276B56]">
                Donation Guidelines
              </span>

              <h2
                className="mt-4 max-w-xl text-3xl font-bold leading-tight sm:text-4xl"
                style={headingFont}
              >
                What Kind of Books Can You Donate?
              </h2>

              <p className="mt-6 max-w-xl leading-8 text-[#66766A]">
                We welcome educational and reading materials that can
                support students and encourage a love for books.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {acceptedBooks.map((book) => (
                  <div key={book} className="flex items-start gap-3">
                    <CheckCircle2
                      size={19}
                      className="mt-0.5 shrink-0 text-[#276B56]"
                    />
                    <span className="text-sm leading-6 text-[#344D3D]">
                      {book}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-8 rounded-2xl border border-[#C8D9C8] bg-white/80 p-5 text-sm leading-7 text-[#5F7262]">
                <strong className="text-[#193E32]">A quick note:</strong>{" "}
                Please avoid donating books with missing pages, severe
                water damage, or unreadable content. Books needing minor
                repairs may still be suitable.
              </p>
            </div>

            <div className="relative">
              <div className="rounded-[32px] bg-[#193E32] p-8 text-white shadow-xl sm:p-10">
                <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#E8A94A]">
                  <BookOpen size={31} />
                </div>

                <h3
                  className="text-3xl font-bold leading-tight"
                  style={headingFont}
                >
                  Your Old Books Could Be Someone's Next Chapter.
                </h3>

                <p className="mt-5 leading-8 text-[#D7E5DB]">
                  Whether you have a few schoolbooks or an entire
                  collection, tell us what you'd like to contribute.
                  Our team can review the details and coordinate the
                  next steps with you.
                </p>

                <a
                  href="#donation-form"
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#E8A94A] px-6 py-3.5 text-sm font-bold text-[#193E32] transition hover:bg-[#F3BF6D]"
                >
                  Share Your Books
                  <ArrowRight size={17} />
                </a>
              </div>

              <div className="pointer-events-none absolute -bottom-4 -right-4 -z-10 h-full w-full rounded-[32px] border-2 border-[#B6CDB9]" />
            </div>
          </div>
        </div>
      </section>

      {/* BEFORE DONATING */}
      <section className="bg-white py-20 sm:py-24">
        <div className="rs-container mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-12 text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#276B56]">
              Before You Donate
            </span>

            <h2
              className="mt-4 text-3xl font-bold sm:text-4xl"
              style={headingFont}
            >
              A Few Helpful Things to Know
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {guidelines.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-[26px] border border-[#E6EBE3] bg-[#FFFDF8] p-7"
                >
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#E7EEE5] text-[#276B56]">
                    <Icon size={23} />
                  </div>

                  <h3 className="text-lg font-bold text-[#193E32]">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#69786D]">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-2xl border border-[#E3EAE0] bg-[#F7FAF4] p-5">
            <MapPin
              size={21}
              className="mt-0.5 shrink-0 text-[#276B56]"
            />

            <p className="text-sm leading-7 text-[#647468]">
              <strong className="text-[#193E32]">
                Drop-off information:
              </strong>{" "}
              Please submit the form below to coordinate a suitable
              handover location. Exact drop-off details and pickup
              availability will be confirmed by the Roshan Safha team.
            </p>
          </div>
        </div>
      </section>

      {/* DONATION FORM — SINGLE REUSABLE COMPONENT */}
      <section
        id="donation-form"
        className="scroll-mt-24 bg-[#FFF9EF] py-20 sm:py-24"
      >
        <div className="rs-container mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#276B56]">
              Make a Difference
            </span>

            <h2
              className="mt-4 text-3xl font-bold sm:text-4xl"
              style={headingFont}
            >
              Ready to Donate Your Books?
            </h2>

            <p className="mt-5 leading-8 text-[#66766A]">
              Fill out the form below to share the details of your
              donation. Our team will review your request and contact
              you about the next steps.
            </p>
          </div>

          <div className="mx-auto max-w-4xl overflow-hidden rounded-[32px] border border-[#E4E9DF] bg-white p-6 shadow-[0_20px_70px_rgba(25,62,50,0.08)] sm:p-10 lg:p-12">
            <DonationForm />
          </div>

          <div className="mx-auto mt-6 flex max-w-4xl items-start justify-center gap-2 text-center text-xs leading-6 text-[#758277]">
            <ShieldCheck size={16} className="mt-0.5 shrink-0" />
            <p>
              Please provide accurate contact details so we can
              coordinate your donation request.
            </p>
          </div>
        </div>
      </section>

      {/* AVAILABLE BOOKS CTA */}
      <section className="bg-[#193E32] py-16 sm:py-20">
        <div className="rs-container mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8A94A]">
                Explore More
              </span>

              <h2
                className="mt-4 text-3xl font-bold text-white sm:text-4xl"
                style={headingFont}
              >
                Looking for Books Instead?
              </h2>

              <p className="mt-4 leading-8 text-[#D7E5DB]">
                Explore our Available Books page to discover learning
                materials and see how you can request a book.
              </p>
            </div>

            <Link
              to="/programs/book-catalog"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#E8A94A] px-7 py-3.5 text-sm font-bold text-[#193E32] transition hover:bg-[#F3BF6D]"
            >
              Browse Available Books
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default BookDonationPage;