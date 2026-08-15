import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Field } from "@/components/Field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useSafety } from "@/lib/safety-store";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — SheShield" },
      {
        name: "description",
        content: "Sign in to SheShield to reach emergency SOS, your trusted contacts and live location sharing.",
      },
      { property: "og:title", content: "Sign in — SheShield" },
      { property: "og:description", content: "Sign in to your SheShield safety account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, onboarded } = useSafety();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: typeof errors = {};
    const id = identifier.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id);
    const isPhone = /^[+\d][\d\s-]{6,19}$/.test(id);
    if (!isEmail && !isPhone) next.identifier = "Enter a valid email or phone number.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    signIn({
      fullName: "SheShield User",
      email: isEmail ? id : "",
      phone: isPhone ? id : "",
    });
    toast.success("Signed in");
    navigate({ to: onboarded ? "/" : "/onboarding" });
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to reach SOS, your contacts and live location instantly."
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Email or phone number" id="identifier" error={errors.identifier}>
          <Input
            id="identifier"
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@example.com or +91 98765 43210"
            className="min-h-11"
          />
        </Field>

        <Field label="Password" id="password" error={errors.password}>
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-11 pr-12"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-1 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={remember}
              onCheckedChange={(v) => setRemember(Boolean(v))}
              aria-label="Remember me"
            />
            Remember me
          </label>
          <button
            type="button"
            className="text-sm font-medium text-primary underline"
            onClick={() =>
              toast.info("Password reset", {
                description: "Connect an auth provider to send reset links.",
              })
            }
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" className="min-h-12 w-full">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to SheShield?{" "}
        <Link to="/signup" className="font-semibold text-primary underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">{children}</div>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          Demo authentication — no credentials leave this device.
        </p>
      </div>
    </div>
  );
}
