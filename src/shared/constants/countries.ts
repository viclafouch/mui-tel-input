import metadatas from 'libphonenumber-js/metadata.min.json'
import { getKeys } from '@shared/helpers/object'

export const COUNTRIES = metadatas.countries

export const ISO_CODES = getKeys(COUNTRIES)

export type MuiTelInputCountry = typeof ISO_CODES[number]

export const DEFAULT_ISO_CODE: MuiTelInputCountry = 'FR'
