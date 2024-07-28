'use client'
import React, { useEffect } from 'react'
import { getItemLocalStorage } from '../../lib/utils/base'
import { useRouter } from 'next/navigation'

const page = () => {

  const router = useRouter()
  useEffect(() => {
    const now = new Date()
    const tokenDetail = getItemLocalStorage('token-details')
    console.log(now.getTime(), JSON.parse(tokenDetail).expiry)
    if (tokenDetail && JSON.parse(tokenDetail).expiry > now.getTime()) {
      router.push('/home')
    }
    else {
      router.push('/login')
    }
    if (!tokenDetail) {

    }
  }, [])

  return (
    <></>
  )
}

export default page