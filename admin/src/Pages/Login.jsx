import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Lock, Mail, ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setSubmitting(true);
    setError("");
    try {
      await login(email.trim(), password);
      toast.success("Welcome back");
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.message || err.message || "Couldn't sign in. Check your credentials.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-5 font-body"
      style={{ backgroundColor: "var(--color-evergreen)" }}
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
            style={{ backgroundColor: "var(--color-hunter-green)" }}
          >
            <ShieldCheck size={22} style={{ color: "var(--color-cwhite)" }} />
          </div>
          <h1 className="font-display text-2xl tracking-tight" style={{ color: "var(--color-cwhite)" }}>
            Commerza Admin
          </h1>
          <p className="text-xs mt-1" style={{ color: "rgba(253,253,255,0.55)" }}>
            Sign in to manage the store
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl p-6 space-y-4"
          style={{ backgroundColor: "var(--color-cwhite)" }}
        >
          {error && (
            <div
              className="text-xs rounded-md px-3 py-2"
              style={{ backgroundColor: "rgba(180,60,50,0.1)", color: "#b43c32" }}
            >
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--color-evergreen)" }}>
              Email
            </label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-olive-bark)" }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@commerza.com"
                className="w-full rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none border focus:ring-2"
                style={{ borderColor: "rgba(194,168,120,0.35)", color: "var(--color-evergreen)" }}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium block mb-1.5" style={{ color: "var(--color-evergreen)" }}>
              Password
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-olive-bark)" }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none border focus:ring-2"
                style={{ borderColor: "rgba(194,168,120,0.35)", color: "var(--color-evergreen)" }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-transform active:scale-[0.99] disabled:opacity-60"
            style={{ backgroundColor: "var(--color-hunter-green)", color: "var(--color-cwhite)" }}
          >
            {submitting ? <Loader2 size={15} className="animate-spin" /> : null}
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-center text-[11px] mt-5" style={{ color: "rgba(253,253,255,0.4)" }}>
          Admin access only — accounts are provisioned separately.
        </p>
      </div>
    </div>
  );
};

export default Login;
