export const ISO_3166_ALPHA_2_MAPPINGS = {
  BE: 'Belgium',
  FR: 'France'
} as const

export type Iso3166Alpha2Code = keyof typeof ISO_3166_ALPHA_2_MAPPINGS

export const DEFAULT_ISO_CODE: Iso3166Alpha2Code = 'FR'
