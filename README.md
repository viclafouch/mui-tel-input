<div align="center">
<h1>Mui-tel-input</h1>
  <p>A phone number input designed for the framework <a href="https://mui.com/">MUI</a> </p>
</div>

---

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Usage](#usage)
  - [Error Recovery](#error-recovery)
- [API](#api)
  - [`ErrorBoundary` props](#errorboundary-props)
  - [`useErrorHandler(error?: unknown)`](#useerrorhandlererror-unknown)
- [Issues](#issues)
  - [🐛 Bugs](#-bugs)
  - [💡 Feature Requests](#-feature-requests)
- [LICENSE](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```
npm install --save mui-tel-input
```

## Usage

```jsx
import React from 'react'
import MuiTelInput from 'mui-tel-input'

const MyComponent = () => {
  const [value, setValue] = React.useState('')

  const handleChange = (newValue) => {
    setValue(newValue)
  }

  return <MuiTelInput value={value} onChange={handleChange} />
}
```

### 🐛 Bugs

Please file an issue for bugs, missing documentation, or unexpected behavior.

### 💡 Feature Requests

Please file an issue to suggest new features. Vote on feature requests by adding
a 👍. This helps maintainers prioritize what to work on.

## LICENSE

MIT
