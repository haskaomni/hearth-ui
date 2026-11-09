import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { cx } from "../utils";

export type ThemeMode = "light" | "dark" | "system";
type ThemeCtx = { mode: ThemeMode; resolved: "light" | "dark"; setMode: (m: ThemeMode) => void };

const ThemeContext = React.createContext<ThemeCtx | null>(null);

export interface ThemeProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Initial mode (uncontrolled). Default: "system". */
  defaultMode?: ThemeMode;
  /** Controlled mode. */
  mode?: ThemeMode;
  onModeChange?: (mode: ThemeMode) => void;
  /** Persist the choice in localStorage under this key. Pass `false` to disable. */
  storageKey?: string | false;
  /** Also set `data-hx-theme` on <html> so portals / body pick up the theme. */
  applyToDocument?: boolean;
}

function readStored(key: string | false): ThemeMode | null {
  if (!key) return null;
  try {
    const v = window.localStorage.getItem(key);
    return v === "light" || v === "dark" || v === "system" ? v : null;
  } catch {
    return null;
  }
}

/** Wraps your app, provides the `hx-root` base styles and the light / dark token set. */
export function ThemeProvider({
  defaultMode = "system",
  mode: controlled,
  onModeChange,
  storageKey = "hx-theme",
  applyToDocument = true,
  className,
  children,
  ...rest
}: ThemeProviderProps) {
  const [inner, setInner] = React.useState<ThemeMode>(() =>
    typeof window === "undefined" ? defaultMode : readStored(storageKey) ?? defaultMode,
  );
  const mode = controlled ?? inner;
  const [systemDark, setSystemDark] = React.useState(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches,
  );

  React.useEffect(() => {
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mq) return;
    const fn = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const resolved: "light" | "dark" = mode === "system" ? (systemDark ? "dark" : "light") : mode;

  React.useEffect(() => {
    if (!applyToDocument) return;
    document.documentElement.setAttribute("data-hx-theme", resolved);
  }, [resolved, applyToDocument]);

  const setMode = React.useCallback(
    (m: ThemeMode) => {
      if (controlled === undefined) setInner(m);
      if (storageKey) {
        try {
          window.localStorage.setItem(storageKey, m);
        } catch {
          /* storage unavailable — ignore */
        }
      }
      onModeChange?.(m);
    },
    [controlled, storageKey, onModeChange],
  );

  const value = React.useMemo(() => ({ mode, resolved, setMode }), [mode, resolved, setMode]);

  return (
    <ThemeContext.Provider value={value}>
      <div {...rest} className={cx("hx-root", className)} data-hx-theme={resolved}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeCtx {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

export interface ThemeSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
  labels?: Partial<Record<ThemeMode, string>>;
}

/** Light / Dark / System pill switch (sidebar footer in the design). */
export function ThemeSwitcher({ labels, className, ...rest }: ThemeSwitcherProps) {
  const { mode, setMode } = useTheme();
  const items: { m: ThemeMode; icon: React.ReactNode; label: string }[] = [
    { m: "light", icon: <Sun />, label: labels?.light ?? "Light" },
    { m: "dark", icon: <Moon />, label: labels?.dark ?? "Dark" },
    { m: "system", icon: <Monitor />, label: labels?.system ?? "System" },
  ];
  return (
    <div role="group" aria-label="Theme" {...rest} className={cx("hx-theme-switch", className)}>
      {items.map((it) => (
        <button key={it.m} type="button" aria-pressed={mode === it.m} onClick={() => setMode(it.m)}>
          {it.icon}
          {it.label}
        </button>
      ))}
    </div>
  );
}
