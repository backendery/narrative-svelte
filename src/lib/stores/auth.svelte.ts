/**
 * In-memory bearer token used by the API client.
 *
 * @description Reserved for authenticated requests. When populated, the token
 * is attached to outgoing `Authorization` headers. Rune-based store — import
 * and mutate `authToken.value` directly.
 */
export const authToken = $state<{ value: string | null }>({ value: null })
