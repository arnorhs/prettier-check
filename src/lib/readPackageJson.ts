import fs from 'node:fs/promises'

export async function readPackageJson(pkgJsonPath: string) {
  let pkgJsonContents
  try {
    pkgJsonContents = await fs.readFile(pkgJsonPath, 'utf8')
  } catch (e: any) {
    throw new Error(`Failed to read package.json: ${e.message}`)
  }

  let pkgJson
  try {
    pkgJson = JSON.parse(pkgJsonContents)
  } catch (e: any) {
    throw new Error(`Failed to parse package.json: ${e.message}`)
  }

  return {
    contents: pkgJsonContents,
    json: pkgJson,
  }
}
