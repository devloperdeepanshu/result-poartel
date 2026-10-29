
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Search,
  Clock3,
  History,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import api from "../services/api";

function MonthlyHistory() {
  const today = new Date();

  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchHistory() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/results/history", {
          params: { month, year },
        });

        if (!response.data?.success) {
          throw new Error(
            response.data?.message || "Unable to load monthly history."
          );
        }

        if (!cancelled) {
          setResults(
            Array.isArray(response.data.history)
              ? response.data.history
              : []
          );
        }
      } catch (err) {
        if (!cancelled) {
          setResults([]);
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load results. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchHistory();

    return () => {
      cancelled = true;
    };
  }, [month, year]);

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    return results.filter((result) =>
      (result.location?.name || "").toLowerCase().includes(query)
    );
  }, [results, search]);

  const groupedResults = useMemo(() => {
    const groups = new Map();

    for (const result of filteredResults) {
      const locationId =
        result.location?.id || result.location?.name || "unknown";

      if (!groups.has(locationId)) {
        groups.set(locationId, {
          id: locationId,
          location: result.location?.name || "Unknown Location",
          results: [],
        });
      }

      groups.get(locationId).results.push(result);
    }

    return Array.from(groups.values()).map((group) => {
      const sorted = [...group.results].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() -
          new Date(a.publishedAt).getTime()
      );

      return {
        ...group,
        latest: sorted[0] || null,
        previous: sorted[1] || null,
        total: sorted.length,
      };
    });
  }, [filteredResults]);

  function formatTime(dateValue) {
    if (!dateValue) return "--";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "--";

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  function formatDate(dateValue) {
    if (!dateValue) return "--";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "--";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <section className="page-container py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-600">
            <History size={17} />
            Result Archive
          </div>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Monthly History
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Browse previously published results by month and location.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm">
          <CalendarDays size={19} className="text-indigo-600" />
          <span className="text-sm font-medium text-gray-700">
            {monthOptions[month - 1]} {year}
          </span>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-3">
        <div>
          <label
            htmlFor="history-month"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Select month
          </label>

          <select
            id="history-month"
            value={month}
            onChange={(event) => setMonth(Number(event.target.value))}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {monthOptions.map((name, index) => (
              <option key={name} value={index + 1}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="history-year"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Select year
          </label>

          <select
            id="history-year"
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            className="w-full rounded-xl border border-gray-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {Array.from(
              { length: Math.max(1, today.getFullYear() - 1999) },
              (_, index) => today.getFullYear() - index
            ).map((itemYear) => (
              <option key={itemYear} value={itemYear}>
                {itemYear}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="history-search"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Search location
          </label>

          <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-3 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
            <Search size={18} className="shrink-0 text-gray-400" />
            <input
              id="history-search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search location..."
              className="min-w-0 w-full border-0 bg-transparent py-3 text-sm outline-none focus:ring-0"
            />
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-gray-900">
            Published Results
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {loading
              ? "Loading records..."
              : `${filteredResults.length} records found`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setMonth((current) => current);
            setYear((current) => current);
          }}
          className="hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-600 transition hover:bg-gray-50 sm:flex"
          title="Select a different month or year to refresh"
        >
          <RefreshCw size={15} />
          History
        </button>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={19} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Could not load history</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm">
          <RefreshCw
            size={28}
            className="mx-auto animate-spin text-indigo-600"
          />
          <p className="mt-3 text-sm text-gray-500">
            Loading results from database...
          </p>
        </div>
      ) : !error && groupedResults.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <History size={32} className="mx-auto text-gray-400" />
          <h3 className="mt-3 font-semibold text-gray-900">
            No results found
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            There are no published results for this month or search.
          </p>
        </div>
      ) : !error ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Location
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Latest result
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Previous result
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Published
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Records
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {groupedResults.map((group) => (
                  <tr
                    key={group.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-900">
                        {group.location}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex min-w-12 items-center justify-center rounded-lg bg-indigo-50 px-3 py-2 font-bold text-indigo-700">
                        {group.latest?.number ?? "--"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex min-w-12 items-center justify-center rounded-lg bg-gray-100 px-3 py-2 font-semibold text-gray-700">
                        {group.previous?.number ?? "--"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock3 size={15} className="shrink-0 text-gray-400" />
                        <div>
                          <div>{formatTime(group.latest?.publishedAt)}</div>
                          <div className="mt-1 text-xs text-gray-400">
                            {formatDate(group.latest?.publishedAt)}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                        {group.total}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <p className="mt-4 text-xs text-gray-400">
        History includes results published during the selected month.
      </p>
    </section>
  );
}

export default MonthlyHistory;
