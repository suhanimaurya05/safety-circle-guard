import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, FileWarning, Lock, Paperclip } from "lucide-react";
import { useState } from "react";

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
import { Textarea } from "@/components/ui/textarea";
import { useSafety } from "@/lib/safety-store";

export const Route = createFileRoute("/report")({
  head: () => ({
    meta: [
      { title: "Report an Incident — SheShield" },
      {
        name: "description",
        content:
          "Privately log a harassment, stalking or unsafe-area incident with time, location, description and an optional attachment.",
      },
      { property: "og:title", content: "Report an Incident — SheShield" },
      {
        property: "og:description",
        content: "Record what happened privately, with time, place and details.",
      },
    ],
  }),
  component: ReportPage,
});

const TYPES = ["Harassment", "Suspicious activity", "Unsafe area", "Stalking", "Other"];

function ReportPage() {
  const { addReport } = useSafety();
  const [type, setType] = useState("");
  const [when, setWhen] = useState(() => new Date().toISOString().slice(0, 16));
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<string>("");
  const [errors, setErrors] = useState<{
    type?: string;
    when?: string;
    location?: string;
    description?: string;
  }>({});
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="mx-auto max-w-lg pt-8 text-center">
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-safe-soft text-safe">
          <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
        </span>
        <h1 className="text-2xl font-bold">Your report has been submitted.</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Your report is stored privately on this device and is never shown publicly. Connect a
          backend later to route reports to a support team.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            className="min-h-12"
            onClick={() => {
              setDone(false);
              setType("");
              setLocation("");
              setDescription("");
              setFile("");
            }}
          >
            Submit another report
          </Button>
          <Button asChild variant="outline" className="min-h-12">
            <Link to="/">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    if (!type) next.type = "Choose an incident type.";
    if (!when) next.when = "Add the date and time.";
    if (location.trim().length < 3) next.location = "Add where this happened.";
    if (description.trim().length < 10)
      next.description = "Please describe what happened (at least 10 characters).";
    setErrors(next);
    if (Object.keys(next).length) return;
    addReport({
      type,
      when,
      location: location.trim(),
      description: description.trim(),
      attachment: file,
    });
    setDone(true);
  };

  return (
    <div>
      <PageHeader
        title="Report Incident"
        icon={FileWarning}
        description="Record what happened while the details are fresh. Reports stay private."
      />

      <form onSubmit={submit} className="max-w-2xl space-y-5 rounded-2xl border border-border bg-card p-5 shadow-card sm:p-6" noValidate>
        <Field label="Incident type" id="type" error={errors.type}>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="type" className="min-h-11 w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Date and time" id="when" error={errors.when}>
          <Input
            id="when"
            type="datetime-local"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            className="min-h-11"
          />
        </Field>

        <Field
          label="Location"
          id="location"
          error={errors.location}
          hint="Street, landmark or area name."
        >
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Near Sector 9 bus stop"
            className="min-h-11"
          />
        </Field>

        <Field label="Description" id="description" error={errors.description}>
          <Textarea
            id="description"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened? Include anything that could help identify the situation."
          />
        </Field>

        <div className="space-y-1.5">
          <label
            htmlFor="attachment"
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-border px-4 py-3 text-sm font-medium"
          >
            <Paperclip className="h-4 w-4" aria-hidden="true" />
            {file || "Attach an image or file (optional)"}
          </label>
          <input
            id="attachment"
            type="file"
            className="sr-only"
            onChange={(e) => setFile(e.target.files?.[0]?.name ?? "")}
          />
        </div>

        <p className="flex items-start gap-2 rounded-xl bg-secondary p-3 text-xs text-muted-foreground">
          <Lock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Report details are never published or shared with other users.
        </p>

        <Button type="submit" className="min-h-12 w-full">
          Submit report
        </Button>
      </form>
    </div>
  );
}
