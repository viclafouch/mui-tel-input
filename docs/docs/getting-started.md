---
sidebar_position: 1
---

# Getting Started

## Install
```bash
npm install mui-tel-input --save
```
or you can use **yarn**
```bash
yarn add mui-tel-input
```

We have completed installing the package.

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

## Congratulations !

That's all, now let's deep dive into the [props](/docs/api-reference).