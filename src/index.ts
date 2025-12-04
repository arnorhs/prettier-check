import * as core from '@actions/core'
import * as github from '@actions/github'
import fs from 'node:fs/promises'

const PACKAGE_JSON_PATH = './package.json'
const NODE_MODULES_CACHE_PATH = './node_modules/.cache'
const PACKAGE_JSON_COPY_PATH = `${NODE_MODULES_CACHE_PATH}/_prettier_action_copy_packagejson`

const plugins = core.getInput('plugins')
core.info(`Using prettier plugins: ${plugins}`)

let pkgJsonContents
try {
  pkgJsonContents = await fs.readFile(PACKAGE_JSON_PATH, 'utf8')
} catch (e: any) {
  core.setFailed(e.message)
  process.exit(1)
}

try {
  await fs.mkdir(NODE_MODULES_CACHE_PATH, { recursive: true })
  await fs.writeFile(PACKAGE_JSON_COPY_PATH, pkgJsonContents, 'utf8')
} catch (e: any) {
  core.setFailed(e.message)
  process.exit(1)
}

try {
  const pkgJson = JSON.parse(pkgJsonContents)

  const deps = Object.fromEntries(
    Object.entries({
      ...pkgJson.devDependencies,
      ...pkgJson.dependencies,
    }).filter(([name]) => /^@?prettier(\/|$|\-)/.test(name)),
  )

  const temporaryPackageJson = {
    name: 'temp-prettier-action-package',
    dependencies: deps,
  }

  core.info(
    'Generating package json:\n' +
      JSON.stringify(temporaryPackageJson, null, 2),
  )

  await fs.writeFile(
    PACKAGE_JSON_PATH,
    JSON.stringify(temporaryPackageJson, null, 2),
    'utf8',
  )
} finally {
  await fs.writeFile(PACKAGE_JSON_PATH, pkgJsonContents, 'utf8')
  await fs.unlink(PACKAGE_JSON_COPY_PATH)
}
