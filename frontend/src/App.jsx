import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Common Components
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import ChatWidget from "./components/common/ChatWidget";
import ScrollToTop from "./components/common/ScrollToTop";

// Public Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import BookDonationPage from "./pages/programs/BookDonationPage";
import BookCatalogPage from "./pages/programs/BookCatalogPage";
import EssayContestsPage from "./pages/programs/EssayContestsPage";
import SummerCirclePage from "./pages/programs/SummerCirclePage";
import GalleryPage from "./pages/GalleryPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import GetInvolvedPage from "./pages/GetInvolvedPage";
import ContactPage from "./pages/ContactPage";

// Admin Portal
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

function App() {
  const location = useLocation();

  // Identify admin routes so public components
  // remain hidden inside the administration portal.
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Reset scroll position when navigating between pages */}
      <ScrollToTop />

      {/* Public navigation */}
      {!isAdminRoute && <Navbar />}

      {/* Application routes */}
      <main className="flex-grow">
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          {/* About */}
          <Route path="/about" element={<AboutPage />} />

          {/* Programs */}
          <Route
            path="/programs/donate-books"
            element={<BookDonationPage />}
          />

          <Route
            path="/programs/book-catalog"
            element={<BookCatalogPage />}
          />

          <Route
            path="/programs/essays"
            element={<EssayContestsPage />}
          />

          <Route
            path="/programs/summer-circle"
            element={<SummerCirclePage />}
          />

          {/* Media and community */}
          <Route path="/gallery" element={<GalleryPage />} />

          <Route
            path="/announcements"
            element={<AnnouncementsPage />}
          />

          <Route
            path="/get-involved"
            element={<GetInvolvedPage />}
          />

          <Route path="/contact" element={<ContactPage />} />

          {/* Administration */}
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin/dashboard"
            element={<AdminDashboard />}
          />
        </Routes>
      </main>

      {/* Public footer */}
      {!isAdminRoute && <Footer />}

      {/* Public chatbot */}
      {!isAdminRoute && <ChatWidget />}
    </div>
  );
}

export default App;