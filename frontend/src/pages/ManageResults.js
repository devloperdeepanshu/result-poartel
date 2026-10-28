
import { useEffect, useState } from "react";
import { Trash2, Clock3, CheckCircle2 } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";

const STORAGE_KEY = "resultboard-demo-state";

function getState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
      locations: ["Pateabad", "Hisar"],
      current: [],
      waiting: [],
    };
  } catch {
    return { locations: ["Pateabad", "Hisar"], current: [], waiting: [] };
  }
}

function ManageResults() {
  const [data, setData] = useState(getState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  function deleteCurrent(id) {
    if (!window.confirm("Permanently remove this current demo entry?")) return;

    setData((previous) => ({
      ...previous,
      current: previous.current.filter((item) => item.id !== id),
    }));
  }

  function deleteWaiting(id) {
    if (!window.confirm("Remove this waiting demo entry?")) return;

    setData((previous) => ({
      ...previous,
      waiting: previous.waiting.filter((item) => item.id !== id),
    }));
  }

  function clearDisplayEntries() {
    if (!window.confirm("Remove all current and waiting demo entries?")) return;

    setData((previous) => ({
      ...previous,
      current: [],
      waiting: [],
    }));
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl space-y-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
              Content management
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
              Manage Results
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Review current entries and scheduled waiting entries.
            </p>
          </div>

          <button
            onClick={clearDisplayEntries}
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50"
          >
            <Trash2 size={16} /> Clear Current + Waiting
          </button>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <h2 className="text-lg font-extrabold text-slate-900">Current Results</h2>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-3 py-3">Location</th>
                  <th className="px-3 py-3">Number</th>
                  <th className="px-3 py-3">Published</th>
                  <th className="px-3 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.current.map((item) => (
                  <tr key={item.id} className="border-b border-slate-50">
                    <td className="px-3 py-4 font-semibold text-slate-800">
                      {item.locationName}
                    </td>
                    <td className="px-3 py-4 font-extrabold text-blue-600">
                      {item.number}
                    </td>
                    <td className="px-3 py-4 text-slate-500">
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleString()
                        : "—"}
                    </td>
                    <td className="px-3 py-4 text-right">
                      <button
                        onClick={() => deleteCurrent(item.id)}
                        className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                        aria-label={`Delete current result for ${item.locationName}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))}
                {data.current.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-3 py-8 text-center text-slate-500">
                      No current results.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-soft">
          <div className="flex items-center gap-2">
            <Clock3 className="text-amber-600" size={20} />
            <h2 className="text-lg font-extrabold text-slate-900">Waiting Results</h2>
          </div>

          <div className="mt-5 space-y-3">
            {data.waiting.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-amber-100 bg-amber-50/50 p-4"
              >
                <div>
                  <p className="font-bold text-slate-900">{item.locationName}</p>
                  <p className="mt-1 text-sm font-semibold text-amber-700">
                    Waiting
                  </p>
                  {item.publishAt && (
                    <p className="mt-1 text-xs text-slate-500">
                      Scheduled: {new Date(item.publishAt).toLocaleString()}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => deleteWaiting(item.id)}
                  className="rounded-xl border border-rose-100 bg-white p-2.5 text-rose-600 hover:bg-rose-50"
                  aria-label={`Delete waiting result for ${item.locationName}`}
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}

            {data.waiting.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-500">
                No waiting results.
              </p>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}

export default ManageResults;
