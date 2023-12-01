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
<MuiTelInput forceCallingCode />
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

## `flagSize`

- Type: `small` | `medium`
- Default: `small`

The size corresponding to the flag component.

### Example

```tsx
<MuiTelInput flagSize="medium" />
```

## `MenuProps`

- Type: [MenuProps](https://mui.com/material-ui/api/menu/)
- Default: `undefined`

Props for the MUI [Menu](https://mui.com/material-ui/api/menu/) component.

### Example

```tsx
<MuiTelInput MenuProps={{ disableAutoFocusItem: true }} />
```

## `getFlagSources`

- Type: `GetFlagSources`
- Default: `undefined`

By default the flag icons are loaded from https://flagcdn.com, if you want to override this behavior you can do this via `getFlagSources`.

You can provide the `FlagSource` object with a `srcSet` or a `src` attribute. With a `srcSet` it will be rendered as a `<source />` tag within a `<picture />`, with a `src` attribute it will be rendered as a regular image (`<img src=...`). Render a regular image could be usefull for example for a inline svg which is not allowed to be rendered in a `<picture />`.

### Example

```tsx
const getFlagSources = (isoCode, size) => {
  const isoCodeFormatted = isoCode ? isoCode.toLowerCase() : ''

  return [
    {
      type: "image/png",
      srcSet: `https://flagcdn.com/w${width}/${isoCodeFormatted}.png`,
      width: size === "small" ? 40 : 80,
    },
  ]
}

<MuiTelInput getFlagSources={getFlagSources} />
```
