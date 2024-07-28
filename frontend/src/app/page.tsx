'use client'
import React, { useEffect } from 'react'
import { getItemLocalStorage } from '../../lib/utils/base'
import { useRouter } from 'next/navigation'

const Page = () => {

  const router = useRouter()

  useEffect(() => {
    const now = new Date()
    const tokenDetail = getItemLocalStorage('token-details')

    if (tokenDetail) {
      try {
        const parsedToken = JSON.parse(tokenDetail)
        if (parsedToken && typeof parsedToken === 'object' && 'expiry' in parsedToken) {
          const { expiry } = parsedToken
          if (expiry > now.getTime()) {
            router.push('/home')
          } else {
            router.push('/login')
          }
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Error parsing token details:', error)
        router.push('/login')
      }
    } else {
      router.push('/login')
    }
  }, [router])

  return null
}

export default Page
