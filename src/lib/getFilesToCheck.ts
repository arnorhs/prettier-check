import { exec } from './exec'

export async function getFilesToCheck(ref: string | undefined) {
  if (!ref) {
    return '.'
  }

  const { stdout } = await exec(`git diff --name-only ${ref}`)

  return stdout.trim()
}
