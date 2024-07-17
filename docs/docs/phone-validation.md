---
sidebar_position: 2
---

# Phone validation

Maybe you need to validate the phone number value and check that it's correct. To do that, just import `matchIsValidTel` from the package and use this function, it will return a `boolean`.

```jsx
import React from 'react'
import { MuiTelInput, matchIsValidTel } from 'mui-tel-input'

const MyComponent = () => {
  const [value, setValue] = React.useState('+33123456789')

  const handleChange = (newValue) => {
    matchIsValidTel(newValue, {
      onlyCountryies: [], // optional,
      excludedCountryies: [], // optional
      continents: [] // optional
    }) // true | false
  }

  return <MuiTelInput value={value} onChange={handleChange} />
}
```



