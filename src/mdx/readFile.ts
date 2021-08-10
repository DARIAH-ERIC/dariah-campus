import { promises as fs } from 'fs'

import type { VFile } from 'vfile'
import vfile from 'vfile'

import type { FilePath } from '@/utils/ts/aliases'

/**
 * Read file into `VFile`.
 */
export async function readFile(filePath: FilePath): Promise<VFile> {
  const file = vfile({
    contents: await fs.readFile(filePath, { encoding: 'utf-8' }),
    path: filePath,
  })

  return file
}
