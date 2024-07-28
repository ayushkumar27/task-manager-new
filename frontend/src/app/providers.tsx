'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { useEffect } from 'react'
import { getItemLocalStorage } from '../../lib/utils/base'

export function Providers({ children }: { children: React.ReactNode }) {

  return <ChakraProvider>{children}</ChakraProvider>
}