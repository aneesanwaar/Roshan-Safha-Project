# Roshan Safha — Web-Based Intelligent Solution
### Comprehensive System Architecture & Development Log

**Organization:** Roshan Safha  
**Tagline:** *“Roshan Safha-because second chances are for everyone and everything.”*  
**Location:** Muzaffarabad, Azad Jammu & Kashmir, Pakistan  
**Founding Year:** 2025  
**Contact:** roshansafha@gmail.com | +92 300 5966967  

---

## 1. Project Overview & Objectives
Roshan Safha is a community-driven literacy platform designed to establish circular educational resources. The platform facilitates book donation, restoration, and class-wise distribution, hosts youth essay competitions, conducts experiential SDG-based workshops, and integrates predictive AI analytics to drive campaign decisions.

---

## 2. Implemented Frontend Architecture

### Technology Stack
* **UI Library:** React 19 (Vite Build System)
* **Styling Engine:** Tailwind CSS v4
* **Icons:** Lucide React & Custom SVG Renderers
* **Routing:** React Router DOM (v6+)
* **State & Network Simulation:** Asynchronous Service API Layer with fallback Mock Engine

---

## 3. Pages & Features Implemented

### A. Navigation & Branding (`Navbar.jsx` & `Footer.jsx`)
* **Header:** Integrated brand logo asset, top navigation links, hover-driven Programs dropdown, mobile hamburger navigation drawer, and direct contest action CTA.
* **Footer:** Comprehensive site directory, official contact channels, social media integrations (Instagram, LinkedIn), exact organizational tagline, and copyright notice.

### B. Home Landing Page (`Home.jsx`)
* **Hero Banner:** Official mission statements, dynamic badge, and a responsive CTA grid (2×2 layout on mobile, uniform 4-column row on desktop).
* **Impact Metrics Counter:** Displays books donated/restored, children reached, contests held, and active volunteers.
* **Active Contest Spotlight:** Live highlights for Junior and Senior categories with submission triggers.
* **Latest Press Desk:** Previews top 3 recent announcements.
* **Instagram Story Wall:** 6-post simulated community impact feed.

### C. Core Programs Ecosystem (`/programs/*`)
* **Book Donations & Restored Catalog (`BookDonationsPage.jsx`):**
  * Step-by-step lifecycle: Collect $\rightarrow$ Restore $\rightarrow$ Deliver.
  * Interactive inventory catalog filterable by Class (e.g., Class 5, 9, 10, 11) and Subject (Mathematics, Science, English, etc.).
  * Real-time stock status badge (Available / Out of Stock).
  * Interactive modal form to request specific catalog books.
  * General Book & Funds Donation pledge form.
* **Essay Contests & Hall of Fame (`EssayContestsPage.jsx`):**
  * Junior (Under 16) and Senior (16+) themes, rules, and award specifications.
  * Direct essay submission upload form (PDF/Word validation + author details).
  * Hall of Fame archive showcasing past contest winners and publication titles.
* **SDGs Summer Circle & Events (`SummerCirclePage.jsx`):**
  * Focus areas covering SDG 4 (Quality Education), Paper Upcycling, and Community Fairs.
  * Workshop and event attendee reservation form.

### D. Community & Information Pages
* **About Us (`AboutPage.jsx`):** Founder profile (Aamna Saleem Khan), origin story, headquarters data, and United Nations SDG alignment breakdown (SDG 4, 10, 12).
* **Get Involved (`GetInvolvedPage.jsx`):** Tabbed interface for Volunteer Sign-Ups and Institutional Collaboration inquiries.
* **Gallery & Impact Media (`GalleryPage.jsx`):** Lightbox modal preview with category filters (*Book Restoration*, *Donation Events*, *Contest Prize Distributions*, *Workshops*, *Volunteers in Action*, *Children with Books*, *Collaborations*).
* **Announcements Desk (`AnnouncementsPage.jsx`):** Keyword search bar, category filtering (*Winner Announcements*, *Event Recaps*, *Impact Stories*, *Collaborations*, *General Updates*), and timestamped post feed.
* **Contact Us (`ContactPage.jsx`):** Operational hours, direct communication info, and General Contact form.

---

## 4. Forms & Data Intake Specification
Every intake form includes client-side validation, error handling, loading states, and mock API response handling:
1. **Book Donation / Funds Request Form**
2. **Contest Registration & Essay Upload Form**
3. **Event Registration Form**
4. **Volunteer Sign-Up Form**
5. **Collaboration / Partnership Inquiry Form**
6. **General Contact Inquiry Form**
7. **Direct Book Request Modal Form**

---

## 5. Upcoming Implementation Milestones
* [ ] **Admin Portal (`/admin`):** Submissions viewer, status toggles, image/post upload forms, CSV export, and CMS controls.
* [ ] **AI Feature 1:** Linear Regression & time-series trend analysis for donations and participation patterns in the admin panel.
* [ ] **AI Feature 2:** Floating hybrid AI chatbot (bilingual English/Urdu with intent-matching and quick replies).
* [ ] **Backend Integration:** Node.js/Express REST API with MongoDB persistence and Multer/Cloudinary document storage.