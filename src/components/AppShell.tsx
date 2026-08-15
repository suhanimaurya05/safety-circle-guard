import { Link, useRouterState } from "@tanstack/react-router";
import {
  Bell,
  Contact,
  FileWarning,
  LayoutDashboard,
  LifeBuoy,
  MapPin,
  PhoneOutgoing,
  Route as RouteIcon,
  Settings,
  ShieldAlert,
  ShieldCheck,
  WifiOff,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { useOnline, useSafety } from "@/lib/safety-store";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/sos", label: "SOS", icon: ShieldAlert },
  { to: "/contacts", label: "Emergency Contacts", icon: Contact },
  { to: "/location", label: "Live Location", icon: MapPin },
  { to: "/nearby", label: "Nearby Help", icon: LifeBuoy },
  { to: "/safe-route", label: "Safe Route", icon: RouteIcon },
  { to: "/fake-call", label: "Fake Call", icon: PhoneOutgoing },
  { to: "/report", label: "Report Incident", icon: FileWarning },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const MOBILE_NAV = [NAV[0], NAV[2], NAV[3], NAV[4], NAV[8]];

const BARE_ROUTES = ["/login", "/signup", "/onboarding"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { profile, sosActiveSince } = useSafety();
  const online = useOnline();
  const bare = BARE_ROUTES.some((p) => pathname.startsWith(p));

  if (bare) {
    return <main className="min-h-dvh">{children}</main>;
  }

  const initials = (profile?.fullName ?? "Guest")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-dvh bg-background">
      <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-3 py-5 lg:flex">
        <Link to="/" className="mb-6 flex items-center gap-2 px-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight">SheShield</span>
        </Link>
        <nav aria-label="Main navigation" className="flex flex-col gap-1">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  item.to === "/sos" && "text-sos hover:text-sos",
                )}
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-xl border border-border bg-secondary p-3 text-xs text-muted-foreground">
          Demo build: emergency services, SMS and map providers are not connected.
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
          <div className="flex items-center gap-2 px-4 py-3 sm:px-6">
            <Link to="/" className="flex items-center gap-2 lg:hidden">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-bold">SheShield</span>
            </Link>
            <div className="ml-auto flex items-center gap-1.5">
              {!online && (
                <span className="mr-1 flex items-center gap-1 rounded-full bg-warning-soft px-2.5 py-1 text-xs font-medium text-warning-foreground">
                  <WifiOff className="h-3.5 w-3.5" aria-hidden="true" /> Offline
                </span>
              )}
              <Button asChild size="sm" variant="destructive" className="min-h-11 lg:hidden">
                <Link to="/sos" aria-label="Open Emergency SOS">
                  <ShieldAlert aria-hidden="true" /> SOS
                </Link>
              </Button>
              <Button variant="ghost" size="icon" aria-label="Notifications" className="min-h-11 min-w-11">
                <Bell aria-hidden="true" />
              </Button>
              <Button asChild variant="ghost" size="icon" aria-label="Settings" className="min-h-11 min-w-11">
                <Link to="/settings">
                  <Settings aria-hidden="true" />
                </Link>
              </Button>
              <Link
                to="/settings"
                aria-label="Your profile"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-accent-foreground"
              >
                {initials || "SS"}
              </Link>
            </div>
          </div>
          {sosActiveSince && (
            <Link
              to="/sos"
              className="flex items-center justify-center gap-2 bg-sos px-4 py-2 text-sm font-semibold text-sos-foreground"
            >
              <ShieldAlert className="h-4 w-4" aria-hidden="true" /> SOS is active — tap to manage
            </Link>
          )}
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-5 pb-28 sm:px-6 lg:pb-10">
          {children}
        </main>

        <nav
          aria-label="Primary mobile navigation"
          className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-card/95 backdrop-blur lg:hidden"
        >
          <ul className="mx-auto flex max-w-lg items-stretch justify-between px-1 py-1.5">
            {MOBILE_NAV.map((item) => {
              const active = pathname === item.to;
              return (
                <li key={item.to} className="flex-1">
                  <Link
                    to={item.to}
                    className={cn(
                      "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-1 text-[11px] font-medium",
                      active ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                    <span className="truncate">{item.label.split(" ").at(-1)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: typeof ShieldAlert;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start gap-3">
      {Icon && (
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-accent-foreground">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="ml-auto">{action}</div>}
    </div>
  );
}
