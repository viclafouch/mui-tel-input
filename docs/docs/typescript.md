---
sidebar_position: 4
---

# TypeScript

This package is written in **TypeScript**. So you don't need to create your own types. Here an example if you use **TypeScript**.

**Nota bene**: Props are defined within the `MuiTelInputProps` interface.

```tsx
import React from 'react'
import {
  MuiTelInput,
  type MuiTelInputCountry,
  type MuiTelInputInfo,
  type MuiTelInputContinent,
  type MuiTelInputFlagElement
} from 'mui-tel-input'

const MyComponent = () => {
  const [value, setValue] = React.useState<string>('')

  const handleChange = (newValue: string, info: MuiTelInputInfo) => {
    setValue(newValue)
  }

  const continents: MuiTelInputContinent[] = ['EU']
  const excludedCountries: MuiTelInputCountry[] = ['FR']
  // It's also the return value for the `getFlagElement` function prop
  const unknownFlag: MuiTelInputFlagElement = <img src=".." />

  return (
    <MuiTelInput
      value={value}
      onChange={handleChange}
      continents={continents}
      unknownFlagElement={unknownFlag}
      excludedCountries={excludedCountries}
    />
  )
}
```
