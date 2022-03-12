import React from 'react'
import { COUNTRIES } from '@shared/constants/countries'
import { getCountryByIsoCode } from '@shared/helpers/country'
import { render } from '@testing-library/react'

import FlagsMenu from './FlagsMenu'

import '@testing-library/jest-dom'

describe('Running Test for FlagsMenu', () => {
  test('Test FlagsMenu', () => {
    render(
      <FlagsMenu
        selectedCountry={getCountryByIsoCode('FR')}
        onSelectCountry={() => {}}
        countries={COUNTRIES}
      />
    )
  })
})
