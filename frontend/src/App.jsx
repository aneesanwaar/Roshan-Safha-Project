import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import BookDonationsPage from './pages/programs/BookDonationsPage';
import EssayContestsPage from './pages/programs/EssayContestsPage';
import SummerCirclePage from './pages/programs/SummerCirclePage';
import GalleryPage from './pages/GalleryPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import GetInvolvedPage from './pages/GetInvolvedPage';
import ContactPage from './pages/ContactPage';
import FormsPage from './pages/FormsPage';

function AdminPlaceholder() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4 text-center">
      <h2 className="text-2xl font-bold">Admin Portal</h2>
      <p className="text-slate-500 text-sm mt-2">Connecting Admin CMS & AI Trend Analytics next...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/programs/donations" element={<BookDonationsPage />} />
            <Route path="/programs/essays" element={<EssayContestsPage />} />
            <Route path="/programs/summer-circle" element={<SummerCirclePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/get-involved" element={<GetInvolvedPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/forms" element={<FormsPage />} />
            <Route path="/admin" element={<AdminPlaceholder />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;