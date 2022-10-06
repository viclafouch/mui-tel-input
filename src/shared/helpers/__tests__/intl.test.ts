import { getDisplayNames } from '../intl'
import '@testing-library/jest-dom'

describe('helpers/intl', () => {
  describe('getDisplayNames', () => {
    it('should return an instanceof Intl.DisplayNames', () => {
      expect(getDisplayNames()).toBeInstanceOf(Intl.DisplayNames)
    })

    it('should return an instanceof Intl.DisplayNames in fr', () => {
      expect(getDisplayNames('fr').resolvedOptions().locale).toBe('fr')
    })

    it('should return an instanceof Intl.DisplayNames in english by default', () => {
      expect(getDisplayNames().resolvedOptions().locale).toBe('en')
    })

    it('should return an instanceof Intl.DisplayNames in english in fallback', () => {
      expect(getDisplayNames('toto').resolvedOptions().locale).toBe('en')
    })
  })
})
