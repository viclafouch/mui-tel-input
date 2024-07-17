<div align="center">
  <img src="https://viclafouch.github.io/mui-tel-input/img/logo.svg" width="80" />
</div>
<div align="center">
<h1>Material UI tel input</h1>
  <p>A phone number input designed for the React library <a href="https://material-ui.com/">Material UI</a></p>
</div>
<div align="center">

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/viclafouch/mui-tel-input/blob/master/LICENSE)
![ts](https://badgen.net/badge/Built%20With/TypeScript/blue)
[![npm](https://img.shields.io/npm/v/mui-tel-input)](https://www.npmjs.com/package/mui-tel-input)

<div align="center">
  <img src="https://github.com/viclafouch/mui-tel-input/blob/master/mui-tel-input.gif" width="100%" />
</div>

</div>

## Installation

```
// with npm
npm install mui-tel-input

// with yarn
yarn add mui-tel-input
```

The component uses [libphonenumber-js](https://www.npmjs.com/package/libphonenumber-js) for phone number parsing and formatting.

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

## Next.js integration

Learn how to use MUI Tel Input with [Next.js](https://nextjs.org/).

Once you have installed `MUI Tel Input` in your next.js project, it is important to transpile it as it is an ESM package first.

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
 transpilePackages: ['mui-tel-input'],
 // your config
}

module.exports = nextConfig
```

## [Documentation](https://viclafouch.github.io/mui-tel-input/)

## Changelog

Go to [GitHub Releases](https://github.com/viclafouch/mui-tel-input/releases)

## TypeScript

This library comes with TypeScript "typings". If you happen to find any bugs in those, create an issue.

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

## LICENSE

MIT
