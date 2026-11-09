import * as React from "react";
import { ArrowUp, ChevronDown, Search } from "lucide-react";
import { cx } from "../utils";
import { IconButton, Kbd } from "./primitives";

/* ------------------------------------------------------------------ Field */

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  htmlFor?: string;
}

export function Field({ label, hint, error, htmlFor, className, children, ...rest }: FieldProps) {
  return (
    <div className={cx("hx-field", className)} {...rest}>
      {label && (
        <label className="hx-field__label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {error ? <span className="hx-field__hint hx-field__hint--error">{error}</span> : hint && <span className="hx-field__hint">{hint}</span>}
    </div>
  );
}

/* ------------------------------------------------------------------ Input */

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  leftIcon?: React.ReactNode;
  rightSlot?: React.ReactNode;
  size?: "sm" | "md";
  variant?: "default" | "subtle";
  invalid?: boolean;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { leftIcon, rightSlot, size = "md", variant = "default", invalid, className, wrapperClassName, ...rest },
  ref,
) {
  return (
    <div
      className={cx(
        "hx-input",
        size === "sm" && "hx-input--sm",
        variant === "subtle" && "hx-input--subtle",
        invalid && "hx-input--invalid",
        wrapperClassName,
      )}
    >
      {leftIcon}
      <input ref={ref} aria-invalid={invalid || undefined} className={cx("hx-input__control", className)} {...rest} />
      {rightSlot}
    </div>
  );
});

export interface SearchInputProps extends InputProps {
  /** Keyboard hint shown on the right, e.g. ["⌘", "K"]. Set to null to hide. */
  shortcut?: string[] | null;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { shortcut = ["⌘", "K"], placeholder = "Search ...", ...rest },
  ref,
) {
  return (
    <Input
      ref={ref}
      type="search"
      placeholder={placeholder}
      leftIcon={<Search />}
      rightSlot={shortcut ? <Kbd keys={shortcut} /> : undefined}
      {...rest}
    />
  );
});

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...rest }, ref) {
    return <textarea ref={ref} className={cx("hx-textarea", className)} {...rest} />;
  },
);

/* ------------------------------------------------------------------ Select */

export interface SelectOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  options: SelectOption[];
  icon?: React.ReactNode;
  wrapperClassName?: string;
}

/** Native <select> styled to match — accessible and dependency-free. */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { options, icon, className, wrapperClassName, ...rest },
  ref,
) {
  return (
    <span className={cx("hx-select", icon != null && "hx-select--with-icon", wrapperClassName)}>
      {icon && <span className="hx-select__icon">{icon}</span>}
      <select ref={ref} className={cx("hx-select__control", className)} {...rest}>
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
            {typeof o.label === "string" ? o.label : o.value}
          </option>
        ))}
      </select>
      <ChevronDown className="hx-select__chevron" />
    </span>
  );
});

/* ------------------------------------------------------------------ Switch */

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  /** Color when on (any CSS color). */
  color?: string;
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, defaultChecked = false, onCheckedChange, label, color, className, style, ...rest },
  ref,
) {
  const [inner, setInner] = React.useState(defaultChecked);
  const on = checked ?? inner;
  const btn = (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={on}
      className={cx("hx-switch", className)}
      style={{ ...(color ? { ["--_on" as string]: color } : null), ...style }}
      onClick={() => {
        if (checked === undefined) setInner(!on);
        onCheckedChange?.(!on);
      }}
      {...rest}
    />
  );
  return label ? (
    <label className="hx-switch-label">
      {btn}
      {label}
    </label>
  ) : (
    btn
  );
});

/* ------------------------------------------------------------------ PromptInput */

export interface PromptInputProps extends Omit<React.HTMLAttributes<HTMLFormElement>, "onSubmit" | "onChange"> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  onSubmit?: (v: string) => void;
  placeholder?: string;
  /** Buttons on the left of the toolbar (attach, voice, …). */
  tools?: React.ReactNode;
  /** Extra content right before the send button (model picker…). */
  trailing?: React.ReactNode;
  footnote?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
}

/** The AI chat composer: auto-growing textarea, tool row and a send button. Enter sends, Shift+Enter breaks a line. */
export function PromptInput({
  value,
  defaultValue = "",
  onValueChange,
  onSubmit,
  placeholder = "Ask anything…",
  tools,
  trailing,
  footnote,
  disabled,
  loading,
  className,
  ...rest
}: PromptInputProps) {
  const [inner, setInner] = React.useState(defaultValue);
  const text = value ?? inner;
  const ref = React.useRef<HTMLTextAreaElement>(null);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [text]);

  const set = (v: string) => {
    if (value === undefined) setInner(v);
    onValueChange?.(v);
  };
  const submit = () => {
    if (!text.trim() || disabled || loading) return;
    onSubmit?.(text);
    set("");
  };

  return (
    <div>
      <form
        className={cx("hx-prompt", className)}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        {...rest}
      >
        <textarea
          ref={ref}
          className="hx-prompt__textarea"
          value={text}
          placeholder={placeholder}
          disabled={disabled}
          rows={2}
          onChange={(e) => set(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <div className="hx-prompt__bar">
          {tools}
          <span className="hx-prompt__spacer" />
          {trailing}
          <IconButton
            type="submit"
            variant="primary"
            size="md"
            label="Send"
            loading={loading}
            disabled={disabled || !text.trim()}
            icon={<ArrowUp />}
          />
        </div>
      </form>
      {footnote && <p className="hx-prompt__footnote">{footnote}</p>}
    </div>
  );
}
