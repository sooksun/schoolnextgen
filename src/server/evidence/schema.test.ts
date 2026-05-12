import { describe, it, expect } from 'vitest'
import { ALLOWED_MIMES, MAX_SIZE, mimeToType } from './schema'

describe('mimeToType', () => {
  it.each([
    ['image/jpeg', 'image'],
    ['image/png', 'image'],
    ['image/webp', 'image'],
    ['video/mp4', 'video'],
    ['video/quicktime', 'video'],
    ['application/pdf', 'pdf'],
    ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'document'],
    ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'document'],
    ['application/octet-stream', 'other'],
    ['text/plain', 'other'],
  ] as const)('classifies %s as %s', (mime, expected) => {
    expect(mimeToType(mime)).toBe(expected)
  })
})

describe('ALLOWED_MIMES', () => {
  it('contains all 4 categories', () => {
    expect(ALLOWED_MIMES.length).toBeGreaterThan(0)
    expect(ALLOWED_MIMES).toContain('image/jpeg')
    expect(ALLOWED_MIMES).toContain('video/mp4')
    expect(ALLOWED_MIMES).toContain('application/pdf')
    expect(ALLOWED_MIMES).toContain(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    )
  })

  it('does NOT contain dangerous types', () => {
    // Sanity: no executables/SVG (which can host XSS)
    expect(ALLOWED_MIMES).not.toContain('image/svg+xml')
    expect(ALLOWED_MIMES).not.toContain('text/html')
    expect(ALLOWED_MIMES).not.toContain('application/javascript')
  })
})

describe('MAX_SIZE', () => {
  it('image cap is 10MB', () => {
    expect(MAX_SIZE.image).toBe(10 * 1024 * 1024)
  })

  it('video cap is 100MB', () => {
    expect(MAX_SIZE.video).toBe(100 * 1024 * 1024)
  })

  it('pdf cap is 25MB', () => {
    expect(MAX_SIZE.pdf).toBe(25 * 1024 * 1024)
  })

  it('all caps are sane (1KB < cap < 500MB)', () => {
    for (const cap of Object.values(MAX_SIZE)) {
      expect(cap).toBeGreaterThan(1024)
      expect(cap).toBeLessThan(500 * 1024 * 1024)
    }
  })
})
