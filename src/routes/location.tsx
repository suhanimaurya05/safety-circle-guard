import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Radio, ShieldCheck, Square, Users } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/AppShell";
import { MapCanvas } from "@/components/MapCanvas";
import { Button } from "@/components/ui/button";
import { useElapsed, useSafety } from "@/lib/safety-store";
import { Alert } from "./index";

export const Route = createFileRoute("/location")({
  head: () => ({
    meta: [
      { title: "Live Location Sharing — SheShield" },
      {
        name: "description",
        content:
          "Share your live location with selected emergency contacts, see sharing duration and stop sharing at any time.",
      },
      { property: "og:title", content: "Live Location Sharing — SheShield" },
      {
        property: "og:description",
        content: "Start or stop live location sharing with the people you trust.",
      },
    ],
  }),
  component: LocationPage,
});

function LocationPage() {
  const {
    sharingSince,
    startSharing,
    stopSharing,
    locationEnabled,
    setLocationEnabled,
    contacts,
    sosActiveSince,
  } = useSafety();
  const duration = useElapsed(sharingSince);
  const receivers = contacts.filter((c) => c.notifyOnSos);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Location"
        icon={MapPin}
        description="Let trusted contacts follow your location while you're on the move."
      />

      {!locationEnabled && (
        <Alert
          tone="warning"
          icon={MapPin}
          title="Location permission is disabled"
          body="We need location access to show your position and share it with your contacts. Nothing is shared until you start sharing."
          action={
            <Button size="sm" className="min-h-11" onClick={() => setLocationEnabled(true)}>
              Enable location
            </Button>
          }
        />
      )}

      {sharingSince && (
        <Alert
          tone="safe"
          icon={Radio}
          title="Live location sharing is active."
          body={`Sharing for ${duration} with ${receivers.length} selected contact(s).`}
        />
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card lg:col-span-2">
          <MapCanvas
            className="h-64 sm:h-80"
            showYou={locationEnabled}
            markers={[{ id: "you", x: 50, y: 44, label: "You", tone: "primary" }]}
          />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Stat label="Accuracy" value={locationEnabled ? "±12 m (estimated)" : "Unavailable"} />
            <Stat label="Sharing status" value={sharingSince ? "Active" : "Off"} />
            <Stat label="Duration" value={sharingSince ? duration : "—"} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="flex items-center gap-2 font-semibold">
              <ShieldCheck
                className={`h-5 w-5 ${sosActiveSince ? "text-sos" : "text-safe"}`}
                aria-hidden="true"
              />
              Safety status
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {sosActiveSince ? "SOS active — sharing is forced on." : "You're safe."}
            </p>
            {sharingSince ? (
              <Button
                variant="outline"
                className="mt-4 min-h-12 w-full"
                disabled={Boolean(sosActiveSince)}
                onClick={() => {
                  stopSharing();
                  toast.success("Location sharing stopped");
                }}
              >
                <Square aria-hidden="true" /> Stop sharing
              </Button>
            ) : (
              <Button
                className="mt-4 min-h-12 w-full"
                disabled={!locationEnabled}
                onClick={() => {
                  startSharing();
                  toast.success("Live location sharing started");
                }}
              >
                <Radio aria-hidden="true" /> Start sharing
              </Button>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <h2 className="flex items-center gap-2 font-semibold">
              <Users className="h-5 w-5" aria-hidden="true" /> Receiving your location
            </h2>
            {receivers.length ? (
              <ul className="mt-3 space-y-2 text-sm">
                {receivers.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
                  >
                    <span className="font-medium">{c.name}</span>
                    <span className="text-muted-foreground">{c.relationship}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                No contacts selected yet.{" "}
                <Link to="/contacts" className="font-semibold underline">
                  Choose contacts
                </Link>
              </p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              Location delivery requires a configured messaging provider; this demo shows the UI
              state only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary p-3">
      <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
