import { DEFAULT_LANG, DISPLAY_NAMES_OPTIONS } from '@shared/constants/lang'

export function getDisplayNames(lang = DEFAULT_LANG): Intl.DisplayNames {
  try {
    return new Intl.DisplayNames(lang, DISPLAY_NAMES_OPTIONS)
  } catch (error) {
    if (
      process.env.NODE_ENV !== 'test' &&
      process.env.NODE_ENV !== 'production'
    ) {
      // eslint-disable-next-line no-console
      console.error(error, process.env.NODE_ENV)
    }
    return new Intl.DisplayNames(DEFAULT_LANG, DISPLAY_NAMES_OPTIONS)
  }
}
