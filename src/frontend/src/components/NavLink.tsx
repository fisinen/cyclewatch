import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

interface NavLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function NavLink({
  to,
  icon: Icon,
  label,
  collapsed = false,
  onNavigate,
}: NavLinkProps) {
  const routerState = useRouterState();
  const isActive =
    routerState.location.pathname === to ||
    (to !== "/" && routerState.location.pathname.startsWith(to));

  return (
    <Link
      to={to}
      data-ocid={`nav-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
      onClick={onNavigate}
      className={cn(
        "group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-smooth",
        "hover:bg-surface-hover hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:text-foreground",
        collapsed && "justify-center px-2",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        size={18}
        className={cn(
          "shrink-0 transition-colors duration-200",
          isActive
            ? "text-primary"
            : "text-muted-foreground group-hover:text-foreground",
        )}
      />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}
