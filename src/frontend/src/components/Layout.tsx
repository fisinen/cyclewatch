import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/hooks/useDarkMode";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Outlet } from "@tanstack/react-router";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { NavLink } from "./NavLink";

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
];

function truncatePrincipal(principal: string): string {
  if (principal.length <= 16) return principal;
  return `${principal.slice(0, 6)}…${principal.slice(-6)}`;
}

export function Layout() {
  const { clear, identity, isLoginSuccess } = useInternetIdentity();
  const { isDark, toggle: toggleDark } = useDarkMode();
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const principalText = identity?.getPrincipal().toText() ?? "";

  const handleCopy = () => {
    if (!principalText) return;
    navigator.clipboard.writeText(principalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close drawer on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const currentYear = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  // isLoggedIn: true whenever the user has a valid identity.
  // Use isLoginSuccess as the authoritative flag; fall back to !!principalText.
  const isLoggedIn = isLoginSuccess || !!principalText;

  // Shared sidebar inner content (used by both desktop sidebar and mobile drawer)
  function SidebarContent({
    onNavClick,
    isCollapsed,
  }: {
    onNavClick?: () => void;
    isCollapsed?: boolean;
  }) {
    return (
      <>
        {/* Logo */}
        <div
          className={cn(
            "flex items-center border-b border-border h-16 shrink-0 px-4",
            isCollapsed ? "justify-center" : "gap-2.5",
          )}
        >
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
            <Zap size={16} className="text-primary" />
          </div>
          {!isCollapsed && (
            <span className="text-base font-display font-semibold text-foreground whitespace-nowrap overflow-hidden">
              Cycle<span className="text-primary">Watch</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              collapsed={isCollapsed}
              onNavigate={onNavClick}
            />
          ))}
        </nav>

        {/* Identity footer */}
        {isLoggedIn && (
          <div
            className={cn(
              "border-t border-border p-3 space-y-2",
              isCollapsed && "flex flex-col items-center",
            )}
          >
            {!isCollapsed && (
              <div className="bg-muted/60 rounded-lg px-3 py-2">
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Principal
                </p>
                <div className="flex items-center gap-1.5">
                  <code className="text-xs font-mono text-foreground flex-1 min-w-0 truncate">
                    {truncatePrincipal(principalText)}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopy}
                    aria-label="Copy principal ID"
                    data-ocid="copy-principal-btn"
                    className="p-1 rounded hover:bg-border transition-smooth shrink-0"
                  >
                    {copied ? (
                      <Check size={12} className="text-accent" />
                    ) : (
                      <Copy size={12} className="text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => clear()}
              data-ocid="logout-btn"
              className={cn(
                "text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth",
                isCollapsed
                  ? "w-9 h-9 p-0 justify-center"
                  : "w-full justify-start gap-2 text-xs",
              )}
              aria-label="Sign out"
            >
              <LogOut size={14} />
              {!isCollapsed && "Sign out"}
            </Button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* ── Desktop sidebar (md+) ─────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 64 : 240 }}
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        className="hidden md:flex flex-col bg-card border-r border-border shrink-0 overflow-hidden"
        data-ocid="sidebar"
      >
        <SidebarContent isCollapsed={collapsed} />

        {/* Collapse toggle */}
        <div className="border-t border-border p-2 flex justify-end">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            data-ocid="sidebar-toggle"
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </motion.aside>

      {/* ── Mobile drawer overlay ─────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setDrawerOpen(false)}
              aria-hidden="true"
            />
            {/* Drawer panel */}
            <motion.aside
              key="drawer-panel"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-card border-r border-border shadow-lg md:hidden"
              data-ocid="mobile-drawer"
            >
              {/* Close button */}
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label="Close navigation"
                data-ocid="drawer-close-btn"
                className="absolute top-4 right-3 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth z-10"
              >
                <X size={16} />
              </button>

              <SidebarContent onNavClick={() => setDrawerOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-3 sm:px-6 shrink-0 shadow-sm">
          <div className="flex items-center gap-2 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation"
              data-ocid="hamburger-btn"
              className="p-2 -ml-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth md:hidden shrink-0"
            >
              <Menu size={18} />
            </button>
            <div className="h-2 w-2 rounded-full bg-accent animate-pulse shrink-0" />
            <span className="text-sm text-muted-foreground font-mono truncate min-w-0">
              {principalText
                ? truncatePrincipal(principalText)
                : "Not connected"}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-muted-foreground hidden sm:block">
              Internet Computer Network
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-accent hidden sm:block" />
            <button
              type="button"
              onClick={toggleDark}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              data-ocid="dark-mode-toggle"
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-smooth"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              type="button"
              onClick={() => clear()}
              aria-label="Sign out"
              data-ocid="header-logout-btn"
              className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto bg-background"
          data-ocid="main-content"
        >
          <Outlet />
        </main>

        {/* Footer — backend canister ID + controller-setup reminder */}
        <footer className="bg-muted/40 border-t border-border px-4 py-2.5 shrink-0">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
            <p className="text-[11px] text-muted-foreground text-center sm:text-left">
              © {currentYear}.{" "}
              <a
                href={caffeineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors duration-200"
              >
                Built with love using caffeine.ai
              </a>
            </p>
            <p className="text-[11px] text-muted-foreground text-center sm:text-right">
              Backend canister ID changes on redeploy — re-add it as a
              controller of your target canisters and reconnect after each
              redeploy.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
