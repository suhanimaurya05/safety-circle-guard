import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MapPin, ShieldAlert, Users } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useSafety } from "@/lib/safety-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "How SheShield keeps you safe" },
      {
        name: "description",
        content:
          "A quick tour of hold-to-activate SOS, emergency contacts and live location sharing in SheShield.",
      },
      { property: "og:title", content: "How SheShield keeps you safe" },
      {
        property: "og:description",
        content: "Learn SOS, emergency contacts and live location sharing in three short steps.",
      },
    ],
  }),
  component: OnboardingPage,
});

const STEPS = [
  {
    icon: ShieldAlert,
    tone: "sos",
    title: "How SOS works",
    body: "Press and hold the SOS button for 3 seconds. A progress ring shows the countdown and you can release to cancel — accidental taps never trigger an alert.",
  },
  {
    icon: Users,
    tone: "primary",
    title: "How emergency contacts work",
    body: "Add the people you trust and choose who gets alerted. When SOS activates, your selected contacts are notified with your location.",
  },
  {
    icon: MapPin,
    tone: "safe",
    title: "How live location sharing works",
    body: "Start sharing any time you're on the move, and stop with one tap. Sharing turns on automatically while SOS is active.",
  },
] as const;

function OnboardingPage() {
  const { setOnboarded } = useSafety();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const current = STEPS[step]!;
  const Icon = current.icon;

  const finish = () => {
    setOnboarded(true);
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-dvh flex-col items-center justify-between bg-background px-5 py-10">
      <div className="flex w-full max-w-md justify-end">
        <Button variant="ghost" className="min-h-11" onClick={finish}>
          Skip
        </Button>
      </div>

      <div className="w-full max-w-md text-center">
        <span
          className={cn(
            "mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl",
            current.tone === "sos" && "bg-sos-soft text-sos",
            current.tone === "primary" && "bg-primary-soft text-accent-foreground",
            current.tone === "safe" && "bg-safe-soft text-safe",
          )}
        >
          <Icon className="h-10 w-10" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-bold tracking-tight">{current.title}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">{current.body}</p>

        <div className="mt-8 flex justify-center gap-2" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span
              key={s.title}
              className={cn(
                "h-2 rounded-full transition-all",
                i === step ? "w-8 bg-primary" : "w-2 bg-border",
              )}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>

      <div className="flex w-full max-w-md gap-3">
        {step > 0 && (
          <Button variant="outline" className="min-h-12 flex-1" onClick={() => setStep(step - 1)}>
            Back
          </Button>
        )}
        <Button
          className="min-h-12 flex-1"
          onClick={() => (step === STEPS.length - 1 ? finish() : setStep(step + 1))}
        >
          {step === STEPS.length - 1 ? "Go to dashboard" : "Next"}
        </Button>
      </div>
    </div>
  );
}
