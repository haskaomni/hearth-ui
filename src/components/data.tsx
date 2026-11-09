import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cx, toneColor, type Tone } from "../utils";
import { Card } from "./primitives";

/* ------------------------------------------------------------------ Progress */

export interface ProgressProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  value: number;
  max?: number;
  tone?: Tone;
  /** "bar" = rounded bar, "ticks" = striped meter from the design. */
  variant?: "bar" | "ticks";
  label?: React.ReactNode;
  /** Show the % value. "top" puts it above with the label, "inline" to the right. */
  showValue?: "top" | "inline" | false;
}

export function Progress({ value, max = 100, tone = "blue", variant = "bar", label, showValue = "inline", className, style, ...rest }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const pctText = `${Math.round(pct)}%`;
  const track = (
    <div className="hx-progress__track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={typeof label === "string" ? label : undefined}>
      <div className="hx-progress__fill" style={{ width: `${pct}%` }} />
    </div>
  );
  return (
    <div
      className={cx("hx-progress", variant === "ticks" && "hx-progress--ticks", className)}
      style={{ ["--_c" as string]: toneColor(tone), ...style }}
      {...rest}
    >
      {(label || showValue === "top") && (
        <div className="hx-progress__head">
          <span>{label}</span>
          {showValue === "top" && <span className="hx-progress__value">{pctText}</span>}
        </div>
      )}
      {showValue === "inline" ? (
        <div className="hx-progress__row">
          {track}
          <span className="hx-progress__value">{pctText}</span>
        </div>
      ) : (
        track
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Meter (multi-segment) */

export interface MeterSegment {
  label: string;
  value: number;
  /** Any CSS color or a tone name. */
  color?: string;
  tone?: Tone;
}

export interface MeterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode;
  caption?: React.ReactNode;
  segments: MeterSegment[];
  max: number;
  legend?: boolean;
}

/** Stacked usage bar — e.g. "Storage 130 GB of 200 GB". */
export function Meter({ title, caption, segments, max, legend = true, className, ...rest }: MeterProps) {
  const colorOf = (s: MeterSegment) => s.color ?? toneColor(s.tone ?? "neutral");
  return (
    <div className={cx("hx-meter", className)} {...rest}>
      {(title || caption) && (
        <div className="hx-meter__head">
          <span className="hx-meter__title">{title}</span>
          <span className="hx-meter__caption">{caption}</span>
        </div>
      )}
      <div className="hx-meter__bar" role="img" aria-label={segments.map((s) => `${s.label}: ${s.value}`).join(", ")}>
        {segments.map((s) => (
          <div key={s.label} className="hx-meter__seg" style={{ width: `${(s.value / max) * 100}%`, background: colorOf(s) }} />
        ))}
      </div>
      {legend && (
        <div className="hx-meter__legend">
          {segments.map((s) => (
            <span key={s.label}>
              <i style={{ background: colorOf(s) }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Sparkline */

export interface SparklineProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[];
  height?: number;
  tone?: Tone;
  /** Index of a point to mark with a dot + guide line. */
  highlight?: number;
  /** Fill the area under the line. */
  area?: boolean;
}

export function Sparkline({ data, height = 48, tone = "neutral", highlight, area, className, ...rest }: SparklineProps) {
  const w = 200;
  const pad = 4;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pts = data.map((v, i) => [(i / Math.max(1, data.length - 1)) * w, pad + (1 - (v - min) / span) * (height - pad * 2)] as const);
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const color = tone === "neutral" ? "var(--hx-fg-subtle)" : toneColor(tone);
  const hp = highlight != null ? pts[highlight] : undefined;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" height={height} className={cx("hx-spark", className)} aria-hidden {...rest}>
      {area && <path d={`${d} L${w},${height} L0,${height} Z`} fill={color} opacity={0.12} />}
      <path d={d} fill="none" stroke={color} strokeWidth={1.4} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      {hp && (
        <>
          <line x1={hp[0]} x2={hp[0]} y1={0} y2={height} stroke="var(--hx-fg)" strokeDasharray="2 3" strokeWidth={1} vectorEffect="non-scaling-stroke" opacity={0.4} />
          <circle cx={hp[0]} cy={hp[1]} r={3} fill="var(--hx-fg)" vectorEffect="non-scaling-stroke" />
        </>
      )}
    </svg>
  );
}

export interface BarSparkProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[];
  height?: number;
  tone?: Tone;
  /** [start, end] index range drawn in the strong color; the rest is muted. */
  highlightRange?: [number, number];
}

/** Dense thin-bar chart (the "Portfolio growth" visual). */
export function BarSpark({ data, height = 48, tone = "inverse", highlightRange, className, ...rest }: BarSparkProps) {
  const max = Math.max(...data) || 1;
  const n = data.length;
  const w = n * 4;
  return (
    <svg viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" height={height} className={cx("hx-spark", className)} aria-hidden {...rest}>
      {data.map((v, i) => {
        const h = Math.max(2, (v / max) * height);
        const strong = highlightRange ? i >= highlightRange[0] && i <= highlightRange[1] : true;
        return <rect key={i} x={i * 4} y={height - h} width={2} height={h} rx={0.5} fill={strong ? toneColor(tone) : "var(--hx-border-strong)"} />;
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ MetricCard */

export interface MetricCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  value: React.ReactNode;
  caption?: React.ReactNode;
  /** A chart (Sparkline / BarSpark) or any content pinned to the bottom. */
  chart?: React.ReactNode;
  /** Small control in the value row, e.g. <Tabs size="sm" …/> */
  aside?: React.ReactNode;
}

/** "Health & Longevity · 78% · VO2 Max Target" goal card. */
export function MetricCard({ title, subtitle, icon, value, caption, chart, aside, className, ...rest }: MetricCardProps) {
  return (
    <Card className={cx("hx-metric", className)} {...rest}>
      <div className="hx-card__header">
        <div>
          <div className="hx-card__title">{title}</div>
          {subtitle && <div className="hx-card__subtitle">{subtitle}</div>}
        </div>
        {icon && <span className="hx-metric__icon">{icon}</span>}
      </div>
      <div className="hx-card__header" style={{ alignItems: "flex-end" }}>
        <div>
          <div className="hx-metric__value">{value}</div>
          {caption && <div className="hx-metric__caption">{caption}</div>}
        </div>
        {aside}
      </div>
      {chart && <div className="hx-metric__chart">{chart}</div>}
    </Card>
  );
}

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  value: React.ReactNode;
  label: React.ReactNode;
}

export function StatCard({ icon, value, label, className, ...rest }: StatCardProps) {
  return (
    <div className={cx("hx-stat", className)} {...rest}>
      {icon && <span className="hx-stat__icon">{icon}</span>}
      <div>
        <div className="hx-stat__value">{value}</div>
        <div className="hx-stat__label">{label}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ List */

export interface ListProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
}

export function List({ bordered, className, ...rest }: ListProps) {
  return <div className={cx("hx-list", bordered && "hx-list--bordered", className)} {...rest} />;
}

export interface ListItemProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  icon?: React.ReactNode;
  iconTone?: Tone;
  title: React.ReactNode;
  description?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Shows a chevron and renders as a button. */
  onClick?: React.MouseEventHandler<HTMLElement>;
  href?: string;
  chevron?: boolean;
}

export function ListItem({ icon, iconTone = "neutral", title, description, trailing, onClick, href, chevron, className, ...rest }: ListItemProps) {
  const Comp: React.ElementType = href ? "a" : onClick ? "button" : "div";
  return (
    <Comp href={href} onClick={onClick} type={Comp === "button" ? "button" : undefined} className={cx("hx-list-item", className)} {...rest}>
      {icon && <span className={cx("hx-list-item__icon", `hx-tone-${iconTone}`)}>{icon}</span>}
      <span className="hx-list-item__text">
        <div className="hx-list-item__title">{title}</div>
        {description && <div className="hx-list-item__desc">{description}</div>}
      </span>
      {(trailing || chevron) && (
        <span className="hx-list-item__trailing">
          {trailing}
          {chevron && <ChevronRight />}
        </span>
      )}
    </Comp>
  );
}

/* ------------------------------------------------------------------ SuggestionList */

export interface Suggestion {
  label: string;
  icon?: React.ReactNode;
  tone?: Tone;
}

export interface SuggestionListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  items: Suggestion[];
  onSelect?: (item: Suggestion) => void;
  moreLabel?: React.ReactNode;
  onMore?: () => void;
}

/** Prompt starters under the chat composer ("Stay on Track", "Plan My Week", …). */
export function SuggestionList({ items, onSelect, moreLabel, onMore, className, ...rest }: SuggestionListProps) {
  return (
    <div className={cx("hx-suggestions", className)} {...rest}>
      {items.map((s) => (
        <button
          key={s.label}
          type="button"
          className="hx-suggestion"
          style={s.tone ? ({ ["--_c"]: toneColor(s.tone) } as React.CSSProperties) : undefined}
          onClick={() => onSelect?.(s)}
        >
          {s.icon}
          {s.label}
        </button>
      ))}
      {moreLabel && (
        <button type="button" className="hx-suggestions__more" onClick={onMore}>
          {moreLabel}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Table */

export interface TableColumn<T> {
  key: string;
  header: React.ReactNode;
  /** Defaults to row[key]. */
  render?: (row: T, index: number) => React.ReactNode;
  width?: number | string;
  align?: "left" | "center" | "right";
}

export interface TableProps<T> extends React.TableHTMLAttributes<HTMLTableElement> {
  columns: TableColumn<T>[];
  data: T[];
  rowKey?: (row: T, index: number) => React.Key;
  compact?: boolean;
  onRowClick?: (row: T) => void;
  empty?: React.ReactNode;
}

export function Table<T extends Record<string, unknown>>({ columns, data, rowKey, compact, onRowClick, empty = "No data", className, ...rest }: TableProps<T>) {
  return (
    <div className="hx-table-wrap">
      <table className={cx("hx-table", compact && "hx-table--compact", className)} {...rest}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} style={{ width: c.width, textAlign: c.align }}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center", color: "var(--hx-fg-muted)" }}>
                {empty}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={rowKey ? rowKey(row, i) : i} onClick={onRowClick ? () => onRowClick(row) : undefined} style={onRowClick ? { cursor: "pointer" } : undefined}>
                {columns.map((c) => (
                  <td key={c.key} style={{ textAlign: c.align }}>
                    {c.render ? c.render(row, i) : (row[c.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
