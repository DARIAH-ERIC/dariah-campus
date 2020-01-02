const { spawnSync } = require('child_process')

const getLastUpdatedTimestamp = filepath => {
  const timestamp = spawnSync('git', [
    'log',
    '-1',
    '--format=%ct',
    filepath,
  ]).stdout.toString('utf-8')

  return parseInt(timestamp, 10) * 1000
}

module.exports = getLastUpdatedTimestamp
