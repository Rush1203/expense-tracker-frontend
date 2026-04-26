import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Home, PieChart, List } from "lucide-react";

export default function Layout() {
  const [open, setOpen] = useState(false);       // mobile
  const [collapsed, setCollapsed] = useState(false); // desktop

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">

      {/* OVERLAY (mobile only) */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 md:hidden transition ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static z-50 h-full bg-white border-r p-4
          transition-all duration-300 ease-in-out
          ${collapsed ? "md:w-20" : "md:w-64"}
          w-64
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* TOP */}
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h2 className="text-lg font-bold">💰 Expense</h2>
          )}

          {/* DESKTOP TOGGLE */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:block text-xl"
          >
            {collapsed ? "➡️" : "⬅️"}
          </button>

          {/* MOBILE CLOSE */}
          <button
            onClick={() => setOpen(false)}
            className="md:hidden text-xl"
          >
            ✕
          </button>
        </div>

        {/* NAV */}
        <nav className="space-y-2">

          <NavItem to="/dashboard" icon={<Home size={18} />} label="Dashboard" collapsed={collapsed} closeMobile={() => setOpen(false)} />

          <NavItem to="/analytics" icon={<PieChart size={18} />} label="Analytics" collapsed={collapsed} closeMobile={() => setOpen(false)} />

          <NavItem to="/transaction" icon={<List size={18} />} label="Transactions" collapsed={collapsed} closeMobile={() => setOpen(false)} />

        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOPBAR */}
        <div className="md:hidden bg-white p-4 shadow flex items-center justify-between">

          {/* HAMBURGER */}
          <button
            onClick={() => setOpen(!open)}
            className="w-10 h-10 flex flex-col justify-center items-center gap-1"
          >
            <span className={`block h-0.5 w-6 bg-black transition ${open ? "rotate-45 translate-y-1.5" : ""}`} />
            <span className={`block h-0.5 w-6 bg-black transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-black transition ${open ? "-rotate-45 -translate-y-1.5" : ""}`} />
          </button>

          <h1 className="font-semibold">Expense Tracker</h1>
        </div>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* 🔥 Reusable Nav Item */
function NavItem({ to, icon, label, collapsed, closeMobile }) {
  return (
    <NavLink
      to={to}
      onClick={closeMobile}
      className={({ isActive }) =>
        `flex items-center gap-3 p-2 rounded-lg transition group ${
          isActive
            ? "bg-blue-50 text-blue-600"
            : "hover:bg-gray-100"
        }`
      }
    >
      {icon}

      {/* TEXT */}
      {!collapsed && <span>{label}</span>}

      {/* TOOLTIP (collapsed mode) */}
      {collapsed && (
        <span className="absolute left-20 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100">
          {label}
        </span>
      )}
    </NavLink>
  );
}