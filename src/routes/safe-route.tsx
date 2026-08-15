import { createFileRoute } from "@tanstack/react-router";
import { Clock, Info, Route as RouteIcon, Search, ShieldCheck, TriangleAlert } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/AppShell";
import { Field } from "@/components/Field";
import { MapCanvas } from "@/components/MapCanvas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/safe-route")({
  head: () => ({
    meta: [
      { title: "Safe Route — SheShield" },
      {
        name: "description",
        content:
          "Compare route options with safety-oriented indicators such as lighting and busy streets before you travel.",
      },
      { property: "og:title", content: "Safe Route — SheShield" },
      {
        property: "og:description",
        content: "Plan a safer walk or ride with route comparisons and safety indicators.",
      },
    ],
  }),
  component: SafeRoutePage,
});

const ROUTES = [
  {
    id: "r1",
    name: "Main road route",
    distance: "2.4 km",
    time: "29 min walk",
    rating: "Better lit",
    tone: "safe" as const,
    notes: "Well-lit main roads, steady footfall, passes a police outpost.",
    points: "18,78 30,60 46,52 62,40 80,26",
  },
  {
    id: "r2",
    name: "Park shortcut",
    distance: "1.9 km",
    time: "23 min walk",
    rating: "Low lighting",
    tone: "warning" as const,
    notes: "Shorter but crosses an unlit park stretch with little footfall at night.",
    points: "18,78 34,74 52,66 66,50 80,26",
  },
  {
    id: "r3",
    name: "Market route",
    distance: "2.7 km",
    time: "33 min walk",
    rating: "Busy area",
    tone: "safe" as const,
    notes: "Longest option but busy shops and transit stops most of the way.",
    points: "18,78 24,54 40,40 58,32 80,26",
  },
];

function SafeRoutePage() {
  const [from, setFrom] = useState("Current location");
  const [to, setTo] = useState("");
  const [selected, setSelected] = useState("r1");
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string>();

  const active = ROUTES.find((r) => r.id === selected) ?? ROUTES[0]!;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Safe Route"
        icon={RouteIcon}
        description="Compare route options before you set out and pick the one that feels safest."
      />

      <form
        className="grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-card sm:grid-cols-[1fr_1fr_auto] sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          if (to.trim().length < 2) {
            setError("Enter a destination.");
            setSearched(false);
            return;
          }
          setError(undefined);
          setSearched(true);
        }}
      >
        <Field label="Starting location" id="from">
          <Input
            id="from"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="min-h-11"
          />
        </Field>
        <Field label="Destination" id="to" error={error}>
          <Input
            id="to"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder="Where are you going?"
            className="min-h-11"
          />
        </Field>
        <Button type="submit" className="min-h-11">
          <Search aria-hidden="true" /> Find routes
        </Button>
      </form>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <MapCanvas
            className="h-64 sm:h-80"
            showYou={false}
            markers={[
              { id: "start", x: 18, y: 84, label: "Start", tone: "primary" },
              { id: "end", x: 80, y: 26, label: "Destination", tone: "safe" },
            ]}
            route={[
              ...ROUTES.filter((r) => r.id !== selected).map((r) => ({
                points: r.points,
                tone: r.tone,
              })),
              { points: active.points, tone: "primary" as const },
            ]}
          />
        </div>

        <div className="space-y-3">
          {!searched && (
            <p className="rounded-xl border border-border bg-secondary p-4 text-sm text-muted-foreground">
              Enter a destination to compare route options. Sample routes are shown below.
            </p>
          )}
          <ul className="space-y-3" role="radiogroup" aria-label="Route options">
            {ROUTES.map((r) => {
              const isActive = r.id === selected;
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isActive}
                    onClick={() => setSelected(r.id)}
                    className={cn(
                      "w-full rounded-2xl border bg-card p-4 text-left shadow-card transition-colors",
                      isActive ? "border-primary ring-2 ring-primary/30" : "border-border",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{r.name}</span>
                      <span
                        className={cn(
                          "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                          r.tone === "safe"
                            ? "bg-safe-soft text-safe"
                            : "bg-warning-soft text-warning-foreground",
                        )}
                      >
                        {r.tone === "safe" ? (
                          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        {r.rating}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{r.distance}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {r.time}
                      </span>
                    </p>
                    <p className="mt-2 text-sm">{r.notes}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <p className="flex items-start gap-2 rounded-xl border border-border bg-secondary p-4 text-xs text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Route safety indicators depend on the data available and are not a guarantee of safety. Always
        use your own judgement, and prefer routes you know.
      </p>
    </div>
  );
}
