import React from 'react'

export function usePrevious<T>(value: T): T {
  const currentValueRef = React.useRef<T>(value)

  React.useEffect(() => {
    currentValueRef.current = value
  }, [value])

  return currentValueRef.current
}
