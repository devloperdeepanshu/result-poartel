import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ChartNoAxesCombined,
  RefreshCw,
  MessageCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import ResultCard from "../components/ResultCard";
import api from "../services/api";

function Home() {
  const [currentResults, setCurrentResults] = useState([]);
  const [waitingResults, setWaitingResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadResults = useCallback(async () => {
    try {
      setError("");

      const response = await api.get("/results/current");
      const rows = response.data.results || [];

      const current = [];
      const waiting = [];

      rows.forEach((row) => {
        const locationName = row.location?.name || "Unknown Location";
        const locationId = row.location?.id;

        if (row.current) {
          current.push({
            id: `current-${locationId}`,
            locationName,
            number: String(row.current.number).padStart(2, "0"),
            publishedAt: row.current.publishedAt,
            expiresAt: row.current.expiresAt,
          });
        }

        if (row.waiting) {
          waiting.push({
            id: `waiting-${locationId}`,
            locationName,
            status: "WAITING",
            publishAt: row.waiting.publishAt,
          });
        }
      });

      setCurrentResults(current);
      setWaitingResults(waiting);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Results load nahi ho paaye. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadResults();

    // Keep the public page updated when the database changes.
    const intervalId = window.setInterval(loadResults, 30000);

    return () => window.clearInterval(intervalId);
  }, [loadResults]);

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

        <div className="page-container relative py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Results dashboard
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
              Your results.
              <span className="block text-blue-400">
                Clear and up to date.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Check the latest published result, see which locations are
              waiting, and explore previous monthly results in one place.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/results"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-500"
              >
                Explore Results <ArrowRight size={17} />
              </Link>

              <Link
                to="/monthly"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <ChartNoAxesCombined size={17} />
                Monthly History
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="page-container py-12 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
              Live dashboard
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Current results
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Latest published numbers by location.
            </p>
          </div>

          <button
            type="button"
            onClick={loadResults}
            disabled={loading}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            {loading ? "Loading..." : "Refresh results"}
          </button>
        </div>

        {error && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <span>{error}</span>
            <button
              type="button"
              onClick={loadResults}
              className="font-bold underline"
            >
              Try again
            </button>
          </div>
        )}

        {loading ? (
          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Loading current results...
          </div>
        ) : (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {currentResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <ResultCard result={result} type="current" />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !error && currentResults.length === 0 && (
          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <p className="font-bold text-slate-800">No current results</p>
            <p className="mt-2 text-sm text-slate-500">
              Published results will appear here when available.
            </p>
          </div>
        )}
      </section>

      <section className="page-container pb-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-600">
              Upcoming updates
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Next results
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Location and waiting status only. No number is displayed.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
            <CalendarDays size={15} />
            Awaiting publication
          </div>
        </div>

        {loading ? (
          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Loading waiting results...
          </div>
        ) : (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {waitingResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <ResultCard result={result} type="waiting" />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && !error && waitingResults.length === 0 && (
          <div className="mt-7 rounded-2xl border border-amber-200 bg-white p-8 text-center">
            <p className="font-bold text-slate-800">No waiting results</p>
            <p className="mt-2 text-sm text-slate-500">
              A location will appear here when a next result is scheduled.
            </p>
          </div>
        )}
      </section>

      <section className="page-container pb-12">
        <div className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-soft sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                <MessageCircle size={25} />
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Join Us on WhatsApp
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Connect with us on WhatsApp for updates and information.
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/9518034922"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              <MessageCircle size={18} />
              Open WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;