import type { MetadataJson } from 'libphonenumber-js'
import metadatas from 'libphonenumber-js/metadata.full.json'
import { getKeys } from '@shared/helpers/object'

export const COUNTRIES: MetadataJson['countries'] = metadatas.countries

export const ISO_CODES = getKeys(COUNTRIES)

export type MuiTelInputCountry = (typeof ISO_CODES)[number]

export const DEFAULT_ISO_CODE: MuiTelInputCountry = 'US'
