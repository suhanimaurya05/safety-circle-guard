import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Field } from "@/components/Field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useSafety } from "@/lib/safety-store";
import { AuthLayout } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — SheShield" },
      {
        name: "description",
        content:
          "Create a SheShield account and add your first emergency contact so help is one hold away.",
      },
      { property: "og:title", content: "Create your account — SheShield" },
      {
        property: "og:description",
        content: "Set up SheShield with your details and a trusted emergency contact.",
      },
    ],
  }),
  component: SignupPage,
});

type Errors = Partial<
  Record<
    "fullName" | "email" | "phone" | "password" | "confirm" | "ecName" | "ecPhone" | "terms",
    string
  >
>;

function SignupPage() {
  const { signIn, addContact } = useSafety();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    ecName: "",
    ecPhone: "",
    ecRelationship: "",
  });
  const [show, setShow] = useState(false);
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (form.fullName.trim().length < 2) next.fullName = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next.email = "Enter a valid email address.";
    if (!/^[+\d][\d\s-]{6,19}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number.";
    if (form.password.length < 8) next.password = "Use at least 8 characters.";
    if (form.confirm !== form.password) next.confirm = "Passwords don't match.";
    if (form.ecName.trim().length < 2) next.ecName = "Add one emergency contact name.";
    if (!/^[+\d][\d\s-]{6,19}$/.test(form.ecPhone.trim()))
      next.ecPhone = "Enter a valid contact number.";
    if (!terms) next.terms = "Please accept the terms and privacy policy.";
    setErrors(next);
    if (Object.keys(next).length) return;

    signIn({
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    });
    addContact({
      name: form.ecName.trim(),
      phone: form.ecPhone.trim(),
      relationship: form.ecRelationship.trim() || "Emergency contact",
      primary: true,
      notifyOnSos: true,
    });
    toast.success("Account created");
    navigate({ to: "/onboarding" });
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="A few details now means faster help later."
    >
      <form onSubmit={submit} className="space-y-4" noValidate>
        <Field label="Full name" id="fullName" error={errors.fullName}>
          <Input id="fullName" value={form.fullName} onChange={set("fullName")} className="min-h-11" />
        </Field>
        <Field label="Email" id="email" error={errors.email}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={set("email")}
            className="min-h-11"
          />
        </Field>
        <Field label="Phone number" id="phone" error={errors.phone}>
          <Input
            id="phone"
            inputMode="tel"
            value={form.phone}
            onChange={set("phone")}
            placeholder="+91 98765 43210"
            className="min-h-11"
          />
        </Field>
        <Field label="Password" id="password" error={errors.password} hint="At least 8 characters.">
          <div className="relative">
            <Input
              id="password"
              type={show ? "text" : "password"}
              value={form.password}
              onChange={set("password")}
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
        <Field label="Confirm password" id="confirm" error={errors.confirm}>
          <Input
            id="confirm"
            type={show ? "text" : "password"}
            value={form.confirm}
            onChange={set("confirm")}
            className="min-h-11"
          />
        </Field>

        <fieldset className="space-y-4 rounded-xl border border-border p-4">
          <legend className="px-1 text-sm font-semibold">Emergency contact</legend>
          <p className="text-sm text-muted-foreground">
            This person can be notified with your location when you activate SOS.
          </p>
          <Field label="Contact name" id="ecName" error={errors.ecName}>
            <Input id="ecName" value={form.ecName} onChange={set("ecName")} className="min-h-11" />
          </Field>
          <Field label="Contact phone" id="ecPhone" error={errors.ecPhone}>
            <Input
              id="ecPhone"
              inputMode="tel"
              value={form.ecPhone}
              onChange={set("ecPhone")}
              className="min-h-11"
            />
          </Field>
          <Field label="Relationship (optional)" id="ecRel">
            <Input
              id="ecRel"
              value={form.ecRelationship}
              onChange={set("ecRelationship")}
              placeholder="Sister, Friend, Mom…"
              className="min-h-11"
            />
          </Field>
        </fieldset>

        <div>
          <label className="flex items-start gap-3 text-sm">
            <Checkbox
              checked={terms}
              onCheckedChange={(v) => setTerms(Boolean(v))}
              aria-label="Accept terms and privacy policy"
            />
            <span>I agree to the Terms of Service and Privacy Policy.</span>
          </label>
          {errors.terms && (
            <p className="mt-1.5 text-sm font-medium text-destructive" role="alert">
              {errors.terms}
            </p>
          )}
        </div>

        <Button type="submit" className="min-h-12 w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
