"use client";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export const CustomerSearchBar = ({
  value,
  onChange,
  className = "",
}: Props) => {
  const t = useTranslations("clients");
  return (
    <div className={`relative ${className}`}>
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light"
      />
      <input
        type="text"
        placeholder={t("searchPlaceholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-48 border border-border rounded-lg pl-8 pr-3 py-2.5 text-sm bg-surface"
      />
    </div>
  );
};
