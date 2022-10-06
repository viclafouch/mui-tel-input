import { DEFAULT_LANG } from '@shared/constants/lang'
import { log } from './log'

export function getDisplayNames(lang = DEFAULT_LANG): Intl.DisplayNames {
  try {
    return new Intl.DisplayNames(lang, {
      type: 'region'
    })
  } catch (error) {
    log(error)
    return new Intl.DisplayNames(DEFAULT_LANG, {
      type: 'region'
    })
  }
}
