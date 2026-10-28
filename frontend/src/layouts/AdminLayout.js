
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  MapPin,
  ClipboardList,
  LogOut,
  ExternalLink,
} from "lucide-react";

function AdminLayout({ children }) {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  }

  const links = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Manage Locations", path: "/admin/locations", icon: MapPin },
    { name: "Manage Results", path: "/admin/results", icon: ClipboardList },
  ];

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="flex w-full flex-col bg-slate-950 text-white lg:min-h-screen lg:w-64">
        <div className="border-b border-white/10 px-6 py-6">
          <p className="text-xl font-extrabold">
            Result<span className="text-blue-400">Board</span>
          </p>
          <p className="mt-1 text-xs text-slate-400">Administration panel</p>
        </div>

        <nav className="flex gap-2 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto hidden space-y-2 p-4 lg:block">
          <button
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 hover:bg-white/10"
          >
            <ExternalLink size={17} /> View Website
          </button>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-300 hover:bg-rose-500/10"
          >
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
          <div>
            <p className="font-bold text-slate-900">Admin Workspace</p>
            <p className="mt-1 text-xs text-slate-500">
              Manage published and waiting results
            </p>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
            Demo Mode
          </span>
        </header>

        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;
