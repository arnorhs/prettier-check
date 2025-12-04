import * as cache from '@actions/cache'
import * as core from '@actions/core'
import fs from 'node:fs/promises'
import { calculateHash } from './lib/calculateHash'
import { exec } from './lib/exec'
import { npmInstallWithTmpJson } from './lib/npmInstallWithTmpJson'
import { readPackageJson } from './lib/readPackageJson'

const CACHE_KEY = 'prettier-action-cache-v1'

let pkgJson
try {
  pkgJson = await readPackageJson('./package.json')
} catch (e: any) {
  core.setFailed(e.message)
  process.exit(1)
}

const deps = Object.fromEntries(
  Object.entries({
    prettier: 'latest',
    ...pkgJson.json.devDependencies,
    ...pkgJson.json.dependencies,
  }).filter(([name]) => /^@?prettier(\/|$|\-)/.test(name)),
)

const depsHash = calculateHash(JSON.stringify(deps))
const hashKey = `${CACHE_KEY}-${depsHash}`

const usedKey = await cache.restoreCache(['./node_modules'], hashKey, [
  `${CACHE_KEY}-`,
])

if (usedKey === hashKey) {
  core.info('Cache hit! Using cached node_modules.')
} else {
  const temporaryPackageJson = {
    name: 'temp-prettier-action-package',
    dependencies: deps,
  }

  core.debug(
    'Generating package json:\n' +
      JSON.stringify(temporaryPackageJson, null, 2),
  )

  try {
    await npmInstallWithTmpJson(temporaryPackageJson)
  } catch (e: any) {
    core.setFailed(e.message)
    process.exit(1)
  }

  await cache.saveCache(['./node_modules'], hashKey)
  core.info('Cache miss. Installed dependencies and saved to cache.')
}

try {
  const { stdout, stderr } = await exec(
    './node_modules/.bin/prettier --check .',
  )
  core.debug(`${stdout}\n${stderr}`)
} catch (e) {
  core.setFailed('Prettier check failed. See output for details.')
  process.exit(1)
}

try {
  await fs.rmdir('./node_modules', { recursive: true })
} catch (e: any) {
  core.warning(`Failed to clean up node_modules: ${e.message}`)
}

core.info('Prettier check completed successfully.')
