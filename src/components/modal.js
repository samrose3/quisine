import React from 'react'
import noop from 'lodash/noop'
import { useTransition, animated } from 'react-spring'
import { DialogContent, DialogOverlay } from '@reach/dialog'
import VisuallyHidden from '@reach/visually-hidden'

const Modal = ({ isOpen = false, onDismiss = noop, children, ...props }) => {
  const AnimatedDialogOverlay = animated(DialogOverlay)
  const AnimatedDialogContent = animated(DialogContent)
  const transitions = useTransition(isOpen, null, {
    from: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 10 },
  })

  return (
    <>
      {transitions.map(
        ({ item, key, props: styles }) =>
          item && (
            <AnimatedDialogOverlay
              key={key}
              style={{ opacity: styles.opacity }}
              onDismiss={onDismiss}
            >
              <AnimatedDialogContent
                className="relative rounded shadow-lg sm:max-w-md"
                style={{
                  transform: styles.y.interpolate(
                    value => `translate3d(0px, ${value}px, 0px)`
                  ),
                }}
                {...props}
              >
                <button
                  className="absolute top-0 right-0 w-8 h-8 text-xl text-gray-700"
                  onClick={onDismiss}
                >
                  <VisuallyHidden>Close</VisuallyHidden>
                  <span aria-hidden>×</span>
                </button>
                {children}
              </AnimatedDialogContent>
            </AnimatedDialogOverlay>
          )
      )}
    </>
  )
}

export default Modal
