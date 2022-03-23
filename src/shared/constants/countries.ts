import { getKeys } from '@shared/helpers/object'
import metadatas from 'libphonenumber-js/metadata.min.json'

export const COUNTRIES = metadatas.countries

export const ISO_CODES = getKeys(COUNTRIES)

export type MuiTelInputCountry = typeof ISO_CODES[number]

export const DEFAULT_ISO_CODE: MuiTelInputCountry = 'FR'
