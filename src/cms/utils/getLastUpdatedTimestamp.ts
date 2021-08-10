import { spawnSync } from 'child_process'
import { relative } from 'path'

import { log } from '@/utils/log'
import type { FilePath, IsoDateString } from '@/utils/ts/aliases'

/**
 * Returns last updated git commit date for specified file path.
 */
export async function getLastUpdatedTimestamp(
  absoluteFilePath: FilePath,
): Promise<IsoDateString | null> {
  try {
    const timestamp = spawnSync('git', [
      'log',
      '-1',
      '--format=%at',
      absoluteFilePath,
    ]).stdout.toString()

    return String(new Date(Number(timestamp) * 1000))
  } catch {
    log.warn(
      `Failed to fetch last updated timestamp for ${relative(
        process.cwd(),
        absoluteFilePath,
      )}.`,
    )

    return null
  }
}
