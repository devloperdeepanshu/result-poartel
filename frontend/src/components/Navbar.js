
import { Link, NavLink } from "react-router-dom";
import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { name: "Home", path: "/" },
    { name: "Monthly Chart", path: "/monthly" },
  ];

  function closeMenu() {
    setMenuOpen(false);
  }

  function getLinkClass(isActive) {
    return `relative text-sm font-semibold transition-colors duration-150 ${
      isActive
        ? "text-yellow-400"
        : "text-white/70 hover:text-yellow-400"
    }`;
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black">
      <div className="page-container">
        <div className="flex h-[72px] items-center justify-between gap-4">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400 text-black">
              <span className="text-xl font-extrabold">R</span>
            </div>

            <div>
              <p className="text-lg font-extrabold tracking-tight text-white">
                Result<span className="text-yellow-400">Board</span>
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/50">
                Result Dashboard
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  getLinkClass(isActive)
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Admin Login */}
          <div className="hidden md:block">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 rounded-lg bg-yellow-400 px-4 py-2.5 text-sm font-bold text-black transition-colors duration-150 hover:bg-yellow-300"
            >
              <ShieldCheck size={17} />
              Admin Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-white/15 p-2 text-white transition-colors hover:border-yellow-400 hover:text-yellow-400 md:hidden"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <nav className="border-t border-white/10 py-4 md:hidden">
            <div className="space-y-1">
              {links.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.path === "/"}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-yellow-400/10 text-yellow-400"
                        : "text-white/75 hover:bg-white/5 hover:text-yellow-400"
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <Link
                to="/admin/login"
                onClick={closeMenu}
                className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-yellow-400 px-4 py-3 text-sm font-bold text-black hover:bg-yellow-300"
              >
                <ShieldCheck size={17} />
                Admin Login
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navbar;
