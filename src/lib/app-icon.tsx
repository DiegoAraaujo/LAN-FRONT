import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export async function createAppIcon(
  size: number,
  asset: 'home-screen-icon-source' | 'browser-favicon-source' = 'home-screen-icon-source',
) {
  const logo = await readFile(join(process.cwd(), `public/assets/${asset}.png`))

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#172c29',
      }}
    >
      {/* ImageResponse embeds the existing brand asset in a square icon. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`data:image/png;base64,${logo.toString('base64')}`}
        alt=""
        width={size}
        height={size}
      />
    </div>,
    { width: size, height: size },
  )
}
