
import { useMemo, useState } from "react";
import { CalendarDays, Search, Clock3, History } from "lucide-react";

const demoResults = [
  { id: 1, location: "DISAWAR", time: "5:35 AM", previous: "34", current: "50" },
  { id: 2, location: "SADAR BAZAR", time: "1:40 PM", previous: "01", current: "54" },
  { id: 3, location: "Delhi Swera", time: "1:50 PM", previous: "34", current: "43" },
  { id: 4, location: "GWALIOR", time: "2:40 PM", previous: "61", current: "77" },
  { id: 5, location: "DELHI BAZAR", time: "3:15 PM", previous: "91", current: "74" },
  { id: 6, location: "DELHI MATKA", time: "3:45 PM", previous: "86", current: "18" },
  { id: 7, location: "SHRI GANESH", time: "4:40 PM", previous: "06", current: "69" },
  { id: 8, location: "Agra", time: "5:35 PM", previous: "88", current: "97" },
  { id: 9, location: "FARIDABAD", time: "6:10 PM", previous: "17", current: null },
  { id: 10, location: "LALMINAR", time: "7:00 PM", previous: "61", current: null },
  { id: 11, location: "ALWAR", time: "7:43 PM", previous: "28", current: null },
  { id: 12, location: "GAZIYABAD", time: "9:50 PM", previous: "26", current: null },
  { id: 13, location: "DWARKA", time: "10:35 PM", previous: "31", current: null },
  { id: 14, location: "GALI", time: "11:50 PM", previous: "40", current: null },
];

function MonthlyHistory() {
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [month, setMonth] = useState("all");
  const [search, setSearch] = useState("");

  const results = useMemo(() => {
    return demoResults.filter((item) =>
      item.location.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="page-container py-10 sm:py-14">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600">
              <History size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                Results archive
              </p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Monthly Results
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            View previous and published results by location. Unpublished
            results remain marked as waiting without revealing their numbers.
          </p>
        </div>
      </section>

      <div className="page-container py-8 sm:py-10">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <label className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              <CalendarDays size={15} className="text-blue-600" />
              Year
            </span>
            <select
              value={year}
              onChange={(event) => setYear(event.target.value)}
              className="w-full bg-transparent text-lg font-bold text-slate-900 outline-none"
            >
              {[2024, 2025, 2026, 2027].map((value) => (
                <option key={value} value={String(value)}>
                  {value}
                </option>
              ))}
            </select>
          </label>

          <label className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              <CalendarDays size={15} className="text-blue-600" />
              Month
            </span>
            <select
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className="w-full bg-transparent text-lg font-bold text-slate-900 outline-none"
            >
              <option value="all">All Months</option>
              {[
                "January", "February", "March", "April",
                "May", "June", "July", "August",
                "September", "October", "November", "December",
              ].map((name, index) => (
                <option key={name} value={String(index + 1)}>
                  {name}
                </option>
              ))}
            </select>
          </label>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Locations shown
            </span>
            <p className="text-2xl font-extrabold text-slate-900">
              {results.length}
            </p>
            <p className="mt-1 text-xs text-slate-500">Demo table entries</p>
          </div>
        </div>

        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Results table
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Previous result and today's published result.
            </p>
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search location..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] table-fixed border-collapse text-center">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="w-[42%] border-r border-slate-700 px-3 py-4 text-left text-sm font-extrabold sm:px-5">
                    Location
                  </th>
                  <th className="w-[25%] border-r border-slate-700 px-2 py-4 text-sm font-extrabold">
                    Previous
                  </th>
                  <th className="w-[33%] px-2 py-4 text-sm font-extrabold">
                    Current Result
                  </th>
                </tr>
              </thead>

              <tbody>
                {results.map((item, index) => (
                  <tr
                    key={item.id}
                    className={
                      index % 2 === 0
                        ? "bg-slate-100"
                        : "bg-white"
                    }
                  >
                    <td className="border border-slate-300 bg-gradient-to-b from-blue-600 to-blue-800 px-3 py-4 text-left text-white sm:px-5 sm:py-5">
                      <p className="break-words text-sm font-extrabold sm:text-base">
                        {item.location}
                      </p>
                      <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-blue-100">
                        <Clock3 size={13} />
                        {item.time}
                      </p>
                    </td>

                    <td className="border border-slate-300 px-2 py-5 text-2xl font-extrabold tracking-wide text-slate-900 sm:text-3xl">
                      {item.previous}
                    </td>

                    <td className="border border-slate-300 px-2 py-5">
                      {item.current ? (
                        <span className="text-2xl font-extrabold tracking-wide text-slate-900 sm:text-3xl">
                          {item.current}
                        </span>
                      ) : (
                        <span className="mx-auto inline-flex min-h-9 min-w-9 items-center justify-center rounded-full border-4 border-amber-200 bg-amber-400 px-2 text-[10px] font-black tracking-wide text-slate-950 shadow-sm">
                          WAIT
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {results.length === 0 && (
                  <tr>
                    <td
                      colSpan="3"
                      className="border border-slate-200 px-4 py-12 text-center"
                    >
                      <p className="font-bold text-slate-800">
                        No locations found
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        Try a different location name.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <Clock3 size={19} className="mt-0.5 shrink-0 text-blue-600" />
          <p className="text-sm leading-6 text-blue-900">
            <strong>Waiting:</strong> The next result is not published yet.
            Its number is intentionally hidden from public visitors.
          </p>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Demo entries are illustrative. Live records and month filtering will
          be connected to the database in the backend integration step.
        </p>
      </div>
    </div>
  );
}

export default MonthlyHistory;
