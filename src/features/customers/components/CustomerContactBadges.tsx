"use client";
import { useTranslations } from "next-intl";
import { digitsOnly, formatBRPhone } from "@/lib/utils";
import { InstagramIcon, WhatsAppIcon } from "./SocialIcons";

const formatWhatsappShort = (raw: string): string => {
  return formatBRPhone(raw);
};

interface Props {
  whatsapp?: string | null;
  instagram?: string | null;
  compact?: boolean;
  iconOnly?: boolean;
}

export const CustomerContactBadges = ({
  whatsapp,
  instagram,
  compact,
  iconOnly,
}: Props) => {
  const t = useTranslations("clients");
  const instagramUsername = instagram?.replace(/^@/, "");

  if (!whatsapp && !instagram) {
    if (compact)
      return (
        <span className="text-xs text-text-light italic">
          {t("noContacts")}
        </span>
      );
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {whatsapp && (
        <a
          href={`https://wa.me/${digitsOnly(whatsapp)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir WhatsApp de ${formatWhatsappShort(whatsapp)}`}
          title={`WhatsApp: ${formatWhatsappShort(whatsapp)}`}
          className={iconOnly ? "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100" : "inline-flex items-center gap-1 text-[11px] bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium"}
        >
          <WhatsAppIcon size={iconOnly ? 19 : 12} />
          {!iconOnly && (compact
            ? formatWhatsappShort(whatsapp)
            : `WhatsApp: ${formatWhatsappShort(whatsapp)}`)}
        </a>
      )}

      {instagramUsername && (
        <a
          href={`https://instagram.com/${instagramUsername}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir Instagram de @${instagramUsername}`}
          title={`Instagram: @${instagramUsername}`}
          className={iconOnly ? "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-pink-200 bg-pink-50 text-pink-600 hover:bg-pink-100" : "inline-flex items-center gap-1 text-[11px] bg-pink-50 text-pink-600 border border-pink-200 px-2 py-0.5 rounded-full font-medium"}
        >
          <InstagramIcon size={iconOnly ? 17 : 10} />{!iconOnly && `@${instagramUsername}`}
        </a>
      )}
    </div>
  );
};
