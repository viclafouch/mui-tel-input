import { expect } from 'vitest'

import { matchIsNumeric, numericToNumber, stringToNumber } from '../string'

// adds special assertions like toHaveTextContent
import '@testing-library/jest-dom'

describe('helpers/string', () => {
  describe('matchIsNumeric', () => {
    it('should return true for a valid numeric string', () => {
      expect(matchIsNumeric('12345')).toBe(true)
    })

    it('should return true for a valid number', () => {
      expect(matchIsNumeric(12345)).toBe(true)
    })

    it('should return false for an empty string', () => {
      expect(matchIsNumeric('')).toBe(false)
    })

    it('should return false for a string including letters', () => {
      expect(matchIsNumeric('1r2z&e3')).toBe(false)
    })

    it('should return false with null as arg', () => {
      expect(matchIsNumeric(null)).toBe(false)
    })

    it('should return false with empty object as arg', () => {
      expect(matchIsNumeric({})).toBe(false)
    })

    it('should return false with a NaN arg', () => {
      expect(matchIsNumeric(Number.NaN)).toBe(false)
    })
  })

  describe('numericToNumber', () => {
    it('should return number for a numeric value', () => {
      expect(numericToNumber('123')).toBe(123)
    })

    it('should return null for a non numeric value', () => {
      expect(numericToNumber('Hello world')).toBe(null)
    })
  })

  describe('stringToNumber', () => {
    it('should return number for a valid numeric', () => {
      expect(stringToNumber('123')).toBe(123)
    })
    it('should return null for an invalid numeric', () => {
      expect(stringToNumber('hello world')).toBe(null)
    })

    it('should return number without invalid numeric', () => {
      expect(stringToNumber('12 hello 3')).toBe(123)
    })
  })
})
