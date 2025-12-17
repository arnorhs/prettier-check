import { exec } from './exec'

/**
 * returns files to check as an array of file paths - if none are found or an error occurs it return
 * '.' as the only element
 */
export async function getFilesToCheck(ref: string) {
  try {
    const { stdout } = await exec(`git diff --diff-filter=d --name-only ${ref}`)

    const files = stdout
      .split('\n')
      .map((x) => x.trim())
      .filter(Boolean)

    if (files.length === 0) {
      return ['.']
    }

    return files
  } catch (e: any) {
    return ['.']
  }
}
