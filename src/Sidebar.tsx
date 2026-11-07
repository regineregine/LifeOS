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

import { useEffect, useState } from "react";

type SidebarProps = {
  activeSection: string;
  onNavigate: (section: string) => void;
};

function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const desktopMedia = window.matchMedia("(min-width: 1024px)");
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    desktopMedia.addEventListener("change", closeOnDesktop);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      desktopMedia.removeEventListener("change", closeOnDesktop);
    };
  }, [mobileMenuOpen]);

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

  const navigate = (section: string) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        aria-expanded={mobileMenuOpen}
        className="fixed left-3 top-3 z-60 flex h-11 w-11 items-center justify-center rounded-lg border shadow-sm lg:hidden"
        style={{
          background: "var(--bg-secondary)",
          borderColor: "var(--border-color)",
          color: "var(--text-primary)",
        }}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Background Overlay */}
      {mobileMenuOpen && (
        <button
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close navigation menu"
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`app-sidebar
          fixed inset-y-0 left-0 z-50
          h-screen w-72 max-w-[85vw] overflow-y-auto
          flex flex-col border-r p-5 pt-20
          transition-transform duration-300 ease-in-out
          lg:sticky lg:top-0 lg:h-screen lg:w-64
          lg:max-w-none lg:translate-x-0 lg:pt-5 lg:shrink-0
          ${
            mobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
        style={{
          backgroundColor: "var(--bg-sidebar)",
          borderColor: "var(--border-color)",
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 shrink-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "var(--accent)" }}
          >
            <BrainCircuit
              color="var(--bg-primary)"
              size={24}
            />
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

        {/* Navigation Label */}
        <p
          className="text-xs font-semibold uppercase mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Menu
        </p>

        {/* Navigation */}
        <nav className="flex flex-col gap-2" aria-label="Main navigation">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.label;

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.label)}
                className={`${menuItem} nav-item`}
                data-active={isActive}
                aria-current={isActive ? "page" : undefined}
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
            onClick={() => navigate("Settings")}
            className={`${menuItem} nav-item`}
            data-active={activeSection === "Settings"}
            aria-current={activeSection === "Settings" ? "page" : undefined}
          >
            <Settings size={20} />
            Settings
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 mt-5">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
              style={{
                background: "var(--accent)",
                color: "var(--accent-contrast)",
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
