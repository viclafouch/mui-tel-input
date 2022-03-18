import React from 'react'
import { ISO_3166_ALPHA_2_MAPPINGS } from '@shared/constants/iso'
import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { MuiPhoneNumberReason, MuiPhoneNumberValues } from 'index.types'

import MuiPhoneNumber from './index'

export default {
  title: 'MuiPhoneNumber',
  component: MuiPhoneNumber,
  argTypes: {
    defaultCountry: {
      options: Object.keys(ISO_3166_ALPHA_2_MAPPINGS),
      control: { type: 'select' }
    },
    langOfCountryName: {
      options: Object.keys(ISO_3166_ALPHA_2_MAPPINGS),
      control: { type: 'select' }
    },
    isIsoCodeEditable: {
      options: [true, false],
      control: { type: 'boolean' }
    },
    disableDropdown: {
      options: [true, false],
      control: { type: 'boolean' }
    },
    disableFormatting: {
      options: [true, false],
      control: { type: 'boolean' }
    },
    focusOnSelectCountry: {
      options: [true, false],
      control: { type: 'boolean' }
    },
    excludeCountries: {
      options: Object.keys(ISO_3166_ALPHA_2_MAPPINGS),
      control: { type: 'object' }
    },
    onlyCountries: {
      options: Object.keys(ISO_3166_ALPHA_2_MAPPINGS),
      control: { type: 'object' }
    }
  }
} as ComponentMeta<typeof MuiPhoneNumber>

export const Primary: ComponentStory<typeof MuiPhoneNumber> = (args) => {
  const [state, setState] = React.useState<string>('')

  const handleChange = (
    ...changedArgs: [MuiPhoneNumberValues, MuiPhoneNumberReason]
  ) => {
    action('onChange')(...changedArgs)
    setState(changedArgs[0].value)
  }

  return <MuiPhoneNumber {...args} value={state} onChange={handleChange} />
}
