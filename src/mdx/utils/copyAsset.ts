import { createHash } from 'crypto'
import * as fs from 'fs'
import * as path from 'path'

export function copyAsset(
  href: unknown,
  vfilePath: string | undefined,
  /**
   * Next.js image optimizer only treats images in `_next/static/image` as static.
   * @see https://github.com/vercel/next.js/blob/222830ad479e70009286f101f25d8322b811b17f/packages/next/server/image-optimizer.ts#L116
   */
  folderName = 'image',
):
  | {
      srcFilePath: string
      destinationFilePath: string
      publicPath: string
    }
  | undefined {
  if (typeof href !== 'string' || href.length === 0) return

  if (href.startsWith('http://')) return
  if (href.startsWith('https://')) return
  if (href.startsWith('/')) return
  if (href.startsWith('#')) return
  if (href.startsWith('data:')) return
  if (href.startsWith('blob:')) return
  if (href.startsWith('mailto:')) return
  if (vfilePath == null) return

  const srcFilePath = path.join(path.dirname(vfilePath), href)

  const buffer = fs.readFileSync(srcFilePath, { encoding: 'binary' })
  const hash = createHash('md4')
  hash.update(buffer)

  const newFileName = path.join(
    path.dirname(srcFilePath),
    hash.digest('hex').substr(0, 9999) + path.extname(srcFilePath),
  )
  const newPath = path.join(
    'static',
    folderName,
    path.relative(process.cwd(), newFileName),
  )

  const publicPath = path.join('/_next', newPath)
  const destinationFilePath = path.join(process.cwd(), '.next', newPath)

  // TODO: make async
  if (!fs.existsSync(destinationFilePath)) {
    fs.mkdirSync(path.dirname(destinationFilePath), { recursive: true })
    fs.copyFileSync(srcFilePath, destinationFilePath)
  }

  return {
    srcFilePath,
    destinationFilePath,
    publicPath,
  }
}
