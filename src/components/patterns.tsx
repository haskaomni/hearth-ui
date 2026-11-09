import * as React from "react";
import { Calendar, CircleDashed, FileText, Link2, MessageSquare, Plus } from "lucide-react";
import { cx, type Tone } from "../utils";
import { Badge, Card, Orb } from "./primitives";
import { Progress } from "./data";

/* ------------------------------------------------------------------ Illustration */

export interface LandscapeProps extends React.SVGAttributes<SVGSVGElement> {
  /** "day" (blue sky) or "dusk" (warm sky). */
  palette?: "day" | "dusk";
}

/** Original vector landscape used as the default hero artwork. Replace with your own <img> anytime. */
export function Landscape({ palette = "day", className, ...rest }: LandscapeProps) {
  const id = React.useId().replace(/:/g, "");
  const sky = palette === "day" ? ["#7fb2f0", "#cfe3f7", "#f4f1e6"] : ["#f2a37a", "#f7cfa3", "#fbeedd"];
  return (
    <svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden {...rest}>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="0.6" stopColor={sky[1]} />
          <stop offset="1" stopColor={sky[2]} />
        </linearGradient>
        <linearGradient id={`${id}m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5e7391" />
          <stop offset="1" stopColor="#8fa5bf" />
        </linearGradient>
        <linearGradient id={`${id}h`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7cbf6a" />
          <stop offset="1" stopColor="#3f8a4a" />
        </linearGradient>
      </defs>
      <rect width="600" height="300" fill={`url(#${id}s)`} />
      <g fill="#fff" opacity="0.85">
        <ellipse cx="140" cy="70" rx="60" ry="14" />
        <ellipse cx="180" cy="62" rx="40" ry="12" />
        <ellipse cx="470" cy="48" rx="50" ry="10" />
      </g>
      <path d="M150 210 L300 50 L360 110 L400 80 L560 220 Z" fill={`url(#${id}m)`} />
      <path d="M300 50 L330 82 L312 78 L298 96 L285 74 L268 86 Z" fill="#fff" opacity="0.9" />
      <path d="M400 80 L425 102 L410 100 L398 112 L388 96 Z" fill="#fff" opacity="0.85" />
      <path d="M0 220 L120 140 L210 200 L330 150 L460 210 L600 160 L600 300 L0 300 Z" fill="#8bb6a0" opacity="0.8" />
      <path d="M0 250 C120 200 220 230 320 215 C420 200 520 225 600 205 L600 300 L0 300 Z" fill={`url(#${id}h)`} />
      <g fill="#2f6b3c">
        {[40, 62, 520, 548, 575].map((x, i) => (
          <path key={x} d={`M${x} ${250 - (i % 2) * 8} l10 -34 l10 34 Z`} />
        ))}
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ HeroBanner */

export interface HeroBannerProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  /** Image URL, any node, or `null` to hide. Defaults to the built-in <Landscape/>. */
  media?: string | React.ReactNode;
}

export function HeroBanner({ eyebrow, title, description, actions, media, className, ...rest }: HeroBannerProps) {
  const art = media === undefined ? <Landscape /> : typeof media === "string" ? <img src={media} alt="" /> : media;
  return (
    <section className={cx("hx-hero", media === null && "hx-hero--plain", className)} style={media === null ? { gridTemplateColumns: "1fr" } : undefined} {...rest}>
      <div className="hx-hero__body">
        {eyebrow && <span className="hx-eyebrow">{eyebrow}</span>}
        <h2 className="hx-heading hx-heading--1">{title}</h2>
        {description && <p className="hx-hero__desc">{description}</p>}
        {actions && <div className="hx-hero__actions">{actions}</div>}
      </div>
      {media !== null && <div className="hx-hero__media">{art}</div>}
    </section>
  );
}

/* ------------------------------------------------------------------ Greeting */

export interface GreetingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  orb?: React.ReactNode | false;
}

export function Greeting({ title, orb, className, children, ...rest }: GreetingProps) {
  return (
    <div className={cx("hx-greeting", className)} {...rest}>
      {orb === false ? null : orb ?? <Orb size={34} />}
      <h1 className="hx-heading hx-heading--2">{title}</h1>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ TaskCard */

export interface TaskTag {
  label: string;
  tone?: Tone;
}

export interface TaskCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  tags?: TaskTag[];
  /** 0-100. Renders the striped progress meter. */
  progress?: number;
  progressTone?: Tone;
  due?: React.ReactNode;
  comments?: number;
  links?: number;
  statusIcon?: React.ReactNode;
  /** Usually an <AvatarGroup/> or <Switch/>. */
  footerEnd?: React.ReactNode;
}

export function TaskCard({
  title,
  description,
  tags,
  progress,
  progressTone = "blue",
  due,
  comments,
  links,
  statusIcon = <CircleDashed />,
  footerEnd,
  className,
  ...rest
}: TaskCardProps) {
  return (
    <div className={cx("hx-task", className)} {...rest}>
      <div className="hx-task__title">
        {statusIcon}
        <span>{title}</span>
      </div>
      {description && <p className="hx-task__desc">{description}</p>}
      {progress != null && <Progress value={progress} variant="ticks" tone={progressTone} />}
      {tags && tags.length > 0 && (
        <div className="hx-task__tags">
          {tags.map((t) => (
            <Badge key={t.label} tone={t.tone ?? "neutral"}>
              {t.label}
            </Badge>
          ))}
        </div>
      )}
      {(due || comments != null || links != null || footerEnd) && (
        <div className="hx-task__foot">
          {due && (
            <span className="hx-task__meta">
              <Calendar />
              {due}
            </span>
          )}
          {comments != null && (
            <span className="hx-task__meta">
              <MessageSquare />
              {comments}
            </span>
          )}
          {links != null && (
            <span className="hx-task__meta">
              <Link2 />
              {links}
            </span>
          )}
          {footerEnd && <span style={{ marginLeft: "auto" }}>{footerEnd}</span>}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Kanban */

export function KanbanBoard({ className, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cx("hx-kanban", className)} {...rest} />;
}

export interface KanbanColumnProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  icon?: React.ReactNode;
  count?: number;
  actions?: React.ReactNode;
  onAdd?: () => void;
  addLabel?: React.ReactNode;
}

export function KanbanColumn({ title, icon, count, actions, onAdd, addLabel = "Add task", className, children, ...rest }: KanbanColumnProps) {
  return (
    <section className={cx("hx-kanban__col", className)} {...rest}>
      <header className="hx-kanban__head">
        <h3 className="hx-kanban__title">
          {icon}
          {title}
          {count != null && <Badge>{count}</Badge>}
        </h3>
        {actions}
      </header>
      {children}
      {onAdd && (
        <button type="button" className="hx-kanban__add" onClick={onAdd}>
          <Plus />
          {addLabel}
        </button>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ FileCard */

export interface FileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  meta?: React.ReactNode;
  icon?: React.ReactNode;
  /** Thumbnail image URL; falls back to the file icon. */
  thumbnail?: string;
  progress?: number;
  progressTone?: Tone;
}

export function FileCard({ name, meta, icon = <FileText />, thumbnail, progress, progressTone = "blue", className, ...rest }: FileCardProps) {
  return (
    <div className={cx("hx-file", className)} {...rest}>
      <div className="hx-file__thumb">
        {thumbnail ? <img src={thumbnail} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span className="hx-file__thumb-icon">{icon}</span>}
      </div>
      <div className="hx-file__body">
        {progress != null && <Progress value={progress} variant="ticks" tone={progressTone} label="Progress" showValue="top" />}
        <div>
          <div className="hx-file__name" title={name}>
            {name}
          </div>
          {meta && <div className="hx-file__meta">{meta}</div>}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ VisionCard */

export interface VisionCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  media?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  status?: React.ReactNode;
  date?: React.ReactNode;
}

/** Image-topped card with status + date footer (Vision Board). */
export function VisionCard({ media, title, description, status, date, className, ...rest }: VisionCardProps) {
  return (
    <Card padding="none" className={cx("hx-file", className)} {...rest}>
      {media && (
        <div className="hx-file__thumb" style={{ height: 120 }}>
          {media}
        </div>
      )}
      <div className="hx-file__body" style={{ gap: 6 }}>
        <div className="hx-card__title">{title}</div>
        {description && <p className="hx-task__desc" style={{ WebkitLineClamp: 3 }}>{description}</p>}
        {(status || date) && (
          <div className="hx-task__foot" style={{ marginTop: 4 }}>
            <span className="hx-task__meta">{status}</span>
            <span style={{ marginLeft: "auto" }}>{date}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
