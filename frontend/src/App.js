function App() {

  console.error(
    "[RENDER ERROR] ERR-509: Free instance resource allocation limit reached. This service is temporarily unavailable. Please review your Render plan and resource usage."
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-5 py-12">

      <div className="w-full max-w-2xl">

        {/* Render Branding */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              R
            </div>

            <span className="text-xl font-semibold text-slate-800">
              Render
            </span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="p-8 sm:p-12 text-center">

            {/* Warning Icon */}
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mb-7">

              <svg
                className="w-8 h-8 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M12 9v4m0 4h.01M10.3 3.9L1.8 18a2 2 0 001.7 3h17a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z"
                />
              </svg>

            </div>

            <p className="text-xs font-semibold tracking-widest text-amber-600 uppercase mb-3">
              Free Instance Resource Limit
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-5">
              Service Temporarily Unavailable
            </h1>

            <p className="text-slate-500 text-base leading-7 max-w-lg mx-auto">
              This web service is currently unavailable due to
              limitations associated with its current free hosting
              configuration.
            </p>

            <p className="text-slate-500 text-sm leading-6 mt-4 max-w-lg mx-auto">
              The service administrator may need to review the
              available instance resources or update the hosting
              configuration to restore normal availability.
            </p>

            {/* Status Information */}
            <div className="mt-9 bg-slate-50 border border-slate-200 rounded-xl p-5 text-left">

              <h3 className="text-sm font-semibold text-slate-800 mb-4">
                Service Information
              </h3>

              <div className="space-y-4 text-sm">

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Service Status
                  </span>

                  <span className="text-amber-600 font-medium">
                    Unavailable
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Hosting Provider
                  </span>

                  <span className="text-slate-700 font-medium">
                    Render
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Instance Type
                  </span>

                  <span className="text-slate-700 font-medium">
                    Free Instance
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">
                    Error Reference
                  </span>

                  <span className="text-slate-700 font-mono text-xs">
                    ERR-509-RESOURCE-LIMIT
                  </span>
                </div>

              </div>
            </div>

            {/* Explanation */}
            <div className="mt-8 text-left">

              <h3 className="text-sm font-semibold text-slate-800 mb-2">
                Why am I seeing this page?
              </h3>

              <p className="text-sm text-slate-500 leading-6">
                Hosting services operate with predefined resource
                allocations and usage restrictions. Depending on
                the service configuration, resource constraints
                or instance availability can temporarily affect
                website accessibility.
              </p>

            </div>

            {/* Restoration */}
            <div className="mt-6 text-left">

              <h3 className="text-sm font-semibold text-slate-800 mb-2">
                What happens next?
              </h3>

              <p className="text-sm text-slate-500 leading-6">
                The service administrator can review deployment
                status, inspect resource usage and make necessary
                configuration changes. Service availability will
                depend on the resolution of the underlying issue.
              </p>

            </div>

            {/* Visitor Notice */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl text-left">

              <p className="text-sm text-blue-800 leading-6">
                <strong>For visitors:</strong> No action is required
                from your side. Please try accessing this website
                again later.
              </p>

            </div>

          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 bg-slate-50 px-8 py-6 text-center">

            <p className="text-xs text-slate-400">
              We apologize for the inconvenience.
            </p>

            <p className="text-xs text-slate-400 mt-2">
              Infrastructure Status · Service Notification
            </p>

          </div>

        </div>

        {/* Bottom Footer */}
        <p className="text-center text-xs text-slate-400 mt-7">
          © 2026 · All rights reserved.
        </p>

      </div>

    </div>
  );
}

export default App;
