import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ChatWidget from './components/common/ChatWidget';
import AuthGuard from './components/common/AuthGuard';
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
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 relative">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Visitor Routes */}
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

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Route */}
            <Route 
              path="/admin" 
              element={
                <AuthGuard>
                  <AdminDashboard />
                </AuthGuard>
              } 
            />
          </Routes>
        </main>
        <ChatWidget />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;