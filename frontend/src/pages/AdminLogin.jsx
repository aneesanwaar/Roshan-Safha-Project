import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

import { loginAdmin } from "../services/api";
import logo from "../assets/logo.png";

function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ------------------------------------------------------------
  // ADMIN LOGIN
  // ------------------------------------------------------------

  const handleLogin = async (event) => {
    event.preventDefault();

    if (loading) return;

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await loginAdmin({
        email: normalizedEmail,
        password,
      });

      const data = response?.data;

      if (!data?.token || typeof data.token !== "string") {
        setError(
          "Authentication failed. The server did not return a valid session token."
        );
        return;
      }

      // Preserve the token key used by the existing Axios interceptor.
      localStorage.setItem("roshan_token", data.token);

      // Store administrator information for UI display.
      // Authorization must always be verified by the backend.
      const adminProfile = {
        id: data._id || null,
        name: data.name || "Administrator",
        email: data.email || normalizedEmail,
        role: data.role || "admin",
      };

      localStorage.setItem(
        "roshan_admin",
        JSON.stringify(adminProfile)
      );

      // Clear password from component state after successful login.
      setPassword("");

      // Redirect to the originally requested admin page if available.
      const requestedDestination = location.state?.from;

      const destination =
        typeof requestedDestination === "string" &&
        requestedDestination.startsWith("/admin") &&
        !requestedDestination.startsWith("/admin/login")
          ? requestedDestination
          : "/admin";

      navigate(destination, { replace: true });
    } catch (err) {
      console.error("Admin login failed:", err);

      const serverMessage =
        err.response?.data?.error ||
        err.response?.data?.message;

      if (err.response?.status === 401) {
        setError("Invalid email or password. Please try again.");
      } else if (err.response?.status === 403) {
        setError(
          serverMessage ||
            "This account is not authorized to access the admin portal."
        );
      } else if (err.response?.status === 400) {
        setError(
          serverMessage ||
            "Please check your email address and password."
        );
      } else if (!err.response) {
        setError(
          "Unable to connect to the server. Please check your connection and try again."
        );
      } else {
        setError(
          "Something went wrong while signing in. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------------------------------------
  // UI
  // ------------------------------------------------------------

  return (
    <div
      className="
        relative flex min-h-screen items-center justify-center
        overflow-x-hidden bg-[#FFF9EF]
        px-4 py-5
        sm:px-6 sm:py-6
        lg:h-screen lg:min-h-[600px] lg:py-5
      "
    >
      {/* Decorative background */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -left-24 -top-24
          h-72 w-72 rounded-full bg-[#E7EEE5]
          opacity-80 blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute -bottom-28 -right-20
          h-80 w-80 rounded-full bg-[#E8A94A]/15 blur-3xl
        "
      />

      {/* Main login card */}

      <div
        className="
          relative z-10 grid w-full max-w-5xl
          overflow-hidden rounded-[26px]
          border border-[#193E32]/10 bg-white
          shadow-[0_22px_70px_rgba(25,62,50,0.12)]
          lg:grid-cols-2
          lg:max-h-[calc(100vh-40px)]
          lg:min-h-[520px]
        "
      >
        {/* ======================================================
            LEFT PANEL — BRANDING
        ====================================================== */}

        <section
          className="
            relative hidden flex-col justify-between
            overflow-hidden bg-[#193E32]
            px-9 py-8 text-white
            lg:flex
            xl:px-11 xl:py-9
          "
        >
          {/* Decorative circle */}

          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute -right-28 -top-32
              h-80 w-80 rounded-full
              border-[42px] border-white/5
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none absolute -bottom-32 -left-20
              h-80 w-80 rounded-full
              bg-[#276B56]/40 blur-3xl
            "
          />

          {/* Official Roshan Safha branding */}

          <div className="relative z-10 flex items-center gap-3.5">
            <div
              className="
                flex h-14 w-14 shrink-0 items-center justify-center
                overflow-hidden rounded-2xl
                bg-white/95 p-1.5
                shadow-[0_6px_18px_rgba(0,0,0,0.12)]
              "
            >
              <img
                src={logo}
                alt="Roshan Safha logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="min-w-0">
              <h1
                className="
                  text-[23px] font-black leading-tight
                  tracking-tight text-white
                "
              >
                Roshan Safha
              </h1>

              <p
                className="
                  mt-1 text-[10px] font-bold uppercase
                  tracking-[0.18em] text-[#E8A94A]
                "
              >
                Administration Portal
              </p>
            </div>
          </div>

          {/* Welcome message — moved upward and simplified */}

          <div className="relative z-10 max-w-md space-y-5">
            <div className="space-y-3">
              <div
                className="
                  mb-1 h-1 w-12 rounded-full bg-[#E8A94A]
                "
              />

              <h2
                className="
                  text-[33px] font-black leading-[1.15]
                  tracking-tight text-white
                  xl:text-[38px]
                "
              >
                Every page brings a brighter tomorrow.
              </h2>

              <p
                className="
                  max-w-sm text-[13px] leading-6
                  text-white/70
                "
              >
                Manage book donations, student participation,
                community programs, and the impact we create
                together.
              </p>
            </div>

            {/* Security information */}

            <div
              className="
                flex items-center gap-3
                rounded-2xl border border-white/10
                bg-white/10 px-4 py-3.5
              "
            >
              <ShieldCheck
                size={21}
                className="shrink-0 text-[#E8A94A]"
              />

              <div>
                <p className="text-[13px] font-semibold text-white">
                  Authorized access only
                </p>

                <p className="mt-1 text-[11px] leading-5 text-white/60">
                  This portal is reserved for approved team members.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}

          <p className="relative z-10 text-[11px] text-white/40">
            © {new Date().getFullYear()} Roshan Safha.
            All rights reserved.
          </p>
        </section>

        {/* ======================================================
            RIGHT PANEL — LOGIN FORM
        ====================================================== */}

        <section
          className="
            flex flex-col justify-center
            px-6 py-8
            sm:px-10 sm:py-10
            lg:px-10 lg:py-7
            xl:px-12
          "
        >
          {/* Mobile branding */}

          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <div
              className="
                flex h-12 w-12 shrink-0 items-center justify-center
                overflow-hidden rounded-xl
                border border-[#193E32]/10 bg-white p-1
                shadow-sm
              "
            >
              <img
                src={logo}
                alt="Roshan Safha logo"
                className="h-full w-full object-contain"
              />
            </div>

            <div>
              <h1
                className="
                  text-xl font-black tracking-tight
                  text-[#193E32]
                "
              >
                Roshan Safha
              </h1>

              <p
                className="
                  text-[10px] font-bold uppercase
                  tracking-[0.14em] text-[#276B56]
                "
              >
                Administration Portal
              </p>
            </div>
          </div>

          {/* Header */}

          <div className="mb-6">
            <div
              className="
                mb-3 inline-flex items-center gap-2
                rounded-full border border-[#276B56]/15
                bg-[#E7EEE5] px-3 py-1.5
              "
            >
              <CheckCircle2
                size={14}
                className="text-[#276B56]"
              />

              <span
                className="
                  text-[10px] font-bold tracking-wide
                  text-[#276B56]
                "
              >
                SECURE STAFF ACCESS
              </span>
            </div>

            <h2
              className="
                text-[29px] font-black leading-tight
                tracking-tight text-[#193E32]
                sm:text-[32px]
              "
            >
              Welcome back
            </h2>

            <p className="mt-2 text-[13px] leading-6 text-slate-500">
              Sign in with your authorized administrator account
              to continue.
            </p>
          </div>

          {/* Error alert */}

          {error && (
            <div
              role="alert"
              className="
                mb-5 flex items-start gap-3
                rounded-xl border border-red-200
                bg-red-50 px-4 py-3
                text-red-700
              "
            >
              <AlertCircle
                size={17}
                className="mt-0.5 shrink-0"
              />

              <p className="text-[12px] leading-5">
                {error}
              </p>
            </div>
          )}

          {/* Login form */}

          <form
            onSubmit={handleLogin}
            className="space-y-4"
          >
            {/* Email */}

            <div>
              <label
                htmlFor="admin-email"
                className="
                  mb-1.5 block text-[13px]
                  font-bold text-[#193E32]
                "
              >
                Official email
              </label>

              <div className="relative">
                <Mail
                  size={17}
                  className="
                    pointer-events-none absolute
                    left-4 top-1/2 -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  id="admin-email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  maxLength={254}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your official email"
                  disabled={loading}
                  className="
                    w-full rounded-xl
                    border border-slate-200
                    bg-slate-50
                    py-3 pl-11 pr-4
                    text-[13px] text-[#193E32]
                    outline-none transition
                    placeholder:text-slate-400
                    focus:border-[#276B56]
                    focus:bg-white
                    focus:ring-4 focus:ring-[#276B56]/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <label
                htmlFor="admin-password"
                className="
                  mb-1.5 block text-[13px]
                  font-bold text-[#193E32]
                "
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  size={17}
                  className="
                    pointer-events-none absolute
                    left-4 top-1/2 -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your password"
                  disabled={loading}
                  className="
                    w-full rounded-xl
                    border border-slate-200
                    bg-slate-50
                    py-3 pl-11 pr-12
                    text-[13px] text-[#193E32]
                    outline-none transition
                    placeholder:text-slate-400
                    focus:border-[#276B56]
                    focus:bg-white
                    focus:ring-4 focus:ring-[#276B56]/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />

                {/* Show / hide password */}

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  aria-pressed={showPassword}
                  title={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="
                    absolute right-2.5 top-1/2
                    flex h-9 w-9
                    -translate-y-1/2
                    items-center justify-center
                    rounded-lg text-slate-400
                    transition
                    hover:bg-[#E7EEE5]
                    hover:text-[#193E32]
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#276B56]
                    disabled:opacity-50
                  "
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit button */}

            <button
              type="submit"
              disabled={loading}
              className="
                group flex w-full items-center
                justify-center gap-3
                rounded-xl bg-[#193E32]
                px-5 py-3.5
                text-[13px] font-bold text-white
                shadow-[0_8px_20px_rgba(25,62,50,0.15)]
                transition
                hover:bg-[#276B56]
                hover:shadow-[0_12px_25px_rgba(25,62,50,0.2)]
                focus-visible:outline-none
                focus-visible:ring-4
                focus-visible:ring-[#276B56]/25
                disabled:cursor-not-allowed
                disabled:opacity-65
              "
            >
              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>

                  <ArrowRight
                    size={17}
                    className="
                      text-[#E8A94A]
                      transition-transform
                      group-hover:translate-x-1
                    "
                  />
                </>
              )}
            </button>
          </form>

          {/* Footer security notice */}

          <div className="mt-6 border-t border-slate-100 pt-4">
            <div className="flex items-start gap-2.5">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-[#276B56]"
              />

              <p className="text-[11px] leading-5 text-slate-500">
                This is a restricted administrative area.
                Access is limited to authorized Roshan Safha
                team members.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminLogin;