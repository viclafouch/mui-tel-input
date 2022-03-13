import { numericToNumber } from '@shared/helpers/string'
import { expect } from 'vitest'

import { getOnlyNumbers, matchIsNumeric } from '../string'

// adds special assertions like toHaveTextContent
import '@testing-library/jest-dom'

describe('helpers/string', () => {
  describe('getOnlyNumbers', () => {
    it('should return a string', () => {
      expect(getOnlyNumbers('')).toBeTypeOf('string')
    })
    it('should return the exact same value for numbers', () => {
      expect(getOnlyNumbers('123')).toBe('123')
    })

    it('should return numbers without other non digits', () => {
      expect(getOnlyNumbers('1a2b3/')).toBe('123')
    })
    it('should return strigified number', () => {
      expect(getOnlyNumbers(0)).toBe('0')
    })

    it('should return empty string for non numbers', () => {
      expect(getOnlyNumbers('+')).toBe('')
    })
  })

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
})
