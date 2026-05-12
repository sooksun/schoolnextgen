import { describe, it, expect } from 'vitest'
import {
  formatThai,
  formatThaiShort,
  formatThaiDateTime,
  toBeYear,
  toGregorianYear,
  toIsoDate,
  fromIsoDate,
} from './thai'

describe('Thai date conversions', () => {
  it('toBeYear adds 543', () => {
    expect(toBeYear(2026)).toBe(2569)
    expect(toBeYear(1)).toBe(544)
    expect(toBeYear(-543)).toBe(0)
  })

  it('toGregorianYear subtracts 543', () => {
    expect(toGregorianYear(2569)).toBe(2026)
    expect(toGregorianYear(toBeYear(2026))).toBe(2026) // round-trip
  })

  it('toIsoDate / fromIsoDate round-trip preserves local Y-M-D', () => {
    const d = new Date(2026, 4, 11) // May 11, 2026 local
    const iso = toIsoDate(d)
    expect(iso).toBe('2026-05-11')
    const back = fromIsoDate(iso)
    expect(back?.getFullYear()).toBe(2026)
    expect(back?.getMonth()).toBe(4)
    expect(back?.getDate()).toBe(11)
  })

  it('toIsoDate handles null', () => {
    expect(toIsoDate(null)).toBeNull()
  })

  it('fromIsoDate handles null/undefined/empty', () => {
    expect(fromIsoDate(null)).toBeNull()
    expect(fromIsoDate(undefined)).toBeNull()
    expect(fromIsoDate('')).toBeNull()
  })
})

describe('Thai date formatting', () => {
  // Pin a stable date: 11 May 2026 = 11 พ.ค. พ.ศ. 2569
  const d = new Date(2026, 4, 11, 14, 30, 0)

  it('formatThai default uses full month + พ.ศ. + BE year', () => {
    const result = formatThai(d)
    expect(result).toContain('11')
    expect(result).toContain('พฤษภาคม')
    expect(result).toContain('2569')
    expect(result).toContain('พ.ศ.')
  })

  it('formatThaiShort uses abbreviated month', () => {
    const result = formatThaiShort(d)
    expect(result).toContain('11')
    expect(result).toContain('2569')
    // Should be shorter than full format
    expect(result.length).toBeLessThan(formatThai(d).length)
  })

  it('formatThaiDateTime appends time', () => {
    const result = formatThaiDateTime(d)
    expect(result).toContain('14:30')
    expect(result).toContain('2569')
  })

  it('returns empty string for nullish input', () => {
    expect(formatThai(null)).toBe('')
    expect(formatThai(undefined)).toBe('')
    expect(formatThai('')).toBe('')
  })

  it('returns empty string for invalid date', () => {
    expect(formatThai('not-a-date')).toBe('')
    expect(formatThaiShort('also-invalid')).toBe('')
  })

  it('handles edge year 1 BC (Gregorian -543)', () => {
    // Symbolic check — should not crash
    const d = new Date(2000, 0, 1)
    const result = formatThai(d)
    expect(result).toContain('2543') // BE = 2543
  })
})
