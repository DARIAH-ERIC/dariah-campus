import { promises as fs } from 'fs'

import sharp from 'sharp'

/**
 * Generates a base64 encoded string to be used as data url for an image `src` attribute.
 */
export async function generateBlurDataUrl(filePath: string): Promise<string> {
  const BLUR_SIZE = 8

  const buffer = await fs.readFile(filePath)

  return sharp(buffer)
    .resize(BLUR_SIZE)
    .toBuffer({ resolveWithObject: true })
    .then(
      ({ data, info }) =>
        `data:image/${info.format};base64,` + data.toString('base64'),
    )
}
