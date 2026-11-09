import * as React from "react";
import { cx, type Tone } from "../utils";

/* ------------------------------------------------------------------ Button */

export type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";
export type ControlSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ControlSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  loading?: boolean;
  block?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", leftIcon, rightIcon, loading, block, className, children, disabled, type = "button", ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx("hx-btn", `hx-btn--${variant}`, size !== "md" && `hx-btn--${size}`, block && "hx-btn--block", className)}
      {...rest}
    >
      {loading ? <span className="hx-spinner" aria-hidden /> : leftIcon}
      {children}
      {rightIcon}
    </button>
  );
});

export interface IconButtonProps extends Omit<ButtonProps, "leftIcon" | "rightIcon" | "children"> {
  icon: React.ReactNode;
  /** Required for accessibility — used as aria-label. */
  label: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, variant = "ghost", className, ...rest },
  ref,
) {
  return (
    <Button ref={ref} variant={variant} aria-label={label} title={label} className={cx("hx-btn--icon", className)} {...rest}>
      {icon}
    </Button>
  );
});

/* ------------------------------------------------------------------ Kbd */

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** Render several keys, e.g. keys={["⌘", "K"]} */
  keys?: string[];
}

export function Kbd({ keys, className, children, ...rest }: KbdProps) {
  if (keys) {
    return (
      <span className={cx("hx-kbd-group", className)}>
        {keys.map((k) => (
          <kbd key={k} className="hx-kbd" {...rest}>
            {k}
          </kbd>
        ))}
      </span>
    );
  }
  return (
    <kbd className={cx("hx-kbd", className)} {...rest}>
      {children}
    </kbd>
  );
}

/* ------------------------------------------------------------------ Badge */

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  variant?: "soft" | "outline";
  size?: "sm" | "md";
  pill?: boolean;
  dot?: boolean;
  icon?: React.ReactNode;
}

export function Badge({ tone = "neutral", variant = "soft", size = "sm", pill, dot, icon, className, children, ...rest }: BadgeProps) {
  return (
    <span
      className={cx(
        "hx-badge",
        `hx-tone-${tone}`,
        variant === "outline" && "hx-badge--outline",
        size === "md" && "hx-badge--md",
        pill && "hx-badge--pill",
        className,
      )}
      {...rest}
    >
      {dot && <span className="hx-badge__dot" aria-hidden />}
      {icon}
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ Avatar */

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string;
  name?: string;
  size?: number;
  round?: boolean;
  /** Background color when showing initials. */
  color?: string;
}

const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]!.toUpperCase())
    .join("");

export function Avatar({ src, name, size = 28, round, color, className, style, children, ...rest }: AvatarProps) {
  return (
    <span
      className={cx("hx-avatar", round && "hx-avatar--round", className)}
      style={{ ["--_s" as string]: `${size}px`, ...(color ? { background: color, color: "#fff" } : null), ...style }}
      title={name}
      {...rest}
    >
      {src ? <img src={src} alt={name ?? ""} /> : children ?? initials(name)}
    </span>
  );
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: number;
}

export function AvatarGroup({ max = 4, size = 22, className, children, ...rest }: AvatarGroupProps) {
  const arr = React.Children.toArray(children);
  const extra = arr.length - max;
  return (
    <div className={cx("hx-avatar-group", className)} {...rest}>
      {arr.slice(0, max).map((c) =>
        React.isValidElement<AvatarProps>(c) ? React.cloneElement(c, { size: c.props.size ?? size, round: true }) : c,
      )}
      {extra > 0 && <Avatar size={size} round name={`+${extra}`} aria-label={`${extra} more`}>{`+${extra}`}</Avatar>}
    </div>
  );
}

/* ------------------------------------------------------------------ Card */

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  variant?: "default" | "muted" | "elevated";
  interactive?: boolean;
  as?: React.ElementType;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { padding = "md", variant = "default", interactive, as: As = "div", className, ...rest },
  ref,
) {
  return (
    <As
      ref={ref}
      className={cx(
        "hx-card",
        padding !== "none" && `hx-card--pad-${padding}`,
        variant !== "default" && `hx-card--${variant}`,
        interactive && "hx-card--interactive",
        className,
      )}
      {...rest}
    />
  );
});

export interface CardHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action, className, ...rest }: CardHeaderProps) {
  return (
    <div className={cx("hx-card__header", className)} {...rest}>
      <div>
        <div className="hx-card__title">{title}</div>
        {subtitle && <div className="hx-card__subtitle">{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

export interface SectionTitleProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  action?: React.ReactNode;
}

/** "◎ Active Targets" style section heading with an optional right-side action. */
export function SectionTitle({ icon, title, action, className, ...rest }: SectionTitleProps) {
  return (
    <div className={cx("hx-section-title", className)} {...rest}>
      <h3 className="hx-section-title__label">
        {icon}
        {title}
      </h3>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ Typography */

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4;
  as?: "h1" | "h2" | "h3" | "h4" | "div";
}

export function Heading({ level = 2, as, className, ...rest }: HeadingProps) {
  const Tag = (as ?? `h${level}`) as React.ElementType;
  return <Tag className={cx("hx-heading", `hx-heading--${level}`, className)} {...rest} />;
}

export function Eyebrow({ className, ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx("hx-eyebrow", className)} {...rest} />;
}

export function Divider({ className, ...rest }: React.HTMLAttributes<HTMLHRElement>) {
  return <hr className={cx("hx-divider", className)} {...rest} />;
}

export interface IconTileProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function IconTile({ tone = "neutral", className, ...rest }: IconTileProps) {
  return <span className={cx("hx-icon-tile", `hx-tone-${tone}`, className)} {...rest} />;
}

/* ------------------------------------------------------------------ Orb */

export interface OrbProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number;
  animated?: boolean;
}

/** The glossy gradient sphere used as the assistant's avatar. */
export function Orb({ size = 32, animated = true, className, style, ...rest }: OrbProps) {
  return (
    <div
      aria-hidden
      className={cx("hx-orb", animated && "hx-orb--animated", className)}
      style={{ ["--_s" as string]: `${size}px`, ...style }}
      {...rest}
    />
  );
}
