const MAX_SOURCE_BYTES = 5 * 1024 * 1024
const MAX_DATA_URL_LENGTH = 700_000

export async function prepareProfileImage(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) throw new Error('Escolha uma imagem JPG, PNG ou WebP.')
  if (file.size > MAX_SOURCE_BYTES) throw new Error('A imagem original deve ter no máximo 5 MB.')

  const source = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error('Não foi possível carregar a imagem.'))
      element.src = source
    })
    const size = Math.min(512, image.naturalWidth, image.naturalHeight)
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Não foi possível preparar a imagem.')
    const crop = Math.min(image.naturalWidth, image.naturalHeight)
    const x = (image.naturalWidth - crop) / 2
    const y = (image.naturalHeight - crop) / 2
    context.drawImage(image, x, y, crop, crop, 0, 0, size, size)
    for (const quality of [0.85, 0.7, 0.55, 0.4]) {
      const result = canvas.toDataURL('image/jpeg', quality)
      if (result.length <= MAX_DATA_URL_LENGTH) return result
    }
    throw new Error('Não foi possível reduzir a imagem ao tamanho permitido.')
  } finally {
    URL.revokeObjectURL(source)
  }
}
