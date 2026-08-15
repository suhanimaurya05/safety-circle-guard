import { Link } from "@tanstack/react-router";
import { AlertTriangle, PhoneCall, ShieldAlert, ShieldCheck, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useElapsed, useSafety } from "@/lib/safety-store";
import { cn } from "@/lib/utils";

const HOLD_MS = 3000;

export function SosHoldButton({ size = "lg" }: { size?: "lg" | "sm" }) {
  const { activateSos, sosActiveSince, contacts } = useSafety();
  const [progress, setProgress] = useState(0);
  const holding = useRef(false);
  const raf = useRef<number | null>(null);

  const stop = useCallback(() => {
    holding.current = false;
    if (raf.current) cancelAnimationFrame(raf.current);
    setProgress(0);
  }, []);

  useEffect(() => stop, [stop]);

  const start = useCallback(() => {
    if (holding.current || sosActiveSince) return;
    holding.current = true;
    const t0 = performance.now();
    const tick = (t: number) => {
      if (!holding.current) return;
      const p = Math.min(1, (t - t0) / HOLD_MS);
      setProgress(p);
      if (p >= 1) {
        holding.current = false;
        setProgress(0);
        activateSos();
        toast.error("SOS activated", {
          description: contacts.some((c) => c.notifyOnSos)
            ? "Your selected emergency contacts are being notified."
            : "No contacts selected for alerts — add them in Emergency Contacts.",
        });
        return;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, [activateSos, contacts, sosActiveSince]);

  const dim = size === "lg" ? "h-56 w-56 sm:h-64 sm:w-64" : "h-36 w-36";
  const pct = Math.round(progress * 100);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <svg
          viewBox="0 0 100 100"
          className={cn("absolute inset-0 -rotate-90", dim)}
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="47" className="fill-none stroke-sos-soft" strokeWidth="3" />
          <circle
            cx="50"
            cy="50"
            r="47"
            className="fill-none stroke-sos transition-[stroke-dashoffset] duration-75"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 47}
            strokeDashoffset={2 * Math.PI * 47 * (1 - progress)}
          />
        </svg>
        <button
          type="button"
          aria-label="Emergency SOS. Press and hold for three seconds to activate."
          onPointerDown={start}
          onPointerUp={stop}
          onPointerLeave={stop}
          onPointerCancel={stop}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              start();
            }
          }}
          onKeyUp={stop}
          className={cn(
            "relative m-3 flex flex-col items-center justify-center rounded-full bg-sos text-sos-foreground shadow-sos transition-transform duration-150 active:scale-95",
            progress > 0 ? "scale-95" : "animate-sos-pulse",
            size === "lg" ? "h-50 w-50 sm:h-58 sm:w-58" : "h-30 w-30",
          )}
          style={{
            width: size === "lg" ? "calc(100% - 1.5rem)" : undefined,
          }}
        >
          <ShieldAlert
            className={size === "lg" ? "mb-1 h-10 w-10" : "mb-0.5 h-6 w-6"}
            aria-hidden="true"
          />
          <span className={size === "lg" ? "text-2xl font-bold" : "text-sm font-bold"}>
            {progress > 0 ? `${pct}%` : "SOS"}
          </span>
          <span
            className={cn(
              "px-4 text-center opacity-90",
              size === "lg" ? "mt-1 text-xs" : "text-[10px]",
            )}
          >
            {progress > 0 ? "Keep holding…" : "Emergency SOS"}
          </span>
        </button>
        <div className={cn("pointer-events-none", dim)} />
      </div>

      <div className="text-center" aria-live="polite">
        <p className="font-medium text-foreground">
          {progress > 0 ? "Activating SOS…" : "Press and hold for 3 seconds"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {progress > 0 ? "Release to cancel before activation." : "Accidental taps won't trigger SOS."}
        </p>
      </div>

      {progress > 0 && (
        <Button variant="outline" size="lg" onClick={stop} className="min-h-11">
          <X aria-hidden="true" /> Cancel
        </Button>
      )}
    </div>
  );
}

export function SosActivePanel() {
  const { sosActiveSince, endSos, contacts, locationEnabled } = useSafety();
  const elapsed = useElapsed(sosActiveSince);
  const notified = contacts.filter((c) => c.notifyOnSos);

  return (
    <div className="rounded-2xl border-2 border-sos bg-sos-soft p-5 shadow-card sm:p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sos text-sos-foreground">
          <ShieldAlert className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-bold text-sos">SOS Active</h2>
          <p className="text-sm text-foreground">Active for {elapsed} · Help mode engaged</p>
        </div>
        <span className="ml-auto rounded-full bg-sos px-3 py-1 text-xs font-semibold text-sos-foreground uppercase">
          Live
        </span>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-4">
          <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Current location
          </dt>
          <dd className="mt-1 text-sm font-medium">
            {locationEnabled
              ? "Approximate location captured (device GPS not connected)"
              : "Unavailable — location permission is off"}
          </dd>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Live location sharing
          </dt>
          <dd className="mt-1 flex items-center gap-2 text-sm font-medium">
            <span className="h-2.5 w-2.5 rounded-full bg-safe" aria-hidden="true" />
            Sharing active with selected contacts
          </dd>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 sm:col-span-2">
          <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Emergency contacts being notified
          </dt>
          <dd className="mt-2 flex flex-wrap gap-2 text-sm">
            {notified.length ? (
              notified.map((c) => (
                <span
                  key={c.id}
                  className="rounded-full border border-border bg-secondary px-3 py-1 font-medium"
                >
                  {c.name} · {c.relationship}
                </span>
              ))
            ) : (
              <span className="flex items-center gap-2 text-warning-foreground">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                No contacts selected.{" "}
                <Link to="/contacts" className="font-semibold underline">
                  Add contacts
                </Link>
              </span>
            )}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="destructive" size="lg" className="min-h-12 flex-1">
          <a href="tel:112">
            <PhoneCall aria-hidden="true" /> Call emergency services
          </a>
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="min-h-12 flex-1 bg-card"
          onClick={() => {
            endSos();
            toast.success("SOS ended", { description: "You're marked safe again." });
          }}
        >
          <ShieldCheck aria-hidden="true" /> End SOS — I'm safe
        </Button>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Emergency dialling uses your device dialer. No emergency service integration is configured
        in this demo.
      </p>
    </div>
  );
}
