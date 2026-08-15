import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Contact = {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  primary: boolean;
  notifyOnSos: boolean;
};

export type Profile = {
  fullName: string;
  email: string;
  phone: string;
};

export type IncidentReport = {
  id: string;
  type: string;
  when: string;
  location: string;
  description: string;
  attachment?: string;
  createdAt: number;
};

type State = {
  profile: Profile | null;
  contacts: Contact[];
  reports: IncidentReport[];
  sosActiveSince: number | null;
  sharingSince: number | null;
  locationEnabled: boolean;
  onboarded: boolean;
};

const KEY = "sheshield-state-v1";

const defaultState: State = {
  profile: null,
  contacts: [],
  reports: [],
  sosActiveSince: null,
  sharingSince: null,
  locationEnabled: true,
  onboarded: false,
};

type Store = State & {
  ready: boolean;
  signIn: (profile: Profile) => void;
  signOut: () => void;
  setOnboarded: (v: boolean) => void;
  addContact: (c: Omit<Contact, "id">) => void;
  updateContact: (id: string, patch: Partial<Contact>) => void;
  removeContact: (id: string) => void;
  activateSos: () => void;
  endSos: () => void;
  startSharing: () => void;
  stopSharing: () => void;
  setLocationEnabled: (v: boolean) => void;
  addReport: (r: Omit<IncidentReport, "id" | "createdAt">) => void;
};

const SafetyContext = createContext<Store | null>(null);

export function SafetyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...defaultState, ...(JSON.parse(raw) as State) });
    } catch {
      /* ignore corrupted storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, ready]);

  const patch = useCallback((p: Partial<State>) => setState((s) => ({ ...s, ...p })), []);

  const value = useMemo<Store>(
    () => ({
      ...state,
      ready,
      signIn: (profile) => patch({ profile }),
      signOut: () => setState({ ...defaultState, onboarded: state.onboarded }),
      setOnboarded: (v) => patch({ onboarded: v }),
      addContact: (c) =>
        setState((s) => ({
          ...s,
          contacts: [
            ...s.contacts.map((x) => (c.primary ? { ...x, primary: false } : x)),
            { ...c, id: crypto.randomUUID() },
          ],
        })),
      updateContact: (id, p) =>
        setState((s) => ({
          ...s,
          contacts: s.contacts.map((x) =>
            x.id === id
              ? { ...x, ...p }
              : p.primary
                ? { ...x, primary: false }
                : x,
          ),
        })),
      removeContact: (id) =>
        setState((s) => ({ ...s, contacts: s.contacts.filter((x) => x.id !== id) })),
      activateSos: () => patch({ sosActiveSince: Date.now(), sharingSince: Date.now() }),
      endSos: () => patch({ sosActiveSince: null, sharingSince: null }),
      startSharing: () => patch({ sharingSince: Date.now() }),
      stopSharing: () => patch({ sharingSince: null }),
      setLocationEnabled: (v) => patch({ locationEnabled: v }),
      addReport: (r) =>
        setState((s) => ({
          ...s,
          reports: [{ ...r, id: crypto.randomUUID(), createdAt: Date.now() }, ...s.reports],
        })),
    }),
    [state, ready, patch],
  );

  return <SafetyContext.Provider value={value}>{children}</SafetyContext.Provider>;
}

export function useSafety() {
  const ctx = useContext(SafetyContext);
  if (!ctx) throw new Error("useSafety must be used inside SafetyProvider");
  return ctx;
}

export function useElapsed(since: number | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!since) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [since]);
  if (!since) return "00:00";
  const total = Math.max(0, Math.floor((now - since) / 1000));
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export function useOnline() {
  const [online, setOnline] = useState(true);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return online;
}
