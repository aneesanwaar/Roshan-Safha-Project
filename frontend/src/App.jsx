import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ChatWidget from './components/common/ChatWidget';
import AuthGuard from './components/common/AuthGuard';

// Top-Level Pages
import Home from './pages/Home';
import AboutPage from './pages/AboutPage';
import GalleryPage from './pages/GalleryPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import GetInvolvedPage from './pages/GetInvolvedPage';
import ContactPage from './pages/ContactPage';
import FormsPage from './pages/FormsPage';

// Programs Subfolder Pages
import BookDonationPage from './pages/programs/BookDonationPage';
import BookCatalogPage from './pages/programs/BookCatalogPage';
import EssayContestsPage from './pages/programs/EssayContestsPage';
import SummerCirclePage from './pages/programs/SummerCirclePage';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Main Navigation Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Separated Book Portals */}
            <Route path="/programs/donate-books" element={<BookDonationPage />} />
            <Route path="/programs/book-catalog" element={<BookCatalogPage />} />
            <Route path="/programs/donations" element={<Navigate to="/programs/donate-books" replace />} />

            {/* Other Program Pages */}
            <Route path="/programs/essays" element={<EssayContestsPage />} />
            <Route path="/programs/summer-circle" element={<SummerCirclePage />} />

            {/* Community & Interactive Pages */}
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/get-involved" element={<GetInvolvedPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/forms" element={<FormsPage />} />

            {/* Admin Authentication & Management */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin" 
              element={
                <AuthGuard>
                  <AdminDashboard />
                </AuthGuard>
              } 
            />

            {/* Catch-all Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
        <ChatWidget />
      </div>
    </Router>
  );
}

export default App;