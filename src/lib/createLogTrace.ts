export function createLogTrace(logger: { debug: (msg: string) => void }) {
  let last = Date.now()

  return function logTrace(message: string) {
    const elapsed = ((Date.now() - last) / 1000).toFixed(2)
    logger.debug(`[trace] ${elapsed}: ${message}`)
    last = Date.now()
  }
}
