import { createFileRoute } from "@tanstack/react-router";
import { Contact as ContactIcon, Pencil, Phone, Plus, Star, Trash2, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/Field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useSafety, type Contact } from "@/lib/safety-store";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Emergency Contacts — SheShield" },
      {
        name: "description",
        content:
          "Add, edit and choose the trusted contacts who get notified with your location when you activate SOS.",
      },
      { property: "og:title", content: "Emergency Contacts — SheShield" },
      {
        property: "og:description",
        content: "Manage the trusted people who are alerted when you press SOS.",
      },
    ],
  }),
  component: ContactsPage,
});

type FormState = {
  name: string;
  phone: string;
  relationship: string;
  primary: boolean;
  notifyOnSos: boolean;
};

const empty: FormState = {
  name: "",
  phone: "",
  relationship: "",
  primary: false,
  notifyOnSos: true,
};

function ContactsPage() {
  const { contacts, addContact, updateContact, removeContact } = useSafety();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    relationship?: string;
  }>({});

  const openNew = () => {
    setEditing(null);
    setForm(empty);
    setErrors({});
    setOpen(true);
  };

  const openEdit = (c: Contact) => {
    setEditing(c);
    setForm({ ...c });
    setErrors({});
    setOpen(true);
  };

  const submit = () => {
    const next: { name?: string; phone?: string; relationship?: string } = {};
    if (form.name.trim().length < 2) next.name = "Enter the contact's name.";
    if (!/^[+\d][\d\s-]{6,19}$/.test(form.phone.trim()))
      next.phone = "Enter a valid phone number (digits, spaces or +).";
    if (!form.relationship.trim()) next.relationship = "Add a relationship, e.g. Sister.";
    setErrors(next);
    if (Object.keys(next).length) return;

    if (editing) {
      updateContact(editing.id, form);
      toast.success("Contact updated");
    } else {
      addContact(form);
      toast.success("Contact added");
    }
    setOpen(false);
  };

  return (
    <div>
      <PageHeader
        title="Emergency Contacts"
        icon={ContactIcon}
        description="Your selected emergency contacts can be notified when you activate SOS."
        action={
          <Button onClick={openNew} className="min-h-11">
            <Plus aria-hidden="true" /> Add contact
          </Button>
        }
      />

      {contacts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-card">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-accent-foreground">
            <UserPlus className="h-7 w-7" aria-hidden="true" />
          </span>
          <h2 className="text-lg font-semibold">No emergency contacts yet</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            Add someone you trust — a family member or close friend — so they're alerted with your
            location when you press SOS.
          </p>
          <Button onClick={openNew} className="mt-5 min-h-12">
            <Plus aria-hidden="true" /> Add your first contact
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {contacts.map((c) => (
            <li key={c.id} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-accent-foreground">
                  {c.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()}
                </span>
                <div className="min-w-0">
                  <p className="flex items-center gap-2 font-semibold">
                    <span className="truncate">{c.name}</span>
                    {c.primary && (
                      <span className="flex items-center gap-1 rounded-full bg-safe-soft px-2 py-0.5 text-[11px] font-semibold text-safe">
                        <Star className="h-3 w-3" aria-hidden="true" /> Primary
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{c.relationship}</p>
                  <p className="mt-1 text-sm font-medium">{c.phone}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete ${c.name}`}
                  className="ml-auto min-h-11 min-w-11 text-muted-foreground"
                  onClick={() => {
                    removeContact(c.id);
                    toast.success("Contact removed");
                  }}
                >
                  <Trash2 aria-hidden="true" />
                </Button>
              </div>

              <label className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm">
                <span className="font-medium">Notify on SOS</span>
                <Switch
                  checked={c.notifyOnSos}
                  aria-label={`Notify ${c.name} when SOS is activated`}
                  onCheckedChange={(v) => updateContact(c.id, { notifyOnSos: v })}
                />
              </label>

              <div className="mt-3 flex gap-2">
                <Button asChild className="min-h-11 flex-1">
                  <a href={`tel:${c.phone.replace(/\s/g, "")}`}>
                    <Phone aria-hidden="true" /> Call
                  </a>
                </Button>
                <Button variant="outline" className="min-h-11 flex-1" onClick={() => openEdit(c)}>
                  <Pencil aria-hidden="true" /> Edit
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit contact" : "Add emergency contact"}</DialogTitle>
            <DialogDescription>
              Contacts marked "Notify on SOS" receive your alert and live location.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Field label="Full name" error={errors.name} id="c-name">
              <Input
                id="c-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Aditi Sharma"
                className="min-h-11"
              />
            </Field>
            <Field label="Phone number" error={errors.phone} id="c-phone">
              <Input
                id="c-phone"
                inputMode="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="min-h-11"
              />
            </Field>
            <Field label="Relationship" error={errors.relationship} id="c-rel">
              <Input
                id="c-rel"
                value={form.relationship}
                onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                placeholder="Sister, Friend, Mom…"
                className="min-h-11"
              />
            </Field>

            <label className="flex items-start gap-3 text-sm">
              <Checkbox
                checked={form.primary}
                onCheckedChange={(v) => setForm({ ...form, primary: Boolean(v) })}
                aria-label="Set as primary emergency contact"
              />
              <span>
                <span className="font-medium">Primary emergency contact</span>
                <span className="block text-muted-foreground">Contacted first in an emergency.</span>
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <Checkbox
                checked={form.notifyOnSos}
                onCheckedChange={(v) => setForm({ ...form, notifyOnSos: Boolean(v) })}
                aria-label="Notify this contact on SOS"
              />
              <span className="font-medium">Notify this contact when I activate SOS</span>
            </label>
          </div>

          <DialogFooter>
            <Button variant="outline" className="min-h-11" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button className="min-h-11" onClick={submit}>
              {editing ? "Save changes" : "Add contact"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
