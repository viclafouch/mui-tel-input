<div align="center">
<h1>MUI tel input</h1>
  <p>A phone number input designed for the React library <a href="https://mui.com/">MUI</a></p>
</div>
<div align="center">

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/viclafouch/mui-tel-input/blob/master/LICENSE)
![ts](https://badgen.net/badge/Built%20With/TypeScript/blue)
[![npm](https://img.shields.io/npm/v/mui-tel-input)](https://www.npmjs.com/package/mui-tel-input)
[![CircleCI](https://circleci.com/gh/viclafouch/mui-tel-input/tree/master.svg?style=svg)](https://circleci.com/gh/viclafouch/mui-tel-input/tree/master)
  
<div align="center">
  <img src="https://github.com/viclafouch/mui-tel-input/blob/master/mui-tel-input.gif" width="100%" />
</div>
  
## ➡️  ➡  ➡️    [DEMO](https://codesandbox.io/s/mui-tel-input-p7b2jz)    ⬅️  ⬅️  ⬅️

</div>

## Installation

```
// with npm
npm install mui-tel-input

// with yarn
yarn add mui-tel-input
```

## Usage

```jsx
import React from 'react'
import { MuiTelInput } from 'mui-tel-input'

const MyComponent = () => {
  const [value, setValue] = React.useState('')

  const handleChange = (newValue) => {
    setValue(newValue)
  }

  return <MuiTelInput value={value} onChange={handleChange} />
}
```

### Phone number validation

```jsx
import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { MuiTelInput, isValidPhoneNumber } from 'mui-tel-input'

const MyComponent = () => {
  const [value, setValue] = React.useState('')
  const [isValid, setIsValid] = React.useState(false)

  const handleChange = (newValue) => {
    setIsValid(isValidPhoneNumber(newValue))
    setValue(newValue)
  }

  return (
    <Box>
      <Typography>This is valid ? {isValid ? 'yes' : 'no'}</Typography>
      <MuiTelInput value={value} onChange={handleChange} />
    </Box>
  )
}
```

## Options

| Name            | Type                            | Description                                                                                                                   |
| --------------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `value`         | `string`                        | The phone number value (**Required**)                                                                                                                   |
| `onChange?`    | `(value, info) => void`                     | Gets called once the user updates the input or selects a new country.                      | `defaultCountry?`        | `string`                        | [Country code](#country-code) to be displayed on mount.
| `onlyCountries?`        | `array`                        | [Country codes](#country-code) to be included.
| `excludedCountries?`        | `array`                        | [Country codes](#country-code) to be excluded.  |
| `preferredCountries?`        | `array`                        | [Country codes](#country-code) to be highlighted to the top of the list of countries.
| `continents?`        | `array`                        | [Continent codes](#continent-code) to include a list of countries.
| `forceCallingCode?`        | `boolean`                        | Force the calling code (e.g: `+33`) to be displayed so the value cannot be empty. Default `false`.
| `focusOnSelectCountry?`        | `boolean`                        | Autofocus the input when the user selects a country in the list. Default `false`.
| `disableDropdown?`        | `boolean`                        | No country list / The current flag is a `span` instead of a `button`. Default `false`.
| `disableFormatting?`        | `boolean`                        | Remove format (spaces..) from the input value. Default `false`.
| `langOfCountryName?`        | `string`                        | An Intl locale to translate countries (see [Intl locales](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames/DisplayNames)). Default `en`.
| `MenuProps?`          | [Menu API](https://mui.com/api/menu)     | Props for the Menu component.
| `ref?`          | `React.Ref<HTMLDivElement>`     | A ref pointing to the [Mui TextField component](https://mui.com/components/text-fields/).
| [TextField Props](#inheritance) | |

### Inheritance

While not explicitly documented above, the props of the [TextField](https://mui.com/api/text-field) component are also available on MuiTelInput.


## Country code

A "country code" is a [two-letter ISO country code](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2) (like `US`).

This library supports all [officially assigned](https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2#Officially_assigned_code_elements) ISO alpha-2 country codes, plus a few extra ones like: `AC` ([Ascension Island](https://en.wikipedia.org/wiki/Ascension_Island)), `TA` ([Tristan da Cunha](https://en.wikipedia.org/wiki/Tristan_da_Cunha)), `XK` ([Kosovo](https://en.wikipedia.org/wiki/Kosovo)).

## Continent code

| Code            | Continent
| --------------- | -------------------------------
| AF              | Africa
| AS              | Asia
| EU              | Europe
| NA              | North America
| OC              | Oceania
| SA              | South America
| OC              | Oceania

## TypeScript

This library comes with TypeScript "typings". If you happen to find any bugs in those, create an issue.

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

## LICENSE

MIT
