
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LockKeyhole,
  ShieldCheck,
  ArrowLeft,
  LoaderCircle,
} from "lucide-react";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        username: username.trim(),
        password,
      });

      const token = response.data.token;

      if (!token) {
        throw new Error("The server did not return an authentication token.");
      }

      localStorage.setItem("adminToken", token);

      navigate("/admin", { replace: true });
    } catch (err) {
      const status = err.response?.status;

      if (!err.response) {
        setError(
          "Cannot connect to the server. Make sure your backend is running."
        );
      } else if (status === 401) {
        setError("Invalid username or password.");
      } else {
        setError(
          err.response?.data?.message ||
            "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to website
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white p-7 shadow-2xl sm:p-9">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
            <ShieldCheck size={28} />
          </div>

          <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900">
            Admin Login
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Sign in to manage locations, current results and waiting updates.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Username
              </label>

              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:opacity-60"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <LoaderCircle size={18} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LockKeyhole size={17} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          ResultBoard Administration
        </p>
      </div>
    </div>
  );
}

export default Login;
