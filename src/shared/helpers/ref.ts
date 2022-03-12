import React from 'react'

export function assocRefToPropRef(
  ref: unknown,
  propRef: React.Ref<unknown> | undefined
): void {
  if (typeof propRef === 'function') {
    propRef(ref)
  } else if (propRef?.current) {
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    propRef.current = ref
  }
}
