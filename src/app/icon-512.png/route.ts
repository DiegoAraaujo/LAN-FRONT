import { createAppIcon } from '@/lib/app-icon'

export const dynamic = 'force-static'

export function GET() {
  return createAppIcon(512)
}
