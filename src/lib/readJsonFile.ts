import fs from 'node:fs/promises'

export async function readJsonFile(jsonPath: string) {
  let contents
  try {
    contents = await fs.readFile(jsonPath, 'utf8')
  } catch (e: any) {
    throw new Error(`Failed to read package.json: ${e.message}`)
  }

  let json
  try {
    json = JSON.parse(contents)
  } catch (e: any) {
    throw new Error(`Failed to parse ${jsonPath}: ${e.message}`)
  }

  return {
    contents,
    json,
  }
}
