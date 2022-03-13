import React from 'react'
import * as R from 'ramda'

export function assocRefToPropRef(
  ref: unknown,
  propRef: React.Ref<unknown> | undefined
): void {
  if (typeof propRef === 'function') {
    propRef(ref)
  } else if (propRef && R.is(Object, propRef) && 'current' in propRef) {
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    propRef.current = ref
  }
}
