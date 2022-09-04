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
  MuiTelInputCountry,
  MuiTelInputInfo,
  MuiTelInputContinent
} from 'mui-tel-input'

const MyComponent = () => {
  const [value, setValue] = React.useState<string>('')

  const handleChange = (newValue: string, info: MuiTelInputInfo) => {
    setValue(newValue)
  }

  const continents: MuiTelInputContinent[] = ['EU']
  const excludedCountries: MuiTelInputCountry[] = ['FR']

  return (
    <MuiTelInput
      value={value}
      onChange={handleChange}
      continents={continents}
      excludedCountries={excludedCountries}
    />
  )
}
```
