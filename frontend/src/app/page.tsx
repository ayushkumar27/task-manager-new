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
      const { expiry } = JSON.parse(tokenDetail)
      if (expiry > now.getTime()) {
        router.push('/home')
      } else {
        router.push('/login')
      }
    } else {
      router.push('/login')
    }
  }, [router])

  return null
}

export default Page
