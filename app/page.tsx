'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const name = localStorage.getItem('23_name')
    router.replace(name ? '/today' : '/onboarding')
  }, [router])

  return null
}
