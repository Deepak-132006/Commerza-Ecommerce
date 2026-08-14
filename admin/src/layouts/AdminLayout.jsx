import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Tags, ClipboardList, LogOut, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import Logo from "../assets/logo/Logo-LS-NoBG.png"

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/products", label: "Products", icon: Package },
  { to: "/categories", label: "Categories", icon: Tags },
  { to: "/orders", label: "Orders", icon: ClipboardList },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen flex font-body" style={{ backgroundColor: "var(--color-porcelain)" }}>
      {/* Sidebar */}
      <aside
        className="w-60 shrink-0 hidden md:flex flex-col justify-between px-4 py-6"
        style={{ backgroundColor: "var(--color-evergreen)" }}
      >
        <div>
          <div className="flex items-center gap-2 px-2 mb-8 bg-cwhite p-2 rounded-xl">
            <img src={Logo} alt="" />
          </div>

          <nav className="space-y-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive ? "font-medium" : "opacity-70 hover:opacity-100"
                  }`
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? "var(--color-hunter-green)" : "transparent",
                  color: "var(--color-cwhite)",
                })}
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="px-2">
          <div className="flex items-center gap-2 px-1 mb-3">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
              style={{ backgroundColor: "var(--color-soft-fawn)", color: "var(--color-evergreen)" }}
            >
              {(user?.name || user?.email || "A").charAt(0).toUpperCase()}
            </div>
            <span className="text-xs truncate" style={{ color: "rgba(253,253,255,0.7)" }}>
              {user?.email}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: "var(--color-cwhite)" }}
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <main className="max-w-6xl mx-auto px-5 md:px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
