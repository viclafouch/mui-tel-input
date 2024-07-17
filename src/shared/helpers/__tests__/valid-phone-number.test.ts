import { matchIsValidTel } from '../valid-phone-number'
import '@testing-library/jest-dom/vitest'

describe('helpers/valid-phone-number', () => {
  describe('matchIsValidTel', () => {
    it('should return false for an invalid value', () => {
      expect(matchIsValidTel('+33')).toBe(false)
    })

    it('should return false for a value', () => {
      expect(matchIsValidTel('+33626922635')).toBe(true)
    })

    it('should return false for an excluded country', () => {
      expect(
        matchIsValidTel('+33626922635', {
          excludedCountries: ['FR']
        })
      ).toBe(false)
    })

    it('should return false for a non only country', () => {
      expect(
        matchIsValidTel('+33626922635', {
          onlyCountries: ['BE']
        })
      ).toBe(false)
    })

    it('should return false for a non continent', () => {
      expect(
        matchIsValidTel('+33626922635', {
          continents: ['NA']
        })
      ).toBe(false)
    })

    it('should return false for a non continent', () => {
      expect(
        matchIsValidTel('1', {
          continents: ['NA']
        })
      ).toBe(false)
    })
  })
})
