import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import type { ClassValue } from 'clsx'

/**
 * Combines Tailwind class values and resolves conflicts with `tailwind-merge`.
 *
 * @description Wraps `clsx` and `tailwind-merge` so Tailwind conflict resolution happens in one helper.
 * @param inputs {ClassValue[]} Class values, booleans, arrays, or objects accepted by `clsx`.
 * @returns {string} A single merged class name string.
 * @example
 * ```tsx
 * <div className={twcn('text-sm', condition && 'text-lg')} /> // => "text-lg"
 * ```
 */
export function twcn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs))
}
