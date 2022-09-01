---
sidebar_position: 3
---

# API Reference

This article discusses the API and props of **MuiTelInput**. Props are defined within `MuiTelInputProps`.

## `value`

- Default: `''`
- Type: `string` | `undefined`
- Required: `false`

### Example

```tsx
<MuiTelInput />
<MuiTelInput value="+12133734253" />
```

## `onChange`

- Default: `undefined`
- Type: `(value: string, info: MuiTelInputInfo) => void`
- Required: `false`

Gets called once the user updates the tel value.

The callback gives you **2 parameters**:
  1. The new tel [value](#value) stringified
  2. An object of different useful informations about the tel (`country`, `extension`, etc..)

Example:

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

## `forceCallingCode`

- Default: `false`
- Type: `boolean`
- Required: `false`

Force the calling code (e.g: +33) to be displayed so the value cannot be empty.

```tsx
<MuiTelInput forceCallingCode />
```

## `focusOnSelectCountry`

- Default: `false`
- Type: `boolean`
- Required: `false`

Autofocus the input when the user selects a country in the list.

```tsx
<MuiTelInput focusOnSelectCountry />
```

## `onlyCountries`

- Default: `undefined`
- Type: `MuiTelInputCountry[]`
- Required: `false`

[Country codes](/docs/country-codes) to be included in the list of countries.

```tsx
<MuiTelInput onlyCountries={['FR', 'BE']} />
```

## `excludedCountries`

- Default: `undefined`
- Type: `MuiTelInputCountry[]`
- Required: `false`

[Country codes](/docs/country-codes) to be excluded of the list of countries.

```tsx
<MuiTelInput excludedCountries={['CA', 'PT']} />
```

## `preferredCountries`

- Default: `undefined`
- Type: `MuiTelInputCountry[]`
- Required: `false`

[Country codes](/docs/country-codes) to be highlighted to the top of the list of countries.

```tsx
<MuiTelInput excludedCountries={['CA', 'PT']} />
```

## `continents`

- Default: `undefined`
- Type: `MuiTelInputContinent[]`
- Required: `false`

[Continent codes](/docs/continent-codes) to include a group of countries.

```tsx
<MuiTelInput continents={['EU', 'OC']} />
```

## `disableDropdown`

- Default: `false`
- Type: `boolean`
- Required: `false`

No country list / The current flag is a `span` instead of a `button`.

```tsx
<MuiTelInput disableDropdown />
```

## `disableFormatting`

- Default: `false`
- Type: `boolean`
- Required: `false`

Remove format (spaces..) from the input value.

```tsx
<MuiTelInput disableFormatting />
```

## `langOfCountryName`

- Default: `en`
- Type: `string`
- Required: `false`

An `Intl` locale to translate country names (see [Intl locales](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DisplayNames/DisplayNames)). All countries will be translated in this language.

```tsx
<MuiTelInput langOfCountryName="fr" />
```

## `MenuProps`

- Default: `undefined`
- Type: [MenuProps](https://mui.com/material-ui/api/menu/)
- Required: `false`

Props for the MUI [Menu](https://mui.com/material-ui/api/menu/) component.

```tsx
<MuiTelInput MenuProps={{ disableAutoFocusItem: true }} />
```