import type * as SentryClient from './sentry.client'

/**
 * Cached reference to the Sentry SDK after lazy init.
 * Null until the first error occurs.
 */
let sentryClient: typeof SentryClient | null = null

/**
 * Tracks whether Sentry has been initialised to prevent double init.
 */
let sentryInitialized = false

/**
 * Lazily initialises Sentry only when the first error occurs.
 * Reduces initial bundle size by ~50 KB for users who never encounter errors.
 *
 * @description Dynamically imports `@sentry/browser` and configures minimal
 * tracing and error redaction. Skips silently in development or when DSN is
 * absent. Safe to call multiple times — init happens only once.
 * @returns {Promise<void>} Resolves when Sentry is fully initialised.
 */
async function lazyInitSentry(): Promise<void> {
  if (sentryInitialized) {
    return
  }

  const dsn = import.meta.env.PUBLIC_SENTRY_DSN as string | undefined

  // Type guard narrows `dsn` to strictly `string`, making .length and .includes safe
  const isValidDsn = typeof dsn === 'string' && dsn.length > 0 && !dsn.includes('examplePublicKey')

  if (!import.meta.env.PROD || !isValidDsn) {
    sentryInitialized = true
    return
  }

  // Dynamic import for code-splitting, but typing remains strict
  sentryClient = await import('./sentry.client')
  sentryClient.initSentry(dsn)

  sentryInitialized = true
}

/**
 * Captures an exception in Sentry, lazily initialising the SDK if needed.
 *
 * @description Initialises Sentry on first call, then forwards the error. Safe
 * to call before init — the error will be captured after the SDK loads.
 * @param error {Error} The exception to capture.
 * @param captureContext {Record<string, unknown>} Optional additional context.
 * @returns {Promise<string | null>} Sentry event ID, or null if Sentry is disabled.
 */
export async function lazyCaptureException(error: Error, captureContext?: Record<string, unknown>): Promise<string | null> {
  if (!import.meta.env.PROD) {
    return null
  }

  try {
    await lazyInitSentry()

    if (!sentryClient) {
      return null
    }

    return sentryClient.capture(error, captureContext)
  }
  catch (initError) {
    console.error('[Sentry] Failed to initialize:', initError)
    console.error('[Sentry] Original error:', error)

    return null
  }
}

/**
 * Captures an exception to Sentry with custom tags.
 *
 * @description Convenience wrapper for adding tags without importing the full
 * Sentry SDK. Automatically skips in development mode.
 * @param error {unknown} Error or exception object to send to Sentry.
 * @param tags {Record<string, string>} Metadata attached to the event.
 * @returns {Promise<string | null>} Sentry event ID, or null if disabled.
 */
export async function captureToSentry(error: unknown, tags: Record<string, string>): Promise<string | null> {
  if (!import.meta.env.PROD) {
    return null
  }

  return lazyCaptureException(error as Error, { tags })
}
