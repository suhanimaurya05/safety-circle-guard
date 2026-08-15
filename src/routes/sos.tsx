import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneCall, ShieldAlert, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/AppShell";
import { SosActivePanel, SosHoldButton } from "@/components/SosControl";
import { Button } from "@/components/ui/button";
import { useSafety } from "@/lib/safety-store";

export const Route = createFileRoute("/sos")({
  head: () => ({
    meta: [
      { title: "Emergency SOS — SheShield" },
      {
        name: "description",
        content:
          "Hold the SOS button for 3 seconds to alert your trusted contacts and start live location sharing.",
      },
      { property: "og:title", content: "Emergency SOS — SheShield" },
      {
        property: "og:description",
        content: "Hold-to-activate SOS with a cancel window, so accidental taps never trigger an alert.",
      },
    ],
  }),
  component: SosPage,
});

function SosPage() {
  const { sosActiveSince, contacts } = useSafety();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Emergency SOS"
        icon={ShieldAlert}
        description="Activating SOS notifies your selected contacts and starts live location sharing."
      />

      {sosActiveSince ? (
        <SosActivePanel />
      ) : (
        <>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-10">
            <div className="flex flex-col items-center">
              <SosHoldButton />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="flex items-center gap-2 font-semibold">
                <ShieldCheck className="h-5 w-5 text-safe" aria-hidden="true" /> What happens on
                activation
              </h2>
              <ol className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>1. Your selected emergency contacts are notified.</li>
                <li>2. Live location sharing starts automatically.</li>
                <li>3. Emergency dialling stays one tap away.</li>
              </ol>
              <p className="mt-3 text-xs text-muted-foreground">
                {contacts.filter((c) => c.notifyOnSos).length} contact(s) currently selected for SOS
                alerts.{" "}
                <Link to="/contacts" className="font-semibold underline">
                  Manage
                </Link>
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <h2 className="font-semibold">Need help right now?</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Calling opens your device dialer. Confirm your local emergency number before use.
              </p>
              <Button asChild variant="destructive" className="mt-4 min-h-12 w-full">
                <a href="tel:112">
                  <PhoneCall aria-hidden="true" /> Call emergency services
                </a>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
