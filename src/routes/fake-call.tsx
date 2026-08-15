import { createFileRoute } from "@tanstack/react-router";
import { Mic, Phone, PhoneOff, PhoneOutgoing, Video, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { PageHeader } from "@/components/AppShell";
import { Field } from "@/components/Field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useElapsed } from "@/lib/safety-store";

export const Route = createFileRoute("/fake-call")({
  head: () => ({
    meta: [
      { title: "Fake Call — SheShield" },
      {
        name: "description",
        content:
          "Trigger a realistic incoming call after a chosen delay to help you leave an uncomfortable situation.",
      },
      { property: "og:title", content: "Fake Call — SheShield" },
      {
        property: "og:description",
        content: "Simulate an incoming call from Mom, Dad, a friend or a custom name.",
      },
    ],
  }),
  component: FakeCallPage,
});

const PRESETS = ["Mom", "Dad", "Friend", "Custom"];
const DELAYS = [
  { value: "0", label: "Immediately" },
  { value: "5", label: "In 5 seconds" },
  { value: "15", label: "In 15 seconds" },
  { value: "30", label: "In 30 seconds" },
];

function FakeCallPage() {
  const [preset, setPreset] = useState("Mom");
  const [custom, setCustom] = useState("");
  const [delay, setDelay] = useState("5");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [ringing, setRinging] = useState(false);
  const [answeredAt, setAnsweredAt] = useState<number | null>(null);
  const [error, setError] = useState<string>();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const callerName = preset === "Custom" ? custom.trim() : preset;
  const elapsed = useElapsed(answeredAt);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const start = () => {
    if (preset === "Custom" && custom.trim().length < 2) {
      setError("Enter a caller name (at least 2 characters).");
      return;
    }
    setError(undefined);
    const seconds = Number(delay);
    if (seconds === 0) {
      setRinging(true);
      return;
    }
    setCountdown(seconds);
    timer.current = setInterval(() => {
      setCountdown((c) => {
        if (c === null) return null;
        if (c <= 1) {
          if (timer.current) clearInterval(timer.current);
          setRinging(true);
          return null;
        }
        return c - 1;
      });
    }, 1000);
  };

  const cancel = () => {
    if (timer.current) clearInterval(timer.current);
    setCountdown(null);
  };

  const endCall = () => {
    setRinging(false);
    setAnsweredAt(null);
  };

  if (ringing) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-foreground px-6 py-14 text-background">
        <div className="mt-8 flex flex-col items-center text-center">
          <span className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-background/15 text-4xl font-semibold">
            {callerName.slice(0, 1).toUpperCase()}
          </span>
          <p className="text-3xl font-bold">{callerName}</p>
          <p className="mt-2 text-sm opacity-80" aria-live="polite">
            {answeredAt ? `Ongoing call · ${elapsed}` : "Incoming call · Mobile"}
          </p>
        </div>

        <div className="flex w-full max-w-xs items-center justify-around opacity-70">
          <Mic className="h-6 w-6" aria-hidden="true" />
          <Volume2 className="h-6 w-6" aria-hidden="true" />
          <Video className="h-6 w-6" aria-hidden="true" />
        </div>

        <div className="flex w-full max-w-sm items-center justify-between">
          <button
            type="button"
            onClick={endCall}
            aria-label={answeredAt ? "End call" : "Decline call"}
            className="flex h-18 w-18 items-center justify-center rounded-full bg-sos text-sos-foreground transition-transform active:scale-95"
          >
            <PhoneOff className="h-7 w-7" aria-hidden="true" />
          </button>
          {!answeredAt && (
            <button
              type="button"
              onClick={() => setAnsweredAt(Date.now())}
              aria-label="Answer call"
              className="flex h-18 w-18 animate-bounce items-center justify-center rounded-full bg-safe text-safe-foreground transition-transform active:scale-95"
            >
              <Phone className="h-7 w-7" aria-hidden="true" />
            </button>
          )}
        </div>
        <p className="text-xs opacity-60">Simulated call — this is not a real phone call.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Fake Call"
        icon={PhoneOutgoing}
        description="Simulate an incoming call to give yourself a reason to step away. This never contacts anyone."
      />

      <div className="max-w-xl space-y-5 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6">
        <Field label="Caller name" id="caller">
          <Select value={preset} onValueChange={setPreset}>
            <SelectTrigger id="caller" className="min-h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRESETS.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {preset === "Custom" && (
          <Field label="Custom caller name" id="custom" error={error}>
            <Input
              id="custom"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="e.g. Priya"
              className="min-h-11"
            />
          </Field>
        )}

        <Field label="Delay before call" id="delay">
          <Select value={delay} onValueChange={setDelay}>
            <SelectTrigger id="delay" className="min-h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DELAYS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        {countdown !== null ? (
          <div className="space-y-3 rounded-xl border border-border bg-secondary p-4 text-center">
            <p className="text-sm font-medium" aria-live="polite">
              Fake call from {callerName} in {countdown}s
            </p>
            <Button variant="outline" className="min-h-11 w-full" onClick={cancel}>
              Cancel fake call
            </Button>
          </div>
        ) : (
          <Button className="min-h-12 w-full" onClick={start}>
            <PhoneOutgoing aria-hidden="true" /> Start fake call
          </Button>
        )}

        <p className="text-xs text-muted-foreground">
          This feature is completely separate from Emergency SOS. Nobody is contacted and no alert is
          sent.
        </p>
      </div>
    </div>
  );
}
