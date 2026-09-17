interface IconProps {
  size?: number
  className?: string
}

export const WhatsAppIcon = ({ size = 18, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className={className}>
    <path fill="currentColor" d="M12 2a9.7 9.7 0 0 0-8.4 14.55L2.3 21.7l5.28-1.25A9.7 9.7 0 1 0 12 2Zm0 17.6a7.83 7.83 0 0 1-4-1.1l-.28-.17-3.12.74.78-3.02-.18-.3A7.88 7.88 0 1 1 12 19.6Zm4.32-5.9c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1-.37-1.91-1.18a7.15 7.15 0 0 1-1.33-1.65c-.14-.24-.02-.37.1-.49.11-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.4-.58 1.6-1.13.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
  </svg>
)

export const InstagramIcon = ({ size = 18, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
    <circle cx="17.4" cy="6.7" r="1.1" fill="currentColor" />
  </svg>
)
