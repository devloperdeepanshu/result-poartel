
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-16 border-t border-black bg-black text-white">
      <div className="page-container py-10">

        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">

          {/* Brand & Disclaimer */}
          <div className="max-w-2xl">
            <Link to="/" className="inline-block">
              <p className="text-xl font-extrabold tracking-tight">
                Result<span className="text-yellow-400">Board</span>
              </p>
            </Link>

            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-yellow-400">
                Disclaimer
              </p>

              <p className="text-xs leading-6 text-white/60">
                A7 Satta is a non-commercial informational website. Please
                view this site at your own risk. All the information shown
                on this website is sponsored. We warn you that Satta Matka
                gambling/Satta may be banned or illegal in your country.
                We are not responsible for any issues or scams. We respect
                all country rules and laws. If you do not agree with our
                site disclaimer, please quit our site right now. Thank you.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="min-w-[150px]">
            <h3 className="mb-4 text-sm font-bold text-yellow-400">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3 text-sm font-medium text-white/65">
              <Link to="/" className="transition-colors hover:text-yellow-400">
                Home
              </Link>

              <Link
                to="/results"
                className="transition-colors hover:text-yellow-400"
              >
                All Results
              </Link>

              <Link
                to="/monthly"
                className="transition-colors hover:text-yellow-400"
              >
                Monthly Chart
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="page-container flex flex-col items-center justify-between gap-2 py-5 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} ResultBoard. All rights reserved.
          </p>

          <p className="text-xs font-medium text-white/40">
            Built for a better result experience.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
