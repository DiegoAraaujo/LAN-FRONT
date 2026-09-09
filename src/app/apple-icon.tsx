import { createAppIcon } from '@/lib/app-icon'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'
export const dynamic = 'force-static'

export default function AppleIcon() {
  return createAppIcon(size.width)
}
