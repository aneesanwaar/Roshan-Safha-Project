#  A Web-Based Intelligent Solution for Roshan Safha

**A full-stack literacy management and decision-support platform for Roshan Safha, a non-profit organization in Muzaffarabad, Azad Jammu & Kashmir, Pakistan.**

> **Project status:** Final Year Project (FYP) — active development and pre-defense testing. Some features and production-security improvements remain in progress.

## Overview

Roshan Safha supports educational access through book donation drives, essay competitions, workshops, and volunteer initiatives. This project brings public engagement, book circulation, submissions, website content management, and administrative reporting into one web-based system.

The platform combines a responsive public website, an authenticated administrative dashboard, MongoDB-backed workflows, and a separate Python analytics service. Its aim is to reduce manual record-keeping and help organizers make informed decisions.

## Core Features

### Public Website

- Organization information, programs, announcements, and community initiatives.
- Photo gallery with album filters and an image lightbox.
- Online forms for book donations, volunteering, event registration, essay submissions, partnerships, and contact inquiries.
- Book-request workflows and information about available educational resources.
- Responsive layouts designed for desktop and mobile visitors.
- Bilingual (English/Urdu) website assistant for common questions.

### Administration

- Authenticated dashboard with collapsible navigation and overview statistics.
- Book inventory and book-request management.
- Submission review, status management, search, pagination, and export.
- Announcements management, including draft, scheduled, and published content.
- Contest settings and winners archive management.
- Gallery uploads and image management.
- Website content and menu administration.
- AI-assisted trend analysis and reporting views.

### Analytics and Website Assistant

**Trend analysis:** A Python/Flask service supports analytics and forecasting workflows using historical organizational data and machine-learning techniques such as linear regression. The administrative interface presents insights to support planning and resource allocation.

**Website assistant:** The current chat widget uses predefined responses and keyword-based matching to answer common questions about donations, volunteering, contests, and programs. A more capable NLP-backed assistant is a **planned enhancement**; the current widget should not be described as a generative AI chatbot.

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, JavaScript, Lucide icons |
| Backend | Node.js, Express.js, REST APIs |
| Database | MongoDB Atlas, Mongoose |
| Analytics service | Python, Flask, Pandas, Scikit-learn |
| Authentication | JWT-based administrative authentication |
| Media | Cloudinary for managed image uploads |
| Development | Git, GitHub, Postman |

Some tools named in the original project proposal, including NLTK, spaCy, Google Analytics, and particular charting or email libraries, should be considered **implementation-dependent** until verified against the installed dependencies.

## System Architecture

```text
                   Public Visitors / Administrators
                                |
                                v
                      React + Vite Frontend
                        (localhost:5173)
                                |
                      REST API requests
                                v
                     Node.js / Express API
                        (localhost:5000)
                         /             \
                        v               v
                  MongoDB Atlas      Media Storage
                  (application data)  (Cloudinary)
                         
                  Python / Flask Analytics
                        (localhost:8000)
                  (connected analytics workflow)
```

The React frontend handles presentation and user interaction. The Express backend handles application workflows, persistence, and authentication. MongoDB Atlas stores organizational records. A separate Flask service supports analytical functionality.

## Repository Structure

The following is a **high-level layout**; individual filenames and subfolders may vary as development continues.

```text
.
├── frontend/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── admin/
│       │   └── forms/
│       ├── hooks/
│       ├── pages/
│       └── services/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── ai_service/
│   ├── app.py
│   └── requirements.txt
├── API_DOCS.md             # If present in your checkout
└── README.md
```

## Local Development

### Prerequisites

- Node.js and npm
- Python and pip
- A MongoDB Atlas connection string
- Credentials for any external services enabled in your configuration

### 1. Clone the repository

```bash
git clone https://github.com/aneesanwaar/A-Web-Based-Intelligent-Solution-for-Roshan-Safha.git
cd A-Web-Based-Intelligent-Solution-for-Roshan-Safha
```

### 2. Start the backend

```bash
cd backend
npm install
```

Create `backend/.env` using the environment variables expected by your backend. The following are **illustrative names from the original project documentation**; check the source code for the exact required keys:

```dotenv
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=replace_with_a_long_random_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
RECAPTCHA_SECRET=your_recaptcha_secret
```

Add any Cloudinary, frontend-origin, or other provider-specific variables required by your installed version. **Never commit `.env` files or real credentials.**

```bash
node server.js
```

The API is expected to run at `http://localhost:5000` in the current development setup.

### 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite normally serves the frontend at `http://localhost:5173`. Configure its API base URL according to `frontend/src/services/api` and your environment setup.

### 4. Start the analytics service

Open a third terminal:

```bash
cd ai_service
python -m venv .venv
```

Activate the virtual environment:

```bash
# Windows PowerShell
.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the service using the entry point defined in `ai_service/app.py` (commonly `python app.py`):

```bash
python app.py
```

The development configuration uses port `8000` for the analytics service. If your Flask entry point specifies a different port or startup command, follow that configuration instead.

## Typical Workflows

1. **Book donation:** A visitor submits donation details; administrators review the record and manage the associated inventory workflow.
2. **Book request:** A request is recorded and processed through the administration interface, with inventory updates where applicable.
3. **Essay competition:** Visitors review contest information and submit entries; administrators manage competition settings and winner records.
4. **Announcements and gallery:** Administrators publish updates and manage images that appear on the public website.
5. **Reporting:** Administrators inspect operational statistics and analytics to support planning.

## Security and Privacy

The project uses JWT-based admin authentication and includes form-validation and anti-abuse mechanisms in selected workflows. **It is not yet presented as production-hardened.** Before public deployment, complete a dedicated review of:

- Authentication, authorization, and administrator permissions.
- Input validation, rate limiting, and upload restrictions.
- Secret management, CORS, HTTPS, and secure configuration.
- Data retention, backup/recovery, logging, and monitoring.
- Privacy disclosures and consent for collected personal information.

Do not use real personal data for public demonstrations unless authorized.

## Current Status and Roadmap

**Implemented or under active integration:** public pages and forms, gallery, book management, submissions, admin content tools, contests/winners management, dashboard views, and Python-based analytics workflows.

**Planned or pending verification:** chatbot NLP enhancements, remaining cross-page polish, comprehensive end-to-end testing, production security review, deployment readiness, and potential future recommendation features.

This repository is an academic Final Year Project. Feature availability may change during development; the running application and source code are the authoritative references.

## Academic Information

**Project:** A Web-Based Intelligent Solution for Roshan Safha  
**Department:** Computer Science and Information Technology  
**University:** University of Azad Jammu and Kashmir, Muzaffarabad  
**Client organization:** Roshan Safha

### Team

- **Anees Ul Haq** — `2022-UMDB-02774`
- **Syed Nafees Ahmed Gillani** — `2022-UMDB-02808`

**Supervisor:** Dr. Adil Aslam Mir

---

*Developed as a Final Year Project to support Roshan Safha's literacy and educational initiatives.*
