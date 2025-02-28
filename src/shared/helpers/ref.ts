import React from 'react'
import { matchIsObject } from './object'

export function refToRefs(refs: (React.Ref<unknown> | undefined)[]) {
  return (refInstance: unknown) => {
    refs.forEach((toRef) => {
      if (typeof toRef === 'function') {
        toRef(refInstance)
      } else if (toRef && matchIsObject(toRef) && 'current' in toRef) {
        toRef.current = refInstance
      }
    })
  }
}
