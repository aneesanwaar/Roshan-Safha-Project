

---

# *A Web-Based Intelligent Solution for Roshan Safha*


A **web-based intelligent management and decision-support system** developed for the non-profit organization **Roshan Safha**.
This system digitizes the organization’s operations and introduces **AI-powered analytics and assistance** to improve efficiency, transparency, and decision-making.

---

# Project Overview

Roshan Safha is a non-profit organization based in **Muzaffarabad, Azad Jammu & Kashmir, Pakistan**, working to promote educational opportunities for children through initiatives such as:

* Book donation drives
* Essay contests
* Educational workshops and events
* Volunteer programs

Currently, many organizational tasks such as **donation management, registrations, and data tracking** are handled manually. This project aims to build a **centralized web-based platform** to automate these processes and provide **intelligent insights using AI techniques**.

---

# Key Features

## 1. Public Website

Users can access information about the organization and its activities.

Features include:

* Organization overview
* Programs and initiatives
* Event and contest announcements
* Photo gallery
* Contact information

---

## 2. Online Forms & Data Management

The platform provides multiple online forms for user participation.

### Book Donation Form

Collects information about donated books.

Fields:

* Name
* Email
* Phone
* City / Area
* Number of books
* Types of books
* Drop-off or pickup preference
* Message

### Other Forms

* Volunteer sign-up
* Event registration
* Contest registration and essay submission
* Collaboration / partnership inquiries
* General contact form

All form submissions are stored securely in the database.

---

## 3. Admin Dashboard

A secure admin panel allows organization administrators to manage system data.

Capabilities include:

* View and manage form submissions
* Manage website content
* Upload and manage gallery images
* Publish announcements or blog posts
* Manage contests and events
* Export data for reporting

---

# AI-Powered Intelligent Features

This project introduces two intelligent components.

---

## 1. Donation & Participation Trend Analysis

This module analyzes historical NGO data to generate insights.

Functions:

* Analyze historical donation and registration data
* Identify monthly and seasonal participation trends
* Detect growth or decline in participation
* Predict future donation and participation levels

Techniques used:

* **Time-series analysis** for identifying patterns in chronological data
* **Linear regression** for predicting future values

Results are visualized through charts in the **admin dashboard**, helping the organization plan future campaigns and events.

---

## 2. Hybrid AI-Powered Chatbot

An intelligent chatbot assists users on the website.

Capabilities:

* Answers frequently asked questions
* Guides users to the correct pages and forms
* Provides quick information about donations, events, and volunteering

Architecture:

Hybrid approach combining:

1. **Rule-based responses** for fixed queries
2. **Natural Language Processing (NLP)** for flexible user input

NLP libraries used:

* NLTK
* spaCy

This ensures both **accuracy and flexibility**.

---

# Technology Stack

## Frontend

* React.js
* HTML5
* CSS3
* Tailwind CSS

## Backend

* Node.js
* Express.js

## Database

* MongoDB Atlas
* Mongoose ODM

## AI / Data Analysis

* Python
* Pandas
* Scikit-learn
* NLTK / spaCy

## Security

* Role-based authentication (JWT)
* express-validator
* Google reCAPTCHA

## Other Tools

* Git & GitHub (version control)
* Postman (API testing)
* Chart.js / Recharts (data visualization)
* Nodemailer
* Google Analytics (website analytics)

---

# System Architecture

The system follows a **three-layer architecture**:

1. **Frontend Layer**

   * React-based responsive interface
   * User interaction and form submission

2. **Backend Layer**

   * REST API built with Node.js and Express
   * Handles business logic and authentication

3. **Database Layer**

   * MongoDB Atlas cloud database
   * Stores user submissions and organizational data

4. **AI Module**

   * Python-based analysis and chatbot processing
   * Integrated with backend services

---

# Project Structure

```
roshan-safha-project
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── assets
│
├── backend
│   ├── config
│   ├── models
│   ├── controllers
│   ├── routes
│   ├── middleware
│   └── server.js
│
├── ai-module
│   ├── trend_analysis.py
│   └── chatbot.py
│
├── API_DOCS.md
│
└── README.md
```

---

# Installation & Setup

Clone the repository:

```
git clone https://github.com/aneesanwaar/A-Web-Based-Intelligent-Solution-for-Roshan-Safha.git
```

Navigate to the project directory:

```
cd A-Web-Based-Intelligent-Solution-for-Roshan-Safha
```

Install backend dependencies:

```
cd backend
npm install
```

Create a `.env` file and add:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
EMAIL_USER= @gmail.com
EMAIL_PASS=your_app_password
RECAPTCHA_SECRET=your_secret_key
NODE_ENV=development
```

Start the backend server:

```
node server.js
```

---

# Future Improvements

Possible enhancements include:

* Advanced predictive analytics
* AI-based recommendation system
* Mobile application integration


---

# Project Status

Currently under development as a **Final Year Project (FYP)**.

---

# Author

**Final Year Project**

**Anees Ul Haq 2022-UMDB-02774** 

**Syed Nafees Ahmed Gillani 2022-UMDB-02808** 

*Department of Computer Science and Information Technology*
*University of Azad Jammu and Kashmir, Muzaffarabad*

**Supervised by:** Dr. Adil Aslam Mir

Developed for **Roshan Safha**.

---

