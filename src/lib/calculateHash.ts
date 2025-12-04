import * as crypto from 'node:crypto'

export function calculateHash(str: string) {
  const hashSum = crypto.createHash('sha256')
  hashSum.update(str)
  return hashSum.digest('hex')
}
