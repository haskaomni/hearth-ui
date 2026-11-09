import * as React from "react";
import { ChevronDown, ChevronLeft, ChevronsUpDown } from "lucide-react";
import { cx } from "../utils";
import { Avatar } from "./primitives";

/* ------------------------------------------------------------------ Tabs */

export interface TabItem {
  value: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  items: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: "sm" | "md";
  /** "inverse" = selected tab is solid black (W1/W2/W3 chips in the design). */
  variant?: "default" | "inverse";
  block?: boolean;
}

/** Segmented control. Arrow keys move the selection (WAI-ARIA tabs pattern). */
export function Tabs({ items, value, defaultValue, onValueChange, size = "md", variant = "default", block, className, ...rest }: TabsProps) {
  const [inner, setInner] = React.useState(defaultValue ?? items[0]?.value);
  const current = value ?? inner;
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);

  const select = (v: string) => {
    if (value === undefined) setInner(v);
    onValueChange?.(v);
  };

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    for (let s = 1; s <= items.length; s++) {
      const j = (i + dir * s + items.length) % items.length;
      if (!items[j]!.disabled) {
        select(items[j]!.value);
        refs.current[j]?.focus();
        break;
      }
    }
  };

  return (
    <div
      role="tablist"
      className={cx("hx-tabs", size === "sm" && "hx-tabs--sm", variant === "inverse" && "hx-tabs--inverse", block && "hx-tabs--block", className)}
      {...rest}
    >
      {items.map((it, i) => (
        <button
          key={it.value}
          ref={(el) => {
            refs.current[i] = el;
          }}
          role="tab"
          type="button"
          className="hx-tabs__tab"
          aria-selected={current === it.value}
          tabIndex={current === it.value ? 0 : -1}
          disabled={it.disabled}
          onClick={() => select(it.value)}
          onKeyDown={(e) => onKey(e, i)}
        >
          {it.icon}
          {it.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ AppShell */

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  sidebar: React.ReactNode;
  /** Mobile only: show the sidebar as an overlay drawer. */
  sidebarOpen?: boolean;
}

export function AppShell({ sidebar, sidebarOpen, className, children, ...rest }: AppShellProps) {
  return (
    <div className={cx("hx-shell", className)} data-sidebar-open={sidebarOpen || undefined} {...rest}>
      {sidebar}
      <main className="hx-shell__main">{children}</main>
    </div>
  );
}

export interface PageContentProps extends React.HTMLAttributes<HTMLDivElement> {
  narrow?: boolean;
}

export function PageContent({ narrow, className, ...rest }: PageContentProps) {
  return <div className={cx("hx-shell__content", narrow && "hx-shell__content--narrow", className)} {...rest} />;
}

/* ------------------------------------------------------------------ Sidebar */

export function Sidebar({ className, ...rest }: React.HTMLAttributes<HTMLElement>) {
  return <aside className={cx("hx-sidebar", className)} {...rest} />;
}

export interface SidebarBrandProps extends React.HTMLAttributes<HTMLDivElement> {
  logo: React.ReactNode;
  name: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export function SidebarBrand({ logo, name, subtitle, action, className, ...rest }: SidebarBrandProps) {
  return (
    <div className={cx("hx-sidebar__brand", className)} {...rest}>
      <span className="hx-sidebar__logo">{logo}</span>
      <div>
        <div className="hx-sidebar__brand-name">{name}</div>
        {subtitle && <div className="hx-sidebar__brand-sub">{subtitle}</div>}
      </div>
      {action && <span className="hx-sidebar__brand-action">{action}</span>}
    </div>
  );
}

export const SidebarSpacer = () => <div className="hx-sidebar__spacer" />;
export const SidebarDivider = () => <div className="hx-sidebar__divider" role="separator" />;

export interface NavGroupProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  /** When true the title becomes a toggle button. */
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function NavGroup({ title, collapsible, defaultCollapsed = false, className, children, ...rest }: NavGroupProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  const id = React.useId();
  return (
    <div className={cx("hx-nav-group", className)} data-collapsed={collapsible ? collapsed : undefined} {...rest}>
      {title &&
        (collapsible ? (
          <button type="button" className="hx-nav-group__label" aria-expanded={!collapsed} aria-controls={id} onClick={() => setCollapsed((c) => !c)}>
            {title}
            <ChevronDown />
          </button>
        ) : (
          <div className="hx-nav-group__label">{title}</div>
        ))}
      <div className="hx-nav-group__items" id={id}>
        {children}
      </div>
    </div>
  );
}

export interface NavItemProps extends React.AnchorHTMLAttributes<HTMLElement> {
  icon?: React.ReactNode;
  active?: boolean;
  count?: React.ReactNode;
  /** Right-aligned extra (e.g. a <Kbd/>). */
  trailing?: React.ReactNode;
  /** Smaller, indented item (recent chats list). */
  sub?: boolean;
  /** Render as a different element / router link, e.g. as={Link}. Defaults to <a> when href is set, otherwise <button>. */
  as?: React.ElementType;
}

export function NavItem({ icon, active, count, trailing, sub, as, href, className, children, ...rest }: NavItemProps) {
  const Comp: React.ElementType = as ?? (href ? "a" : "button");
  return (
    <Comp
      href={href}
      type={Comp === "button" ? "button" : undefined}
      aria-current={active ? "page" : undefined}
      className={cx("hx-nav-item", sub && "hx-nav-item--sub", className)}
      {...rest}
    >
      {icon}
      <span className="hx-nav-item__label">{children}</span>
      {count != null && <span className="hx-nav-item__count">{count}</span>}
      {trailing}
    </Comp>
  );
}

export interface UserCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  email?: string;
  avatarSrc?: string;
}

export function UserCard({ name, email, avatarSrc, className, ...rest }: UserCardProps) {
  return (
    <button type="button" className={cx("hx-user-card", className)} {...rest}>
      <Avatar src={avatarSrc} name={name} size={30} />
      <span className="hx-user-card__text">
        <div className="hx-user-card__name">{name}</div>
        {email && <div className="hx-user-card__email">{email}</div>}
      </span>
      <ChevronsUpDown />
    </button>
  );
}

/* ------------------------------------------------------------------ TopBar */

export interface TopBarProps extends React.HTMLAttributes<HTMLElement> {
  start?: React.ReactNode;
  end?: React.ReactNode;
}

export function TopBar({ start, end, className, ...rest }: TopBarProps) {
  return (
    <header className={cx("hx-topbar", className)} {...rest}>
      <div className="hx-topbar__start">{start}</div>
      <div className="hx-topbar__end">{end}</div>
    </header>
  );
}

export interface BackLinkProps extends React.AnchorHTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  /** Hide the chevron (e.g. a workspace switcher crumb). */
  noIcon?: boolean;
  trailingIcon?: React.ReactNode;
}

/** The small "‹ Goals" crumb in the top bar. */
export function BackLink({ as, href, noIcon, trailingIcon, className, children, ...rest }: BackLinkProps) {
  const Comp: React.ElementType = as ?? (href ? "a" : "button");
  return (
    <Comp href={href} type={Comp === "button" ? "button" : undefined} className={cx("hx-crumb", className)} {...rest}>
      {!noIcon && <ChevronLeft />}
      {children}
      {trailingIcon}
    </Comp>
  );
}
