import { ISO_3166_ALPHA_2_MAPPINGS, Iso3166Alpha2Code } from './iso'

export type Country = {
  name: string
  isoCode: Iso3166Alpha2Code
  callingCode: number
  format?: string
  regions: string[]
}

export const COUNTRIES: readonly Country[] = [
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
