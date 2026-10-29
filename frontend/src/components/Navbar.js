
import { Link, NavLink } from "react-router-dom";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "All Results", path: "/" },
    { name: "Monthly Chart", path: "/monthly" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="page-container">
        <div className="flex h-[76px] items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <span className="text-lg font-extrabold">R</span>
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight text-slate-900">
                Result<span className="text-blue-600">Board</span>
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                Result dashboard
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  `text-sm font-semibold transition ${
                    isActive
                      ? "text-blue-600"
                      : "text-slate-500 hover:text-slate-900"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:block">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
            >
              <ShieldCheck size={17} />
              Admin Login
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-xl border border-slate-200 p-2 md:hidden"
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <nav className="space-y-1 border-t border-slate-100 py-4 md:hidden">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="block rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {link.name}
              </NavLink>
            ))}
            <Link
              to="/admin/login"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl bg-blue-600 px-3 py-3 text-sm font-semibold text-white"
            >
              Admin Login
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;
