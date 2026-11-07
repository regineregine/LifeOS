import {
  LayoutDashboard,
  CheckSquare,
  CalendarDays,
  Wallet,
  Target,
  BrainCircuit,
  Settings,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";

type SidebarProps = {
  activeSection: string;
  onNavigate: (section: string) => void;
};

function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuItem =
    "flex items-center gap-3 px-4 py-3 rounded-xl transition w-full text-left";

  const navigationItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: CheckSquare, label: "My Tasks" },
    { icon: CalendarDays, label: "Calendar" },
    { icon: Wallet, label: "Finance" },
    { icon: Target, label: "Goals" },
    { icon: BrainCircuit, label: "AI Assistant" },
  ];

  return (
  <>
    {/* Mobile Menu Button */}
    <button
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg border"
      style={{
        background: "var(--bg-secondary)",
        borderColor: "var(--border-color)",
        color: "var(--text-primary)",
      }}
    >
      {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>

    {/* Sidebar */}
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 min-h-screen flex flex-col p-5 pt-16 md:pt-5 border-r transform transition-transform duration-300 md:static md:translate-x-0 ${
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{
        background: "var(--bg-sidebar)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: "var(--text-primary)" }}
        >
          <BrainCircuit color="var(--bg-primary)" size={24} />
        </div>

        <div>
          <h1 className="text-xl font-bold">LifeOS</h1>
          <p
            className="text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            Personal Life Manager
          </p>
        </div>
      </div>

      {/* Navigation */}
      <p
        className="text-xs font-semibold uppercase mb-4"
        style={{ color: "var(--text-secondary)" }}
      >
        Menu
      </p>

      <nav className="flex flex-col gap-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.label;

          return (
            <button
              key={item.label}
              onClick={() => {
  onNavigate(item.label);
  setMobileMenuOpen(false);
}}
              className={
                menuItem +
                (isActive
                  ? ""
                  : " hover:bg-black/5 dark:hover:bg-white/5")
              }
              style={{
                background: isActive
                  ? "var(--text-primary)"
                  : "transparent",
                color: isActive
                  ? "var(--bg-primary)"
                  : "var(--text-secondary)",
              }}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <div
        className="mt-auto pt-6 border-t"
        style={{ borderColor: "var(--border-color)" }}
      >
        <button
          onClick={() => {
  onNavigate("Settings");
  setMobileMenuOpen(false);
}}
          className={
            menuItem +
            (activeSection === "Settings"
              ? ""
              : " hover:bg-black/5 dark:hover:bg-white/5")
          }
          style={{
            background:
              activeSection === "Settings"
                ? "var(--text-primary)"
                : "transparent",
            color:
              activeSection === "Settings"
                ? "var(--bg-primary)"
                : "var(--text-secondary)",
          }}
        >
          <Settings size={20} />
          Settings
        </button>

        <div className="flex items-center gap-3 mt-5">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
            style={{
              background: "var(--text-primary)",
              color: "var(--bg-primary)",
            }}
          >
            U
          </div>

          <div>
            <p className="text-sm font-semibold">User</p>
            <p
              className="text-xs"
              style={{ color: "var(--text-secondary)" }}
            >
              Free Plan
            </p>
          </div>
        </div>
      </div>
        </aside>
  </>
  );
}

export default Sidebar;
