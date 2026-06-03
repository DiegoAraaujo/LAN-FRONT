"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange?: (val: boolean) => void;
}

export const Toggle = ({ checked, onChange }: ToggleProps) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onChange?.(!checked)}
    className={cn(
      "relative w-9 h-5 rounded-full transition-colors duration-200",
      checked ? "bg-gold-btn" : "bg-border",
    )}
  >
    <span
      className={cn(
        "absolute top-0.5 w-4 h-4 bg-surface rounded-full shadow transition-transform duration-200",
        checked ? "translate-x-0" : "-translate-x-4",
      )}
    />
  </button>
);

interface AvatarProps {
  initials: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export const Avatar = ({
  initials,
  color = "bg-amber-500",
  size = "sm",
}: AvatarProps) => (
  <div
    className={cn(
      "rounded-full flex items-center justify-center text-white font-bold shrink-0",
      color,
      size === "sm"
        ? "w-8 h-8 text-xs"
        : size === "md"
          ? "w-10 h-10 text-sm"
          : "w-12 h-12 text-base",
    )}
  >
    {initials}
  </div>
);

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  valueClassName?: string;
}

export const StatCard = ({
  label,
  value,
  icon,
  valueClassName,
}: StatCardProps) => (
  <div className="bg-surface border border-border rounded-xl p-5">
    <div className="mb-3">{icon}</div>
    <div className="text-xs text-text-light mb-1.5">{label}</div>
    <div className={cn("text-2xl font-bold", valueClassName ?? "text-text")}>
      {value}
    </div>
  </div>
);

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-6">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-text">{title}</h1>
      {subtitle && <p className="text-sm text-text-muted mt-1">{subtitle}</p>}
    </div>
    {actions && (
      <div className="flex items-center gap-2 shrink-0">{actions}</div>
    )}
  </div>
);

interface PaginationProps {
  current: number;
  total: number;
  onPageChange: (p: number) => void;
}

export const Pagination = ({
  current,
  total,
  onPageChange,
}: PaginationProps) => {
  const getPages = (): (number | "...")[] => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3)
      return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
  };

  const pages = getPages();

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="w-7 h-7 flex items-center justify-center rounded-md border border-border text-text-muted text-sm hover:border-gold-btn transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ‹
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span
            key={`dots-${i}`}
            className="w-7 h-7 flex items-center justify-center text-sm text-text-light"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={cn(
              "w-7 h-7 flex items-center justify-center rounded-md text-sm font-medium transition-colors",
              p === current
                ? "bg-gold-btn text-text font-bold"
                : "border border-border text-text-muted hover:border-gold-btn",
            )}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onPageChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="w-7 h-7 flex items-center justify-center rounded-md border border-border text-text-muted text-sm hover:border-gold-btn transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ›
      </button>
    </div>
  );
};
