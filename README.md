<div align="center">
<h1>Mui-tel-input</h1>
  <p>A phone number input designed for the framework <a href="https://mui.com/">MUI</a> </p>
</div>

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save mui-tel-input
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

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

## LICENSE

MIT
