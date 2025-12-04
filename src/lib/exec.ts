import cp from 'node:child_process'

export function exec(cmd: string) {
  return new Promise<{ stdout: string; stderr: string }>((res, rej) => {
    cp.exec(cmd, (error, stdout, stderr) => {
      if (error) {
        rej(
          new Error(`\
Command execution failed for: ${cmd}
error: ${error.message}
stdout:
${stdout}
stderr:
${stderr}
`),
        )
      } else {
        res({ stdout, stderr })
      }
    })
  })
}
