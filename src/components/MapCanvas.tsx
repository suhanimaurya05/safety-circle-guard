import { MapPin } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Marker = {
  id: string;
  x: number;
  y: number;
  label: string;
  tone?: "primary" | "sos" | "safe" | "warning";
};

const toneClass: Record<string, string> = {
  primary: "bg-primary text-primary-foreground",
  sos: "bg-sos text-sos-foreground",
  safe: "bg-safe text-safe-foreground",
  warning: "bg-warning text-warning-foreground",
};

export function MapCanvas({
  className,
  markers = [],
  route,
  you = { x: 50, y: 52 },
  showYou = true,
  overlay,
}: {
  className?: string;
  markers?: Marker[];
  route?: { points: string; tone?: "primary" | "safe" | "warning" }[];
  you?: { x: number; y: number };
  showYou?: boolean;
  overlay?: ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label="Map preview. Live map data is not connected in this demo."
      className={cn(
        "map-surface relative overflow-hidden rounded-xl border border-border",
        className,
      )}
    >
      <div className="absolute inset-0 opacity-70">
        <div className="absolute top-1/3 left-0 h-3 w-full bg-card/80" />
        <div className="absolute top-2/3 left-0 h-2 w-full bg-card/70" />
        <div className="absolute top-0 left-1/4 h-full w-3 bg-card/80" />
        <div className="absolute top-0 left-3/4 h-full w-2 bg-card/70" />
      </div>

      {route?.map((r, i) => (
        <svg key={i} viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <polyline
            points={r.points}
            fill="none"
            strokeWidth={r.tone === "primary" ? 2.4 : 1.6}
            strokeLinecap="round"
            strokeDasharray={r.tone === "primary" ? undefined : "4 3"}
            className={
              r.tone === "safe"
                ? "stroke-safe"
                : r.tone === "warning"
                  ? "stroke-warning"
                  : "stroke-primary"
            }
          />
        </svg>
      ))}

      {markers.map((m) => (
        <div
          key={m.id}
          className="absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${m.x}%`, top: `${m.y}%` }}
        >
          <div
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium shadow-lift",
              toneClass[m.tone ?? "primary"],
            )}
          >
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="max-w-28 truncate">{m.label}</span>
          </div>
        </div>
      ))}

      {showYou && (
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${you.x}%`, top: `${you.y}%` }}
        >
          <span className="absolute -inset-4 animate-ping rounded-full bg-primary/20" />
          <span className="relative block h-4 w-4 rounded-full border-2 border-card bg-primary shadow-lift" />
        </div>
      )}

      <div className="absolute right-2 bottom-2 rounded-md bg-card/90 px-2 py-1 text-[11px] text-muted-foreground">
        Map preview — no map provider connected
      </div>
      {overlay}
    </div>
  );
}
