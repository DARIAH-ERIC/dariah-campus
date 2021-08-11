import sizeOf from 'image-size'

import { copyAsset } from '@/mdx/utils/copyAsset'
// import { generateBlurDataUrl } from '@/mdx/utils/generateBlurDataUrl'

type StaticImageData = {
  src: string
  width: number
  height: number
  blurDataURL?: string
}

/**
 * Generates dimensions, blur data url, and public path for images,
 * which can be used as a `src` prop for static `next/image`s.
 */
export async function createStaticImage(
  src: string,
  basePath: string,
): Promise<string | StaticImageData> {
  const paths = await copyAsset(src, basePath)

  if (paths != null) {
    const { srcFilePath, publicPath } = paths

    const { width, height } = sizeOf(srcFilePath)

    if (width != null && height != null) {
      // const blurDataURL = await generateBlurDataUrl(srcFilePath)

      return {
        src: publicPath,
        width,
        height,
        // blurDataURL,
      }
    }
  }

  return src
}
