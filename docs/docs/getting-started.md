---
sidebar_position: 1
---

# Getting Started

## Install
```bash
npm install mui-tel-input
```

This package requires the following peer dependencies:

- `@mui/material` >= 7.0.0
- `@emotion/react` >= 11.13.0
- `@emotion/styled` >= 11.13.0
- `react` >= 18.0.0
- `react-dom` >= 18.0.0

## Simple usage

Here is a simple usage for using the component:

```jsx
import React from 'react'
import { MuiTelInput } from 'mui-tel-input'

const MyComponent = () => {
  const [phone, setPhone] = React.useState('')

  const handleChange = (newPhone) => {
    setPhone(newPhone)
  }

  return (
    <MuiTelInput value={phone} onChange={handleChange} />
  )
}
```

## Next.js integration

Learn how to use MUI Tel Input with [Next.js](https://nextjs.org/).

Once you have installed `MUI Tel Input` in your next.js project, it is important to transpile it as it is an ESM package first.

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
 transpilePackages: ['mui-tel-input'],
 // your config
}

export default nextConfig
```

## Congratulations !

That's all, now let's deep dive into the [props](/docs/api-reference).