import { exec } from './exec'

export async function getFilesToCheck(ref: string) {
  try {
    const { stdout } = await exec(`git diff --diff-filter=d --name-only ${ref}`)

    return stdout.trim()
  } catch (e: any) {
    return '.'
  }
}
