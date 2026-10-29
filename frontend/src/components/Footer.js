
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="page-container flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-slate-900">
            Result<span className="text-blue-600">Board</span>
          </p>
          <p className="mt-1 text-sm text-slate-500">
            !! DISCLAIMER - A7 Satta is a non-commercial informational website. Please view this site at your own risk, All The Information Shown On Website Is Sponsored And We Warn You That satta matka Gambling/Satta May Be Banned Or Illegal In Your Country. We Are Not Responsible For Any Issues Or Scam..., We Respect All Country Rules/Laws... If You Not Agree With Our Site disclaimer Please Quit Our Site Right Now. Thank You.
          </p>
        </div>

        <div className="flex gap-5 text-sm font-medium text-slate-500">
          <Link to="/" className="hover:text-blue-600">Home</Link>
          <Link to="/results" className="hover:text-blue-600">Results</Link>
          <Link to="/monthly" className="hover:text-blue-600">Monthly Chart</Link>
        </div>
      </div>

      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} ResultBoard. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
