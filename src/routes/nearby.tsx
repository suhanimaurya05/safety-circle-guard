import { createFileRoute } from "@tanstack/react-router";
import { Building2, LifeBuoy, Navigation, Phone, Shield, Stethoscope } from "lucide-react";
import { useState } from "react";

import { PageHeader } from "@/components/AppShell";
import { MapCanvas } from "@/components/MapCanvas";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/nearby")({
  head: () => ({
    meta: [
      { title: "Nearby Help — SheShield" },
      {
        name: "description",
        content:
          "Find nearby police stations, hospitals and emergency services with one-tap calling and directions.",
      },
      { property: "og:title", content: "Nearby Help — SheShield" },
      {
        property: "og:description",
        content: "Police, hospitals and emergency services near you, with call and directions.",
      },
    ],
  }),
  component: NearbyPage,
});

type Category = "police" | "hospital" | "emergency";

const PLACES: {
  id: string;
  name: string;
  category: Category;
  distanceKm: number;
  address: string;
  phone: string;
  x: number;
  y: number;
}[] = [
  {
    id: "p1",
    name: "City Central Police Station",
    category: "police",
    distanceKm: 0.8,
    address: "12 Nehru Marg, Sector 4",
    phone: "112",
    x: 32,
    y: 34,
  },
  {
    id: "h1",
    name: "Sunrise General Hospital",
    category: "hospital",
    distanceKm: 1.4,
    address: "88 Hospital Road, Old Town",
    phone: "112",
    x: 68,
    y: 30,
  },
  {
    id: "p2",
    name: "Riverside Police Outpost",
    category: "police",
    distanceKm: 2.1,
    address: "5 Riverside Lane",
    phone: "112",
    x: 74,
    y: 68,
  },
  {
    id: "e1",
    name: "District Emergency Response Unit",
    category: "emergency",
    distanceKm: 2.6,
    address: "Civic Centre, Block B",
    phone: "112",
    x: 26,
    y: 72,
  },
  {
    id: "h2",
    name: "Mercy Women's Clinic",
    category: "hospital",
    distanceKm: 3.2,
    address: "44 Garden Street",
    phone: "112",
    x: 56,
    y: 80,
  },
];

const FILTERS: { key: Category | "all"; label: string; icon: typeof Shield }[] = [
  { key: "all", label: "All", icon: LifeBuoy },
  { key: "police", label: "Police", icon: Shield },
  { key: "hospital", label: "Hospitals", icon: Stethoscope },
  { key: "emergency", label: "Emergency Services", icon: Building2 },
];

function NearbyPage() {
  const [filter, setFilter] = useState<Category | "all">("all");
  const list = PLACES.filter((p) => filter === "all" || p.category === filter).sort(
    (a, b) => a.distanceKm - b.distanceKm,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Nearby Help"
        icon={LifeBuoy}
        description="Sample locations shown — connect a places provider to load real results near you."
      />

      <div
        role="group"
        aria-label="Filter nearby help by type"
        className="flex flex-wrap gap-2 overflow-x-auto"
      >
        {FILTERS.map((f) => (
          <Button
            key={f.key}
            variant={filter === f.key ? "default" : "outline"}
            className="min-h-11"
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
          >
            <f.icon aria-hidden="true" /> {f.label}
          </Button>
        ))}
      </div>

      <MapCanvas
        className="h-56 sm:h-72"
        markers={list.map((p) => ({
          id: p.id,
          x: p.x,
          y: p.y,
          label: p.name.split(" ")[0] ?? p.name,
          tone: p.category === "hospital" ? "safe" : p.category === "police" ? "primary" : "warning",
        }))}
      />

      {list.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-card">
          <h2 className="text-lg font-semibold">No services found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Nothing matched this filter nearby. Try another category or widen your search area.
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {list.map((p) => (
            <li key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    p.category === "police" && "bg-primary-soft text-accent-foreground",
                    p.category === "hospital" && "bg-safe-soft text-safe",
                    p.category === "emergency" && "bg-warning-soft text-warning-foreground",
                  )}
                >
                  {p.category === "police" ? (
                    <Shield className="h-5 w-5" aria-hidden="true" />
                  ) : p.category === "hospital" ? (
                    <Stethoscope className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Building2 className="h-5 w-5" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0">
                  <h2 className="font-semibold">{p.name}</h2>
                  <p className="text-sm text-muted-foreground">{p.address}</p>
                  <p className="mt-1 text-sm font-medium">{p.distanceKm.toFixed(1)} km away</p>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button asChild className="min-h-11 flex-1">
                  <a href={`tel:${p.phone}`}>
                    <Phone aria-hidden="true" /> Call
                  </a>
                </Button>
                <Button asChild variant="outline" className="min-h-11 flex-1">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${p.name} ${p.address}`,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Navigation aria-hidden="true" /> Directions
                  </a>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-muted-foreground">
        Phone numbers shown use the generic emergency number placeholder. Verify your local
        emergency numbers before relying on them.
      </p>
    </div>
  );
}
