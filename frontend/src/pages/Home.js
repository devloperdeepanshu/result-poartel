
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ChartNoAxesCombined,
  RefreshCw,
  MessageCircle,
  Clock3,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import ResultCard from "../components/ResultCard";
import api from "../services/api";
import MonthlyHistory from "./MonthlyHistory";
const khaiwalLocations = [
  { name: "अलीगढ़ सिटी", time: "12:50 PM" },
  { name: "दिल्ली सवेरा", time: "2:00 PM" },
  { name: "ग्वालियर", time: "2:20 PM" },
  { name: "दिल्ली बाजार", time: "2:50 PM" },
  { name: "दिल्ली मटका", time: "3:20 PM" },
  { name: "श्री गणेश", time: "4:20 PM" },
  { name: "आगरा", time: "5:20 PM" },
  { name: "फरीदाबाद", time: "5:50 PM" },
  { name: "लाल मीनार", time: "7:00 PM" },
  { name: "अलवर", time: "7:20 PM" },

  { name: "गाज़ियाबाद", time: "9:20 PM" },
  { name: "स टारका", time: "10:20 PM" },
];

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

    const intervalId = window.setInterval(loadResults, 30000);

    return () => window.clearInterval(intervalId);
  }, [loadResults]);

  return (
    <div className="min-h-screen">
     

      {/* CURRENT RESULTS FIRST */}
      <section className="page-container py-12 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
              Live dashboard
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Current Results
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Latest published results by location.
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
          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
            {currentResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
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

      {/* WAITING RESULTS */}
      <section className="page-container pb-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-amber-600">
              Upcoming updates
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Next Results
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Waiting locations are shown without their unpublished numbers.
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
          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
            {waitingResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
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

      {/* KHAIWAL TABLE */}
      <section className="page-container pb-14">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
            Location schedule
          </p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
            खाईवाल
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Online khaiwal · SYAM BHAI KHAIWAL
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Users size={21} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900">
                SYAM BHAI KHAIWAL
              </h3>
              <p className="text-xs text-slate-500">Location & timing list</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] text-left">
              <thead className="bg-white">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    S.No.
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Location
                  </th>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {khaiwalLocations.map((item, index) => (
                  <tr
                    key={item.name}
                    className="transition hover:bg-emerald-50/50"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </td>
                    <td className="px-5 py-4 text-base font-bold text-slate-900">
                      {item.name}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                        <Clock3 size={15} />
                        {item.time}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* WHATSAPP */}
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
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              <MessageCircle size={18} />
              Open WhatsApp
            </a>
          </div>
          <div className="mt-4 text-sm text-slate-500"> 
          <MonthlyHistory/>
          </div>
        </div>
      </section>
      
    </div>
  );
}

export default Home;
