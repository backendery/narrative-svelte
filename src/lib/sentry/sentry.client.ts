import { captureException, init } from '@sentry/browser'

import type { BrowserOptions, ErrorEvent } from '@sentry/browser'

/**
 * Resolves the current Sentry environment from Vite's build mode.
 * Vercel sets `PUBLIC_VERCEL_ENV` to `production` | `preview` | `development`.
 * Falls back to Vite's own `MODE` if the variable is absent.
 *
 * @returns {string} The environment name reported to Sentry.
 */
function resolveEnvironment(): string {
  const vercelEnv = import.meta.env.PUBLIC_VERCEL_ENV as string | undefined
  const mode = import.meta.env.MODE as string | undefined
  return vercelEnv ?? mode ?? 'development'
}

/**
 * Strips email addresses from exception messages before they reach Sentry.
 *
 * @param event {ErrorEvent} Error event being prepared for upload.
 * @returns {ErrorEvent} The redacted event.
 */
export function redactPii(event: ErrorEvent): ErrorEvent {
  if (event.exception?.values) {
    event.exception.values = event.exception.values.map(exc => ({
      ...exc,
      value: exc.value?.replace(/\b[\w.%+-]+@[\w.-]+\.[A-Z]{2,}\b/gi, '[EMAIL]'),
    }))
  }

  return event
}

/**
 * Initialises the Sentry SDK with project DSN and environment config.
 *
 * @param dsn {string} Sentry project DSN.
 * @param options {Partial<BrowserOptions>} Additional Sentry `init` options.
 */
export function initSentry(dsn: string, options?: Partial<BrowserOptions>): void {
  init({
    dsn,
    environment: resolveEnvironment(),
    attachStacktrace: true,
    maxBreadcrumbs: 50,
    normalizeDepth: 5,
    beforeSend(event) {
      return redactPii(event)
    },
    ignoreErrors: ['chrome-extension://', 'moz-extension://', 'top.GLOBALS', 'NetworkError'],
    ...options,
  })
}
/**
 * Captures an exception to Sentry with optional context.
 *
 * @param error {Error} The exception to capture.
 * @param context {Record<string, unknown>} Optional additional context.
 * @returns {string} Sentry event ID.
 */
export function capture(error: Error, context?: Record<string, unknown>) {
  return captureException(error, context)
}
