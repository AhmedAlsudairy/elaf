'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'

interface ProfileCheckProps {
  hasProfile: boolean
  children: React.ReactNode
}

export function ProfileCheck({ hasProfile, children }: ProfileCheckProps) {
  const { isLoaded, isSignedIn } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    if (!isLoaded) return

    // Get locale from pathname
    const locale = pathname.split('/')[1]
    const isValidLocale = ['en', 'ar'].includes(locale)
    const path = isValidLocale 
      ? '/' + pathname.split('/').slice(2).join('/')
      : pathname

    // If signed in but no profile, redirect to profile creation
    // (except if already on the starting profile page)
    if (isSignedIn && !hasProfile && path !== '/profile/startingprofile') {
      setShouldRedirect(true)
      const redirectUrl = isValidLocale 
        ? `/${locale}/profile/startingprofile` 
        : '/profile/startingprofile'
      router.replace(redirectUrl)
      return
    }

    // If signed in with profile and on starting profile page, redirect to home
    if (isSignedIn && hasProfile && path === '/profile/startingprofile') {
      setShouldRedirect(true)
      const redirectUrl = isValidLocale ? `/${locale}` : '/'
      router.replace(redirectUrl)
      return
    }

    setShouldRedirect(false)
  }, [isLoaded, isSignedIn, hasProfile, pathname, router])

  // If not signed in, just show content (public pages work fine)
  if (isLoaded && !isSignedIn) {
    return <>{children}</>
  }

  // If we need to redirect, show nothing to avoid flash
  if (shouldRedirect) {
    return null
  }

  // Show children for authenticated users with valid state
  return <>{children}</>
}
