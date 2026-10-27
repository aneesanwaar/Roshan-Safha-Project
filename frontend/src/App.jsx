import React, { useEffect, useState } from "react";
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

// Existing Axios instance with the API base URL and JWT interceptor.
import API from "./services/api";

/**
 * Remove the administrator's locally stored session.
 */
const clearAdminSession = () => {
  try {
    localStorage.removeItem("roshan_token");
    localStorage.removeItem("roshan_admin");
  } catch (error) {
    console.warn("Unable to clear administrator session:", error);
  }
};

/**
 * Decode the JWT payload without verifying its signature.
 *
 * Signature and account verification happen on the backend.
 */
const decodeJwtPayload = (token) => {
  try {
    const parts = token.split(".");

    if (parts.length !== 3 || !parts[1]) {
      return null;
    }

    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

/**
 * Check whether a token exists, has the expected structure,
 * and has not expired.
 *
 * This is a preliminary check, not authentication.
 */
const hasUsableAdminToken = () => {
  try {
    const token = localStorage.getItem("roshan_token");

    if (!token) {
      return false;
    }

    const payload = decodeJwtPayload(token);

    if (
      !payload ||
      typeof payload.exp !== "number" ||
      !Number.isFinite(payload.exp)
    ) {
      clearAdminSession();
      return false;
    }

    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

    if (payload.exp <= currentTimeInSeconds) {
      clearAdminSession();
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

/**
 * Loading screen displayed while verifying the admin session.
 */
function AdminSessionLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9EF] px-4">
      <div className="w-12 h-12 border-4 border-[#193E32]/20 border-t-[#193E32] rounded-full animate-spin" />

      <h2 className="mt-6 text-lg font-bold text-[#193E32]">
        Verifying administrator session
      </h2>

      <p className="mt-2 text-sm text-slate-500 text-center">
        Please wait while we securely connect to Roshan Safha.
      </p>
    </div>
  );
}

/**
 * Protected Admin Route
 *
 * Verifies the stored JWT against GET /api/auth/me before
 * allowing the administrator dashboard to render.
 */
function ProtectedAdminRoute() {
  const location = useLocation();

  const [session, setSession] = useState({
    status: "checking",
    token: null,
  });

  const token = (() => {
    try {
      return localStorage.getItem("roshan_token");
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    let cancelled = false;

    if (!hasUsableAdminToken()) {
      setSession({
        status: "unauthorized",
        token: null,
      });
      return;
    }

    setSession({
      status: "checking",
      token,
    });

    const verifySession = async () => {
      try {
        const response = await API.get("/auth/me");

        if (
          response.data?.success !== true ||
          !response.data?.admin
        ) {
          throw new Error("Invalid administrator profile response.");
        }

        if (cancelled) {
          return;
        }

        // Ensure this request still belongs to the current session.
        if (localStorage.getItem("roshan_token") !== token) {
          return;
        }

        const admin = response.data.admin;

        localStorage.setItem(
          "roshan_admin",
          JSON.stringify({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
          })
        );

        setSession({
          status: "authorized",
          token,
        });
      } catch (error) {
        if (cancelled) {
          return;
        }

        const currentToken = localStorage.getItem("roshan_token");

        if (currentToken !== token) {
          return;
        }

        // An explicit rejection means the stored session is invalid.
        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          clearAdminSession();

          setSession({
            status: "unauthorized",
            token: null,
          });

          return;
        }

        // Network/server errors are not proof that the JWT is invalid.
        // Do not expose the dashboard without backend verification.
        setSession({
          status: "error",
          token,
        });
      }
    };

    verifySession();

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (!token || !hasUsableAdminToken()) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (
    session.status === "checking" ||
    session.token !== token
  ) {
    return <AdminSessionLoading />;
  }

  if (session.status === "unauthorized") {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (session.status === "error") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9EF] px-4 text-center">
        <h2 className="text-xl font-bold text-[#193E32]">
          Unable to verify your session
        </h2>

        <p className="mt-3 text-sm text-slate-600 max-w-md">
          The authentication service is temporarily unavailable.
          Your session has not been deleted.
        </p>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-[#193E32] text-white rounded-xl text-sm font-bold hover:bg-[#276B56] transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  return <Outlet />;
}

/**
 * Admin Login Route
 *
 * Visitors with a locally usable token are directed to
 * the protected route, where the backend verifies it.
 */
function AdminLoginRoute() {
  const location = useLocation();

  if (hasUsableAdminToken()) {
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

  const isAdminRoute =
    location.pathname === "/admin" ||
    location.pathname.startsWith("/admin/");

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />

      {!isAdminRoute && <Navbar />}

      <main className="flex-grow">
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<HomePage />} />

          <Route path="/about" element={<AboutPage />} />

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

      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <ChatWidget />}
    </div>
  );
}

export default App;