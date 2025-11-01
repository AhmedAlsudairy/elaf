'use client'

import React, { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { getLangDir } from 'rtl-detect'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { ELAF_LOGO_URL, MenuIcon, XIcon } from '@/constant/svg'
import { useUser, UserButton } from '@clerk/nextjs'
import { CreateOrViewCompanyButton } from '@/components/common/create-company-button'

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isSignedIn, isLoaded } = useUser()
  const t = useTranslations('Navbar')
  const locale = useLocale()
  const direction = useMemo(() => getLangDir(locale), [locale])
  const pathName = usePathname()
  const isRTL = direction === 'rtl'

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const publicNavItems = useMemo(
    () => ['tenders', 'profile/companyprofiles', 'contact'],
    []
  )
  const privateNavItems = useMemo(() => ['chats'], [])

  const renderNavItems = useCallback(
    (isMobile = false) => {
      const items = [...publicNavItems]
      if (isSignedIn) items.push(...privateNavItems)

      return items.map(item => (
        <Link
          key={item}
          href={`/${locale}/${item}`}
          className={`${isMobile ? 'block' : ''} text-lg md:text-base lg:text-lg font-medium px-4 py-2 ${
            pathName?.includes(item) ? 'bg-primary text-white rounded-md' : ''
          }`}
          prefetch={false}
          onClick={isMobile ? () => setIsMenuOpen(false) : undefined}
        >
          {t(item)}
        </Link>
      ))
    },
    [publicNavItems, privateNavItems, locale, pathName, t, isSignedIn]
  )

  return (
    <header
      className={`px-4 lg:px-6 h-14 flex items-center justify-between font-balooBhaijaan`}
      dir={direction}
    >
      {/* Logo */}
      <Link href={`/${locale}`} className="flex items-center justify-center" prefetch={false}>
        <img src={ELAF_LOGO_URL} alt="Elaf Logo" className="h-20 w-20" />
        <span className="sr-only">Elaf</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-row items-center font-balooBhaijaan">
        {renderNavItems()}
      </nav>

      {/* Right side: Company button + Auth */}
      <div className={`hidden md:flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
        <CreateOrViewCompanyButton variant="outline" size="sm" />
        {!isLoaded ? (
          <p className="text-sm opacity-70">{t('loading')}</p>
        ) : isSignedIn ? (
          <UserButton afterSignOutUrl={`/${locale}`} />
        ) : (
          <Link href={`/${locale}/sign-in`}>
            <Button variant="outline">{t('signin')}</Button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center">
        <Button variant="ghost" size="icon" aria-label="Toggle Menu" onClick={toggleMenu}>
          {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-white py-4 shadow-md md:hidden font-balooBhaijaan z-50">
          {renderNavItems(true)}
          <div className="px-4 py-2 space-y-2">
            <CreateOrViewCompanyButton variant="outline" size="sm" className="w-full" />
            {!isLoaded ? (
              <p className="text-sm opacity-70">{t('loading')}</p>
            ) : isSignedIn ? (
              <UserButton afterSignOutUrl={`/${locale}`} />
            ) : (
              <Link href={`/${locale}/sign-in`}>
                <Button variant="outline" className="w-full">
                  {t('signin')}
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
