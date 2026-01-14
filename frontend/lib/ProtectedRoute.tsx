'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authUtils } from './auth'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  useEffect(() => {
    if (!authUtils.isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  if (!authUtils.isAuthenticated()) {
    return null
  }

  return <>{children}</>
}
