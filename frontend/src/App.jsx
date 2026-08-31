import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ChatWidget from './components/common/ChatWidget';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BookDonationPage from './pages/programs/BookDonationPage';
import BookCatalogPage from './pages/programs/BookCatalogPage';
import EssayContestsPage from './pages/programs/EssayContestsPage';
import SummerCirclePage from './pages/programs/SummerCirclePage';
import GalleryPage from './pages/GalleryPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import GetInvolvedPage from './pages/GetInvolvedPage';
import ContactPage from './pages/ContactPage';

// Admin Portal
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans selection:bg-[#E8A94A] selection:text-slate-950">
      {!isAdminRoute && <Navbar />}

      <div className="grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/programs/donate-books" element={<BookDonationPage />} />
          <Route path="/programs/book-catalog" element={<BookCatalogPage />} />
          <Route path="/programs/essays" element={<EssayContestsPage />} />
          <Route path="/programs/summer-circle" element={<SummerCirclePage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/get-involved" element={<GetInvolvedPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <ChatWidget />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;