---
sidebar_position: 3
---

# API Reference

This article discusses the API and props of **MuiTelInput**. Props are defined within `MuiTelInputProps`.

## `value`

- Type: `string` | `undefined`
- Default: `''`

### Example

```tsx
<MuiTelInput />
<MuiTelInput value="+12133734253" />
```

## `onChange`

- Type: `(value: string, info: MuiTelInputInfo) => void`
- Default: `undefined`

Gets called once the user updates the tel value.

The callback gives you **2 parameters**:
  1. The new tel [value](#value) stringified
  2. An object of different useful informations about the tel (`country`, `extension`, etc..)

### Example

```tsx

const handleChange = (value, info) => {
  /**
  value: "+33123456789"
  info: {
    countryCallingCode: "33",
    countryCode: "FR",
    nationalNumber: "123456789",
    numberValue: "+33123456789",
    reason: "input"
  }
  **/
}

<MuiTelInput onChange={handleChange} />
```

## `defaultCountry`

- Type: `string`
- Default: `undefined`

Sets the selected country on component mount

### Example

```tsx

<MuiTelInput defaultCountry="DE" />
```

## `forceCallingCode`

- Type: `boolean`
- Default: `false`

Displays the calling code (e.g: +33) as read-only next to the flag and with a divider instead of as part of the input field. Needs `defaultCountry` prop to be defined or will default to `US`.

### Example

```tsx
<MuiTelInput forceCallingCode defaultCountry="BE" />
```

## `focusOnSelectCountry`

- Type: `boolean`
- Default: `false`

Autofocus the input when the user selects a country in the list.

### Example

```tsx
<MuiTelInput focusOnSelectCountry />
```

## `onlyCountries`

- Type: `MuiTelInputCountry[]`
- Default: `undefined`

[Country codes](/docs/country-codes) to be included in the list of countries.

### Example

```tsx
<MuiTelInput onlyCountries={['FR', 'BE']} />
```

## `excludedCountries`

- Type: `MuiTelInputCountry[]`
- Default: `undefined`

[Country codes](/docs/country-codes) to be excluded of the list of countries.

### Example

```tsx
<MuiTelInput excludedCountries={['CA', 'PT']} />
```

## `preferredCountries`

- Type: `MuiTelInputCountry[]`
- Default: `undefined`

[Country codes](/docs/country-codes) to be highlighted to the top of the list of countries.

### Example

```tsx
<MuiTelInput preferredCountries={['BE', 'FR']} />
```

## `continents`

- Type: `MuiTelInputContinent[]`
- Default: `undefined`

[Continent codes](/docs/continent-codes) to include a group of countries.

### Example

```tsx
<MuiTelInput continents={['EU', 'OC']} />
```

## `disableDropdown`

- Type: `boolean`
- Default: `false`

No country list / The current flag is a `span` instead of a `button`.

### Example

```tsx
<MuiTelInput disableDropdown />
```

## `disableFormatting`

- Type: `boolean`
- Default: `false`

Remove format (spaces..) from the input value.

### Example

```tsx
<MuiTelInput disableFormatting />
```

## `langOfCountryName`

- Type: `string`
- Default: `en`

An `Intl` locale to translate country names (see [Intl locales](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames/DisplayNames)). All countries will be translated in this language.

### Example

```tsx
<MuiTelInput langOfCountryName="fr" />
```

## `MenuProps`

- Type: [MenuProps](https://mui.com/material-ui/api/menu/)
- Default: `undefined`

Props for the MUI [Menu](https://mui.com/material-ui/api/menu/) component.

### Example

```tsx
<MuiTelInput MenuProps={{ disableAutoFocusItem: true }} />
```

## `getFlagElement`

- Type: `GetFlagElement`
- Default: `(isoCode, { imgProps, countryName, isSelected }) => <img {...imgProps} />`

By default, the flag icons are loaded from https://flagcdn.com.
But, with this prop, you can customize the `img` element, or use another CDN, or use SVG, etc..

`getFlagElement` empower you to use your own flag library, CDN, SVGs, etc. For those who desire offline functionality, it's possible as you can pass your own SVG components (no internet connection required).

You could also customize the CSS of the `img` element.

### Example

```tsx
import React from 'react'
import FlagFR from 'my-svg/fr/flag'
import FlagBE from 'my-svg/be/flag'
import { MuiTelInput, MuiTelInputCountry } from 'mui-tel-input'

const flags: Partial<Record<MuiTelInputCountry, React.ElementType>> = {
  FR: FlagFR,
  BE: FlagBE
}

export const MyComponent = () => {
  const [phone, setPhone] = React.useState('')

  const handleChange = (newPhone: string) => {
    setPhone(newPhone)
  }

  return (
    <MuiTelInput
      onlyCountries={['FR', 'BE']}
      value={phone}
      {/* You could also use another CDN, use 'styled-component', or whatever you want...
      isSelected is for the `button` that contains the selected country flag, maybe you want to add border for example... */}
      getFlagElement={(isoCode, { imgProps, countryName, isSelected }) => {
        const Component = flags[isoCode]
        return <Component aria-label={countryName} />
      }}
      onChange={handleChange}
    />
  )
}
```

## `FlagIconButtonProps`

- Type: `Partial<IconButtonProps>`
- Default: `undefined`

This prop let you to customize the `IconButton` component of the flag.

### Example

```tsx
<MuiTelInput FlagIconButtonProps={{ 'aria-label': 'Ouvrir la liste des pays' }} />
```

## `unknownFlagElement`

- Type: `React.ReactNode`
- Default: `<img src="base64.." loading="lazy" width={26} alt="unknown" />`

This prop let you to customize the `unknown flag`, changed the `width` or `height`, use CDN or SVG component, etc..

### Example

```tsx
import React from 'react'
import { MuiTelInput } from 'mui-tel-input'
import unknownFlag from 'path/to/what/u/want'

const MyComponent = () => {
  const [phone, setPhone] = React.useState('')

  const handleChange = (newPhone: string) => {
    setPhone(newPhone)
  }

  return (
    <MuiTelInput
       value={phone}
       onChange={handleChange}
       {/* Could be SVG, another CDN, etc... */}
       unknownFlagElement={<img src={unknownFlag} width={26} alt="unknown" />}
    />
  )
}
```
