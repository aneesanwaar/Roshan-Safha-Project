import React from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

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

/**
 * Checks whether a token is currently stored.
 *
 * Note:
 * This is a frontend navigation check only.
 * Backend middleware must verify JWT authenticity,
 * expiration, and administrative permissions.
 */
const hasStoredAdminToken = () => {
  try {
    return Boolean(localStorage.getItem("roshan_token"));
  } catch {
    return false;
  }
};

/**
 * Protected Admin Layout
 *
 * Prevents visitors without a stored token from
 * navigating directly to the admin dashboard.
 */
function ProtectedAdminRoute() {
  const location = useLocation();

  if (!hasStoredAdminToken()) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname + location.search,
        }}
      />
    );
  }

  return <Outlet />;
}

/**
 * Admin Login Route
 *
 * If a token is already stored, send the visitor
 * to the admin dashboard.
 */
function AdminLoginRoute() {
  const location = useLocation();

  if (hasStoredAdminToken()) {
    const requestedDestination = location.state?.from;

    const destination =
      typeof requestedDestination === "string" &&
      requestedDestination.startsWith("/admin") &&
      !requestedDestination.startsWith("/admin/login")
        ? requestedDestination
        : "/admin";

    return <Navigate to={destination} replace />;
  }

  return <AdminLogin />;
}

function App() {
  const location = useLocation();

  // Keep public components hidden in the admin portal.
  const isAdminRoute =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/");

  return (
    <div className="flex min-h-screen flex-col">
      {/* Reset scroll position on navigation */}
      <ScrollToTop />

      {/* Public navigation */}
      {!isAdminRoute && <Navbar />}

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
          <Route
            path="/gallery"
            element={<GalleryPage />}
          />

          <Route
            path="/announcements"
            element={<AnnouncementsPage />}
          />

          <Route
            path="/get-involved"
            element={<GetInvolvedPage />}
          />

          <Route
            path="/contact"
            element={<ContactPage />}
          />

          {/* Admin login */}
          <Route
            path="/admin/login"
            element={<AdminLoginRoute />}
          />

          {/* Protected administration routes */}
          <Route element={<ProtectedAdminRoute />}>
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />
          </Route>
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