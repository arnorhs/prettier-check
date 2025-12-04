import fs from 'node:fs/promises'
import { exec } from './exec'

export async function npmInstallWithTmpJson(temporaryPackageJson: any) {
  try {
    await fs.mkdir('./node_modules/.cache', { recursive: true })
    await fs.cp(
      './package.json',
      './node_modules/.cache/_prettier_action_copy_packagejson',
      { force: true },
    )
  } catch (e: any) {
    throw new Error(`Failed to back up package.json: ${e.message}`)
  }

  try {
    await fs.writeFile(
      './package.json',
      JSON.stringify(temporaryPackageJson, null, 2),
      'utf8',
    )

    await exec(
      'npm install --prefer-offline --no-audit --progress=false --loglevel=error',
    )
  } catch (e: any) {
    throw new Error(`Failed to install dependencies: ${e.message}`)
  } finally {
    await restorePackageJson()
  }
}

function restorePackageJson() {
  return fs.cp(
    './node_modules/.cache/_prettier_action_copy_packagejson',
    './package.json',
    { force: true },
  )
}
