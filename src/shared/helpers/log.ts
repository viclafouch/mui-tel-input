export function log(...args: Parameters<Console['error']>) {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console -- dev-only logging for mismatch prop warnings
    console.error(...args)
  }
}
