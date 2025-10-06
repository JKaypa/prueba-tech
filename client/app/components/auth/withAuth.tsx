'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from '../../store/user.store'

export function Protect(
  ProtectedComponent: React.ComponentType,
  role?: string
) {
  const AuthComponent: React.FC = () => {
    const router = useRouter()
    const { loadUser } = useUserStore()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
      const verify = async () => {
        await loadUser()

        const { authUser, isAuth } = useUserStore.getState()

        if (isAuth === false) {
          router.replace('/login')
          return
        }

        if (role && authUser?.role !== role) {
          router.replace('/')
          return
        }

        setChecking(false)
      }

      void verify()
    }, [loadUser, router])

    if (checking) {
      return <p className="text-center mt-8">Loading...</p>
    }

    return <ProtectedComponent />
  }

  return AuthComponent
}
