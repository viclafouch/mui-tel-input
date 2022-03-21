import { DEFAULT_LANG, DISPLAY_NAMES_OPTIONS } from '@shared/constants/lang'

import { log } from './log'

export function getDisplayNames(lang = DEFAULT_LANG): Intl.DisplayNames {
  try {
    return new Intl.DisplayNames(lang, DISPLAY_NAMES_OPTIONS)
  } catch (error) {
    log(error)
    return new Intl.DisplayNames(DEFAULT_LANG, DISPLAY_NAMES_OPTIONS)
  }
}
