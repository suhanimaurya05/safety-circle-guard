import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronRight,
  Contact,
  HelpCircle,
  Lock,
  LogOut,
  MapPin,
  Settings as SettingsIcon,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSafety } from "@/lib/safety-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — SheShield" },
      {
        name: "description",
        content:
          "Manage your profile, emergency contacts, location permissions, notifications, privacy and security settings.",
      },
      { property: "og:title", content: "Settings — SheShield" },
      {
        property: "og:description",
        content: "Control permissions, privacy and notifications for your safety app.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { profile, contacts, locationEnabled, setLocationEnabled, signOut } = useSafety();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(true);
  const [sound, setSound] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" icon={SettingsIcon} description="Your profile, permissions and privacy." />

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <User className="h-5 w-5" aria-hidden="true" /> Profile
        </h2>
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-lg font-semibold text-accent-foreground">
            {(profile?.fullName ?? "Guest User")
              .split(" ")
              .map((p) => p[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="font-semibold">{profile?.fullName ?? "Guest user"}</p>
            <p className="truncate text-sm text-muted-foreground">
              {profile?.email ?? "Not signed in"}
            </p>
            <p className="text-sm text-muted-foreground">{profile?.phone ?? "No phone saved"}</p>
          </div>
        </div>
        {!profile && (
          <Button asChild className="mt-4 min-h-11">
            <Link to="/login">Sign in to save your details</Link>
          </Button>
        )}
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <Row
          to="/contacts"
          icon={Contact}
          title="Emergency contacts"
          subtitle={`${contacts.length} saved · ${contacts.filter((c) => c.notifyOnSos).length} alerted on SOS`}
        />
        <Row to="/location" icon={MapPin} title="Live location" subtitle="Manage sharing sessions" />
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-1 flex items-center gap-2 font-semibold">
          <MapPin className="h-5 w-5" aria-hidden="true" /> Location permissions
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Your location is used to show your position, share it with contacts you select, and find
          nearby help. It is only shared while sharing or SOS is active, and never sold or shown
          publicly.
        </p>
        <Toggle
          label="Allow location access"
          description="Required for SOS location, live sharing and nearby help."
          checked={locationEnabled}
          onChange={setLocationEnabled}
        />
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <Bell className="h-5 w-5" aria-hidden="true" /> Notification preferences
        </h2>
        <div className="space-y-3">
          <Toggle
            label="Safety alerts"
            description="Status changes, sharing reminders and SOS confirmations."
            checked={alerts}
            onChange={setAlerts}
          />
          <Toggle
            label="Alert sound & vibration"
            description="Play a sound when an alert is triggered."
            checked={sound}
            onChange={setSound}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-card">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <Lock className="h-5 w-5" aria-hidden="true" /> Privacy
        </h2>
        <Toggle
          label="Share anonymous usage data"
          description="Helps improve reliability. Never includes location or reports."
          checked={analytics}
          onChange={setAnalytics}
        />
      </section>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <Row to="/onboarding" icon={Shield} title="Security & how SOS works" subtitle="Review the safety basics" />
        <Row to="/report" icon={HelpCircle} title="Help & support" subtitle="Report an issue or incident" />
      </section>

      <Button
        variant="outline"
        className="min-h-12 w-full border-sos text-sos"
        onClick={() => {
          signOut();
          toast.success("Signed out");
          navigate({ to: "/login" });
        }}
      >
        <LogOut aria-hidden="true" /> Log out
      </Button>
    </div>
  );
}

function Row({
  to,
  icon: Icon,
  title,
  subtitle,
}: {
  to: "/contacts" | "/location" | "/onboarding" | "/report";
  icon: typeof MapPin;
  title: string;
  subtitle: string;
}) {
  return (
    <Link
      to={to}
      className="flex min-h-16 items-center gap-3 border-b border-border px-5 py-3 last:border-0 hover:bg-secondary"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-accent-foreground">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block font-medium">{title}</span>
        <span className="block text-sm text-muted-foreground">{subtitle}</span>
      </span>
      <ChevronRight className="ml-auto h-5 w-5 text-muted-foreground" aria-hidden="true" />
    </Link>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border p-3">
      <div className="min-w-0">
        <p className="font-medium">{label}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}
