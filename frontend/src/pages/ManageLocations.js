import { useEffect, useState } from "react";
import { MapPin, Plus, Trash2, RefreshCw } from "lucide-react";
import AdminLayout from "../layouts/AdminLayout";
import api from "../services/api";

function ManageLocations() {
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  async function loadLocations() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/locations");
      setLocations(response.data.locations || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Locations load nahi hui. Backend server aur database connection check karo."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(function () {
    loadLocations();
  }, []);

  async function addLocation(event) {
    event.preventDefault();

    const cleanedName = name.trim();

    if (!cleanedName) {
      setError("Location ka naam enter karo.");
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post("/locations", {
        name: cleanedName,
      });

      const newLocation = response.data.location;

      if (newLocation) {
        setLocations(function (previous) {
          return [
            ...previous.filter(function (item) {
              return item._id !== newLocation._id;
            }),
            newLocation,
          ];
        });
      } else {
        await loadLocations();
      }

      setName("");
      setMessage("Location successfully MongoDB mein add ho gayi.");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Location add nahi hui. Login session aur backend check karo."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteLocation(location) {
    const locationId = location._id;

    if (!locationId) {
      setError("Location ID nahi mili. Page refresh karke dobara try karo.");
      return;
    }

    if (
      !window.confirm(
        `Kya tum "${location.name}" ko delete karna chahte ho?`
      )
    ) {
      return;
    }

    setDeletingId(locationId);
    setMessage("");
    setError("");

    try {
      await api.delete(`/locations/${locationId}`);

      setLocations(function (previous) {
        return previous.filter(function (item) {
          return item._id !== locationId;
        });
      });

      setMessage(`${location.name} successfully delete ho gayi.`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Location delete nahi hui. Dobara login karke try karo."
      );
    } finally {
      setDeletingId("");
    }
  }

  return (
    <AdminLayout>
      <div className="mx-auto max-w-5xl space-y-7">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-blue-600">
            Configuration
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
            Manage Locations
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Add and manage locations stored in your database.
          </p>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
          <h2 className="text-lg font-extrabold text-slate-900">
            Add a location
          </h2>

          <form
            onSubmit={addLocation}
            className="mt-5 flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={name}
              onChange={function (event) {
                setName(event.target.value);
              }}
              placeholder="Enter city or location name"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              autoComplete="off"
              required
            />

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Plus size={18} />
              {saving ? "Adding..." : "Add Location"}
            </button>
          </form>

          {message && (
            <p className="mt-4 rounded-xl bg-blue-50 p-3 text-sm text-blue-800">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
              {error}
            </p>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-slate-900">
              All Locations
            </h2>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {locations.length} total
              </span>

              <button
                type="button"
                onClick={loadLocations}
                disabled={loading}
                className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                title="Refresh locations"
                aria-label="Refresh locations"
              >
                <RefreshCw size={17} />
              </button>
            </div>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Loading locations...
            </p>
          ) : (
            <div className="mt-5 divide-y divide-slate-100">
              {locations.map(function (location) {
                return (
                  <div
                    key={location._id}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <MapPin size={19} />
                      </div>

                      <span className="font-semibold text-slate-800">
                        {location.name}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={function () {
                        deleteLocation(location);
                      }}
                      disabled={deletingId === location._id}
                      className="rounded-xl border border-rose-100 p-2.5 text-rose-600 hover:bg-rose-50 disabled:opacity-50"
                      aria-label={`Delete ${location.name}`}
                      title="Delete location"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                );
              })}

              {locations.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-500">
                  No active locations yet. Add one above.
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

export default ManageLocations; 