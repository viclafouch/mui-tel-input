import React from 'react'
import { matchIsObject } from './object'

export function assocRefToPropRef(
  ref: unknown,
  propRef: React.Ref<unknown> | undefined
): void {
  if (typeof propRef === 'function') {
    propRef(ref)
  } else if (propRef && matchIsObject(propRef) && 'current' in propRef) {
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    propRef.current = ref
  }
}
