import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Contact,
  FileWarning,
  LifeBuoy,
  MapPin,
  PhoneOutgoing,
  Route as RouteIcon,
  ShieldAlert,
  ShieldCheck,
  TriangleAlert,
  WifiOff,
} from "lucide-react";

import { MapCanvas } from "@/components/MapCanvas";
import { SosActivePanel, SosHoldButton } from "@/components/SosControl";
import { Button } from "@/components/ui/button";
import { useElapsed, useOnline, useSafety } from "@/lib/safety-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Safety Dashboard — SheShield" },
      {
        name: "description",
        content:
          "Your safety dashboard: hold-to-activate emergency SOS, live location status, trusted contacts and quick access to nearby help.",
      },
      { property: "og:title", content: "Safety Dashboard — SheShield" },
      {
        property: "og:description",
        content: "Emergency SOS, live location status and quick safety actions in one screen.",
      },
    ],
  }),
  component: Dashboard,
});

const QUICK = [
  { to: "/contacts", label: "Emergency Contacts", icon: Contact, hint: "Manage trusted people" },
  { to: "/location", label: "Live Location", icon: MapPin, hint: "Share where you are" },
  { to: "/nearby", label: "Nearby Help", icon: LifeBuoy, hint: "Police & hospitals" },
  { to: "/safe-route", label: "Safe Route", icon: RouteIcon, hint: "Plan a safer path" },
  { to: "/fake-call", label: "Fake Call", icon: PhoneOutgoing, hint: "Exit a situation" },
  { to: "/report", label: "Report Incident", icon: FileWarning, hint: "Log what happened" },
] as const;

function Dashboard() {
  const { profile, contacts, sosActiveSince, sharingSince, locationEnabled, setLocationEnabled } =
    useSafety();
  const sharingFor = useElapsed(sharingSince);
  const online = useOnline();
  const firstName = profile?.fullName?.split(" ")[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            {firstName ? `Hi ${firstName},` : "Welcome,"}
          </p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Safety dashboard</h1>
        </div>
        {!sosActiveSince && (
          <span className="ml-auto flex items-center gap-2 rounded-full bg-safe-soft px-3.5 py-2 text-sm font-semibold text-safe">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" /> You're Safe
          </span>
        )}
      </div>

      {!online && (
        <Alert
          tone="warning"
          icon={WifiOff}
          title="You're offline"
          body="SOS alerts and location sharing need a connection. Calling emergency services from your dialer still works."
        />
      )}

      {!locationEnabled && (
        <Alert
          tone="warning"
          icon={MapPin}
          title="Location permission is off"
          body="Without location we can't send your position to your contacts or find nearby help."
          action={
            <Button size="sm" className="min-h-11" onClick={() => setLocationEnabled(true)}>
              Enable location
            </Button>
          }
        />
      )}

      {contacts.length === 0 && (
        <Alert
          tone="warning"
          icon={TriangleAlert}
          title="No emergency contacts yet"
          body="Add at least one trusted contact so someone is notified when you press SOS."
          action={
            <Button asChild size="sm" className="min-h-11">
              <Link to="/contacts">Add contact</Link>
            </Button>
          }
        />
      )}

      {sosActiveSince ? (
        <SosActivePanel />
      ) : (
        <section
          aria-labelledby="sos-heading"
          className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-10"
        >
          <h2 id="sos-heading" className="sr-only">
            Emergency SOS
          </h2>
          <div className="flex flex-col items-center">
            <p className="mb-6 text-center text-lg font-semibold">Emergency SOS</p>
            <SosHoldButton />
          </div>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="font-semibold">Your location</h2>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                sharingSince ? "bg-safe-soft text-safe" : "bg-secondary text-muted-foreground"
              }`}
            >
              {sharingSince ? `Sharing · ${sharingFor}` : "Not sharing"}
            </span>
          </div>
          <MapCanvas className="h-52 sm:h-64" showYou={locationEnabled} />
          <Button asChild variant="outline" className="mt-4 min-h-11 w-full">
            <Link to="/location">
              <MapPin aria-hidden="true" /> Open live location
            </Link>
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <h2 className="mb-3 font-semibold">Status</h2>
          <ul className="space-y-3 text-sm">
            <StatusRow
              label="Safety status"
              value={sosActiveSince ? "SOS active" : "Safe"}
              tone={sosActiveSince ? "sos" : "safe"}
            />
            <StatusRow
              label="Contacts alerted on SOS"
              value={`${contacts.filter((c) => c.notifyOnSos).length} selected`}
              tone={contacts.some((c) => c.notifyOnSos) ? "safe" : "warning"}
            />
            <StatusRow
              label="Location permission"
              value={locationEnabled ? "Granted" : "Off"}
              tone={locationEnabled ? "safe" : "warning"}
            />
            <StatusRow
              label="Connection"
              value={online ? "Online" : "Offline"}
              tone={online ? "safe" : "warning"}
            />
          </ul>
          <Button asChild variant="destructive" className="mt-5 min-h-12 w-full">
            <Link to="/sos">
              <ShieldAlert aria-hidden="true" /> Go to SOS screen
            </Link>
          </Button>
        </div>
      </div>

      <section aria-labelledby="quick-heading">
        <h2 id="quick-heading" className="mb-3 font-semibold">
          Quick actions
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {QUICK.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="group flex min-h-24 flex-col gap-2 rounded-2xl border border-border bg-card p-4 shadow-card transition-transform hover:-translate-y-0.5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-accent-foreground">
                <q.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold">{q.label}</span>
              <span className="text-xs text-muted-foreground">{q.hint}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatusRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "safe" | "warning" | "sos";
}) {
  const dot =
    tone === "safe" ? "bg-safe" : tone === "warning" ? "bg-warning" : "bg-sos";
  return (
    <li className="flex items-center justify-between gap-2 border-b border-border pb-2 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2 font-medium">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden="true" />
        {value}
      </span>
    </li>
  );
}

export function Alert({
  tone,
  icon: Icon,
  title,
  body,
  action,
}: {
  tone: "warning" | "sos" | "safe";
  icon: typeof MapPin;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  const styles =
    tone === "warning"
      ? "border-warning bg-warning-soft text-warning-foreground"
      : tone === "sos"
        ? "border-sos bg-sos-soft text-foreground"
        : "border-safe bg-safe-soft text-foreground";
  return (
    <div className={`flex flex-wrap items-start gap-3 rounded-xl border p-4 ${styles}`} role="status">
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{title}</p>
        <p className="mt-0.5 text-sm opacity-90">{body}</p>
      </div>
      {action}
    </div>
  );
}
