
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Clock3,
  MessageCircle,
  RefreshCw,
  Users,
} from "lucide-react";

import ResultCard from "../components/ResultCard";
import api from "../services/api";
import MonthlyHistory from "./MonthlyHistory";

const khaiwalLocations = [
  { name: "अलीगढ़ सिटी", time: "12:55 PM" },
  { name: "सदर बाजार", time: "01:25 PM" },
  { name: "दिल्ली सवेरा", time: "02:10 PM" },
  { name: "ग्वालियर", time: "02:25 PM" },
  { name: "दिल्ली बाजार", time: "02:55 PM" },
  { name: "दिल्ली मटका", time: "03:30 PM" },
  { name: "श्री गणेश", time: "04:20 PM" },
  { name: "आगरा", time: "05:20 PM" },
  { name: "फरीदाबाद", time: "05:55 PM" },
  { name: "लाल मीनार", time: "06:55 PM" },
  { name: "अलवर", time: "07:30 PM" },
  { name: "गाज़ियाबाद", time: "09:30 PM" },
  { name: "द्वारका", time: "10:30 PM" },
  { name: "गली", time: "11:30 PM" },
  { name: "दिसावर", time: "01:00 AM" },
];

function Home() {
  const [currentResults, setCurrentResults] = useState([]);
  const [waitingResults, setWaitingResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const requestInProgress = useRef(false);

  const loadResults = useCallback(async (silent = false) => {
    if (requestInProgress.current) {
      return;
    }

    requestInProgress.current = true;

    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
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
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Results load nahi ho paaye. Please try again."
      );
    } finally {
      requestInProgress.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadResults();

    const intervalId = window.setInterval(() => {
      loadResults(true);
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadResults]);

  return (
    <div className="min-h-screen bg-white">

      {/* CURRENT RESULTS */}

      <section className="page-container py-12 sm:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-yellow-600">
              Live Dashboard
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
              चालू रिजल्ट
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Latest published results by location.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadResults(true)}
            disabled={loading || refreshing}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-black transition-colors hover:border-yellow-400 hover:bg-yellow-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />
            {refreshing ? "Refreshing..." : "Refresh Results"}
          </button>
        </div>

        {error && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <span>{error}</span>

            <button
              type="button"
              onClick={() => loadResults(true)}
              disabled={refreshing}
              className="font-bold underline disabled:opacity-50"
            >
              Try Again
            </button>
          </div>
        )}

        {loading ? (
          <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-10 text-center">
            <div className="mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2 border-yellow-400 border-t-transparent" />
            <p className="text-sm font-medium text-slate-500">
              Loading current results...
            </p>
          </div>
        ) : (
          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
            {currentResults.map((result) => (
              <ResultCard
                key={result.id}
                result={result}
                type="current"
              />
            ))}
          </div>
        )}

        {!loading && !error && currentResults.length === 0 && (
          <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-10 text-center">
            <p className="font-bold text-black">
              No Current Results
            </p>

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
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-yellow-600">
              Upcoming Updates
            </p>

            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
              अगला रिजल्ट
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Waiting locations are shown without their unpublished numbers.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs font-bold text-yellow-800">
            <CalendarDays size={15} />
            Awaiting Publication
          </div>
        </div>

        {loading ? (
          <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500">
            Loading waiting results...
          </div>
        ) : (
          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
            {waitingResults.map((result) => (
              <ResultCard
                key={result.id}
                result={result}
                type="waiting"
              />
            ))}
          </div>
        )}

        {!loading && !error && waitingResults.length === 0 && (
          <div className="mt-7 rounded-xl border border-slate-200 bg-slate-50 p-10 text-center">
            <p className="font-bold text-black">
              No Waiting Results
            </p>

            <p className="mt-2 text-sm text-slate-500">
              A location will appear here when a next result is scheduled.
            </p>
          </div>
        )}
      </section>

      {/* MONTHLY HISTORY */}

      <section className="page-container pb-14">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-yellow-600">
            Previous Records
          </p>

          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            Monthly History
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Check previous results month by month.
          </p>
        </div>

        <MonthlyHistory />
      </section>

      {/* KHAIWAL SCHEDULE */}

      <section className="page-container pb-14">
        <div className="mb-6">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-yellow-600">
            Location Schedule
          </p>

          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
            खाईवाल
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Online khaiwal · SYAM BHAI KHAIWAL
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-soft">
          <div className="flex items-center gap-3 border-b border-slate-200 bg-black px-5 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400 text-black">
              <Users size={21} />
            </div>

            <div>
              <h3 className="font-extrabold text-white">
                SYAM BHAI KHAIWAL
              </h3>

              <p className="text-xs text-white/60">
                Location & Timing List
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] text-left">
              <thead className="bg-yellow-50">
                <tr className="border-b border-yellow-100">
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-black">
                    S.No.
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-black">
                    Location
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-black">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {khaiwalLocations.map((item, index) => (
                  <tr
                    key={item.name}
                    className="transition-colors hover:bg-yellow-50"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    <td className="px-5 py-4 text-base font-bold text-black">
                      {item.name}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-yellow-100 px-3 py-2 text-sm font-bold text-black">
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
        <div className="rounded-xl border border-slate-200 bg-black p-5 shadow-soft sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-black">
                <MessageCircle size={25} />
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-white">
                  Join Us on WhatsApp
                </h2>

                <p className="mt-1 text-sm leading-6 text-white/60">
                  Connect with us on WhatsApp for updates and information.
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/918930430170"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-yellow-300"
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
