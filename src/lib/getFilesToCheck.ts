import { exec } from './exec'

export async function getFilesToCheck(ref: string | undefined) {
  if (!ref) {
    return '.'
  }

  const { stdout } = await exec(
    `git diff --name-only ${process.env.GITHUB_BASE_REF || 'HEAD~1'}`,
  )

  return stdout.trim()
}
