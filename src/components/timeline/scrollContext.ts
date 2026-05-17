import { createContext } from 'react'

export const ScrollContainerContext = createContext<React.RefObject<HTMLDivElement | null>>(
  { current: null }
)
