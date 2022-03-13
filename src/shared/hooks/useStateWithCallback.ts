import React from 'react'

export const useStateWithCallback = <T>(
  initialState: T | (() => T)
): [
  state: T,
  setState: (
    updatedState: React.SetStateAction<T>,
    callback?: (updatedState: T) => void
  ) => void
] => {
  const [state, setState] = React.useState<T>(initialState)
  const callbackRef = React.useRef<(updated: T) => void>()

  const handleSetState = React.useCallback(
    (
      updatedState: React.SetStateAction<T>,
      callback?: (updatedState: T) => void
    ) => {
      callbackRef.current = callback
      setState(updatedState)
    },
    []
  )

  React.useEffect(() => {
    if (typeof callbackRef.current === 'function') {
      callbackRef.current(state)
      callbackRef.current = undefined
    }
  }, [state])

  return [state, handleSetState]
}
