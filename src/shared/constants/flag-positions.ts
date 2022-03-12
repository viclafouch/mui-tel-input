import { Iso3166Alpha2Code } from '@shared/constants/iso'

export type FlagPosition = {
  [key in Iso3166Alpha2Code]: `${string}%`
}

export const FLAG_POSITIONS: FlagPosition = {
  FR: '29.752066%'
}
