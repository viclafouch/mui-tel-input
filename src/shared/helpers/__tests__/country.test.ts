import { Country } from '@shared/constants/countries'
import { ISO_3166_ALPHA_2_MAPPINGS } from '@shared/constants/iso'
import { expect } from 'vitest'

import {
  filterCountries,
  getCountryByCallingCode,
  getCountryByIsoCode,
  getCountryByValue,
  getFallbackCountry
} from '../country'

const COUNTRIES: readonly Country[] = [
  {
    name: ISO_3166_ALPHA_2_MAPPINGS.FR,
    isoCode: 'FR',
    callingCode: 33,
    format: '+.. ... .. .. ..',
    regions: ['europe', 'european-union']
  },
  {
    name: ISO_3166_ALPHA_2_MAPPINGS.BE,
    isoCode: 'BE',
    callingCode: 32,
    format: '+.. . .. .. .. ..',
    regions: ['europe', 'european-union']
  }
]

describe('helpers/country', () => {
  describe('getFallbackCountry', () => {
    it('should return an object', () => {
      expect(getFallbackCountry()).toBeTypeOf('object')
    })
    it('should be the France country by default', () => {
      expect(getFallbackCountry()).toEqual({
        name: 'France',
        isoCode: 'FR',
        callingCode: 33,
        format: '+.. ... .. .. ..',
        regions: ['europe', 'european-union']
      })
    })

    it('should be the correct country with an iso code', () => {
      expect(getFallbackCountry('BE')).toEqual({
        name: 'Belgium',
        isoCode: 'BE',
        callingCode: 32,
        format: '+.. . .. .. .. ..',
        regions: ['europe', 'european-union']
      })
    })
  })

  describe('getCountryByIsoCode', () => {
    it('should return an object', () => {
      expect(getCountryByIsoCode('FR', COUNTRIES)).toBeTypeOf('object')
    })

    it('should return null for a non country', () => {
      expect(getCountryByIsoCode('FR', [])).toBe(null)
    })

    it('should be the France country for iso FR', () => {
      expect(getCountryByIsoCode('FR', COUNTRIES)).toEqual({
        name: 'France',
        isoCode: 'FR',
        callingCode: 33,
        format: '+.. ... .. .. ..',
        regions: ['europe', 'european-union']
      })
    })
  })

  describe('getCountryByValue', () => {
    it('should return a country for a valid value', () => {
      expect(getCountryByValue('+33626922635', COUNTRIES)).toBeTypeOf('object')
    })

    it('should return null for an invalid value', () => {
      expect(getCountryByValue('+31626922635', COUNTRIES)).toBe(null)
    })

    it('should return a country for a value with spaces', () => {
      expect(getCountryByValue('+33 626 92 26 35', COUNTRIES)).toEqual({
        name: 'France',
        isoCode: 'FR',
        callingCode: 33,
        format: '+.. ... .. .. ..',
        regions: ['europe', 'european-union']
      })
    })

    it('should return a country for a value without +', () => {
      expect(getCountryByValue('32626922635', COUNTRIES)).toEqual({
        name: 'Belgium',
        isoCode: 'BE',
        callingCode: 32,
        format: '+.. . .. .. .. ..',
        regions: ['europe', 'european-union']
      })
    })
  })

  describe('getCountryByCallingCode', () => {
    it('should return an object for a valid calling code', () => {
      expect(getCountryByCallingCode(33, COUNTRIES)).toBeTypeOf('object')
    })

    it('should return null for a country not listed', () => {
      expect(getCountryByCallingCode(33, [])).toBeNull()
    })
    it('should return null for an invalid calling code', () => {
      expect(getCountryByCallingCode(0, COUNTRIES)).toBeNull()
    })
  })

  describe('filterCountries', () => {
    it('should return an array', () => {
      expect(filterCountries(COUNTRIES, {})).toBeInstanceOf(Array)
    })
    it('should return the exact same array when no filters options', () => {
      expect(filterCountries(COUNTRIES, {})).toBe(COUNTRIES)
    })

    it('should return the exact same array when filters options are empty', () => {
      expect(
        filterCountries(COUNTRIES, {
          onlyCountries: [],
          excludeCountries: []
        })
      ).toBe(COUNTRIES)
    })

    it('should remove FR when exclude FR', () => {
      expect(
        filterCountries(COUNTRIES, {
          excludeCountries: ['FR']
        })
      ).toEqual([
        {
          name: ISO_3166_ALPHA_2_MAPPINGS.BE,
          isoCode: 'BE',
          callingCode: 32,
          format: '+.. . .. .. .. ..',
          regions: ['europe', 'european-union']
        }
      ])
    })
    it('should only contain FR when only FR', () => {
      expect(
        filterCountries(COUNTRIES, {
          onlyCountries: ['FR']
        })
      ).toEqual([
        {
          name: ISO_3166_ALPHA_2_MAPPINGS.FR,
          isoCode: 'FR',
          callingCode: 33,
          format: '+.. ... .. .. ..',
          regions: ['europe', 'european-union']
        }
      ])
    })

    it('should only contain BE when onlyCountries is BE and even exclude BE', () => {
      expect(
        filterCountries(COUNTRIES, {
          onlyCountries: ['BE'],
          excludeCountries: ['BE']
        })
      ).toEqual([
        {
          name: ISO_3166_ALPHA_2_MAPPINGS.BE,
          isoCode: 'BE',
          callingCode: 32,
          format: '+.. . .. .. .. ..',
          regions: ['europe', 'european-union']
        }
      ])
    })
  })
})
