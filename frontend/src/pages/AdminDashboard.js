import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Clock3,
  MapPin,
  Plus,
  Trash2,
  ExternalLink,
  Save,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

function AdminDashboard() {
  const [locations, setLocations] = useState([]);
  const [current, setCurrent] = useState([]);
  const [waiting, setWaiting] = useState([]);

  const [currentLocationId, setCurrentLocationId] = useState("");
  const [waitingLocationId, setWaitingLocationId] = useState("");
  const [currentNumber, setCurrentNumber] = useState("");
  const [publishAt, setPublishAt] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const showMessage = useCallback((text, type = "success") => {
    setMessage(text);
    setMessageType(type);
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.get("/results/admin");
      const resultData = response.data;

      const activeLocations = (resultData.locations || []).filter(
        (location) => location.isActive !== false
      );

      const activeResults = (resultData.results || []).filter(
        (result) =>
          result.location &&
          result.location.isActive !== false
      );

      setLocations(activeLocations);

      setCurrent(
        activeResults.filter(
          (result) =>
            result.status === "published" &&
            (!result.expiresAt ||
              new Date(result.expiresAt).getTime() > Date.now())
        )
      );

      setWaiting(
        activeResults.filter((result) => result.status === "waiting")
      );

      setCurrentLocationId((previousId) =>
        activeLocations.some((item) => item._id === previousId)
          ? previousId
          : activeLocations[0]?._id || ""
      );

      setWaitingLocationId((previousId) =>
        activeLocations.some((item) => item._id === previousId)
          ? previousId
          : activeLocations[0]?._id || ""
      );
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/login";
        return;
      }

      showMessage(
        error.response?.data?.message ||
          "Could not load dashboard. Check the backend server.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }, [showMessage]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  function validateNumber(value) {
    return (
      value.trim() !== "" &&
      Number.isInteger(Number(value)) &&
      Number(value) >= 0 &&
      Number(value) <= 99
    );
  }

  async function handleSave(event) {
    event.preventDefault();
    setMessage("");

    if (!currentLocationId || !waitingLocationId) {
      showMessage("Please select both locations.", "error");
      return;
    }

    if (!validateNumber(currentNumber)) {
      showMessage(
        "Current result must be a whole number from 0 to 99.",
        "error"
      );
      return;
    }

    if (
      publishAt &&
      new Date(publishAt).getTime() <= Date.now()
    ) {
      showMessage(
        "Choose a future date and time for the next result.",
        "error"
      );
      return;
    }

    if (publishAt && !waitingLocationId) {
      showMessage("Select a city for the waiting result.", "error");
      return;
    }

    const payload = {
      currentLocationId,
      currentNumber: String(Number(currentNumber)).padStart(2, "0"),
      waitingLocationId: publishAt ? waitingLocationId : null,
      publishAt: publishAt
        ? new Date(publishAt).toISOString()
        : null,
    };

    try {
      setSaving(true);

      /*
       * Backend requirement:
       * POST /api/results/admin/location/:currentLocationId
       * must accept currentNumber, waitingLocationId and publishAt.
       * The backend must create a waiting record without a public number.
       */
      const response = await api.post(
        `/results/admin/location/${currentLocationId}`,
        payload
      );

      setCurrentNumber("");
      setPublishAt("");

      await loadDashboard();

      showMessage(
        response.data.message || "Result details saved successfully."
      );
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/login";
        return;
      }

      showMessage(
        error.response?.data?.message ||
          "Could not save. The backend may need updating to support a separate waiting city without a number.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteResult(resultId, type, locationName) {
    const label =
      type === "waiting" ? "waiting result" : "current result";

    if (!window.confirm(`Remove the ${label} for ${locationName}?`)) {
      return;
    }

    try {
      setDeletingId(resultId);

      const response = await api.delete(`/results/admin/${resultId}`);

      await loadDashboard();

      showMessage(response.data.message || "Result removed successfully.");
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem("adminToken");
        window.location.href = "/login";
        return;
      }

      showMessage(
        error.response?.data?.message || "Could not remove this result.",
        "error"
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
              Overview
            </p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">
              Results Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage current results and schedule the next update.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={loadDashboard}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <ExternalLink size={16} />
              View Website
            </Link>
          </div>
        </div>

        {message && (
          <div
            role="status"
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              messageType === "error"
                ? "bg-rose-50 text-rose-700"
                : "bg-emerald-50 text-emerald-800"
            }`}
          >
            {message}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">Locations</span>
              <MapPin className="text-blue-600" size={20} />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">
              {locations.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">Current</span>
              <Activity className="text-emerald-600" size={20} />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">
              {current.length}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-500">Waiting</span>
              <Clock3 className="text-amber-600" size={20} />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-slate-900">
              {waiting.length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
            Loading dashboard from database...
          </div>
        ) : (
          <div className="grid items-start gap-8 xl:grid-cols-[1fr_0.9fr]">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                  <Plus size={23} />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">
                    Add or replace result
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Choose the current city and next city independently.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSave} className="mt-7 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Current Result City / Location
                  </label>
                  <select
                    value={currentLocationId}
                    onChange={(event) => setCurrentLocationId(event.target.value)}
                    disabled={locations.length === 0 || saving}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
                    required
                  >
                    {locations.length === 0 && (
                      <option value="">No locations — add one first</option>
                    )}
                    {locations.map((location) => (
                      <option key={location._id} value={location._id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Current Result Number
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    step="1"
                    value={currentNumber}
                    onChange={(event) => setCurrentNumber(event.target.value)}
                    placeholder="Enter current number"
                    required
                    disabled={saving || locations.length === 0}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
                  />
                </div>

                <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
                  <div className="flex items-center gap-2 font-bold text-amber-800">
                    <Clock3 size={18} />
                    Next Result — Waiting
                  </div>

                  <p className="mt-2 text-sm leading-6 text-amber-800/80">
                    Only the selected location and waiting status should be shown publicly.
                    No next-result number is entered in this form.
                  </p>

                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Next Result City / Location
                      </label>
                      <select
                        value={waitingLocationId}
                        onChange={(event) => setWaitingLocationId(event.target.value)}
                        disabled={saving || locations.length === 0}
                        className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 disabled:bg-slate-100"
                        required
                      >
                        {locations.length === 0 && (
                          <option value="">No locations — add one first</option>
                        )}
                        {locations.map((location) => (
                          <option key={location._id} value={location._id}>
                            {location.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Publish Date and Time
                      </label>
                      <input
                        type="datetime-local"
                        value={publishAt}
                        onChange={(event) => setPublishAt(event.target.value)}
                        disabled={saving || locations.length === 0}
                        className="w-full rounded-xl border border-amber-200 bg-white px-4 py-3 outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 disabled:bg-slate-100"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving || locations.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Result"}
                </button>
              </form>
            </section>

            <div className="space-y-8">
              <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
                <h2 className="text-lg font-extrabold text-slate-900">Current Results</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Published numbers from the database.
                </p>

                <div className="mt-5 space-y-3">
                  {current.length === 0 && (
                    <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                      No current results.
                    </p>
                  )}

                  {current.map((item) => (
                    <motion.div
                      layout
                      key={item._id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-4"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {item.location?.name}
                        </p>
                        <p className="mt-1 text-2xl font-extrabold text-blue-600">
                          {String(item.number).padStart(2, "0")}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          Published:{" "}
                          {item.publishedAt
                            ? new Date(item.publishedAt).toLocaleString()
                            : "—"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          deleteResult(item._id, "published", item.location?.name || "this location")
                        }
                        disabled={deletingId === item._id}
                        className="rounded-xl border border-rose-100 p-3 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                        title="Remove current result"
                        aria-label={`Remove current result for ${item.location?.name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-amber-200 bg-white p-6 shadow-soft">
                <h2 className="text-lg font-extrabold text-slate-900">Waiting Results</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Scheduled locations and times.
                </p>

                <div className="mt-5 space-y-3">
                  {waiting.length === 0 && (
                    <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
                      No waiting results.
                    </p>
                  )}

                  {waiting.map((item) => (
                    <motion.div
                      layout
                      key={item._id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-amber-100 bg-amber-50/50 p-4"
                    >
                      <div>
                        <p className="font-bold text-slate-900">
                          {item.location?.name}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-amber-700">
                          WAITING
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Scheduled:{" "}
                          {item.publishAt
                            ? new Date(item.publishAt).toLocaleString()
                            : "Not scheduled"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          deleteResult(item._id, "waiting", item.location?.name || "this location")
                        }
                        disabled={deletingId === item._id}
                        className="rounded-xl border border-rose-100 bg-white p-3 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                        title="Remove waiting result"
                        aria-label={`Remove waiting result for ${item.location?.name}`}
                      >
                        <Trash2 size={17} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminDashboard;