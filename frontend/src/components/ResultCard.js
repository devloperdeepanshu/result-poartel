
import { Clock3, MapPin, CheckCircle2 } from "lucide-react";

function ResultCard({ result, type = "current" }) {
  const isWaiting = type === "waiting";

  return (
    <article
      className={`relative overflow-hidden rounded-3xl border p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lg ${
        isWaiting
          ? "border-amber-200 bg-white"
          : "border-blue-100 bg-white"
      }`}
    >
      <div
        className={`absolute right-0 top-0 h-28 w-28 rounded-full blur-3xl ${
          isWaiting ? "bg-amber-100" : "bg-blue-100"
        }`}
      />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
              isWaiting
                ? "bg-amber-50 text-amber-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {isWaiting ? (
              <Clock3 size={14} />
            ) : (
              <CheckCircle2 size={14} />
            )}
            {isWaiting ? "WAITING" : "CURRENT RESULT"}
          </span>

          <span className="text-xs font-medium text-slate-400">
            {isWaiting ? "Upcoming" : "Latest"}
          </span>
        </div>

        {/* Location - Highlighted */}
        <div className="mt-6 flex items-center gap-2">
          <MapPin
            size={20}
            className="shrink-0 text-blue-600"
          />

          <span className="text-xl font-extrabold tracking-wide text-slate-900 sm:text-2xl">
            {result?.locationName || "Location"}
          </span>
        </div>

        {isWaiting ? (
          <div className="mt-4 rounded-2xl bg-amber-50 px-4 py-5">
            <p className="text-2xl font-extrabold tracking-tight text-amber-700">
              Waiting
            </p>

            <p className="mt-1 text-sm text-amber-700/80">
              Next result has not been published yet.
            </p>
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Result number
            </p>

            <p className="mt-1 text-5xl font-extrabold tracking-tight text-slate-900">
              {result?.number ?? "--"}
            </p>
          </div>
        )}

        {result?.publishedAt && !isWaiting && (
          <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
            Published {new Date(result.publishedAt).toLocaleString()}
          </p>
        )}
      </div>
    </article>
  );
}

export default ResultCard;