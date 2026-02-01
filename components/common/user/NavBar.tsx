'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { getLangDir } from 'rtl-detect'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import { ELAF_LOGO_URL, MenuIcon, XIcon } from '@/constant/svg'
import { Bell } from 'lucide-react'
import { useUser, UserButton } from '@clerk/nextjs'
import { CreateOrViewCompanyButton } from '@/components/common/create-company-button'
import Pusher from 'pusher-js' // Direct import from library

interface Notification {
  id: string
  type: string
  content: string
  read: boolean
  createdAt: string
}

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const { isSignedIn, isLoaded, user } = useUser()
  const t = useTranslations('Navbar')
  const locale = useLocale()
  const direction = useMemo(() => getLangDir(locale), [locale])
  const pathName = usePathname()
  const isRTL = direction === 'rtl'

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev)
  }, [])

  const toggleDropdown = useCallback(() => {
    setIsDropdownOpen(prev => !prev)
  }, [])

  const fetchNotifications = async () => {
    if (!user) return
    try {
      const res = await fetch(`/api/socialMedia/notifications`)
      if (!res.ok) throw new Error('Failed to fetch notifications')
      const data = await res.json()
      setNotifications(data.notifications)
    } catch (err) {
      console.error('Error fetching notifications', err)
    }
  }

  // Pusher subscription
  useEffect(() => {
    if (!user) return

    // Ensure these match your .env keys exactly (case-sensitive)
    const pusher = new Pusher(process.env.NEXT_PUBLIC_pusher_key!, {
      cluster: process.env.NEXT_PUBLIC_pusher_cluster!,
      authEndpoint: '/api/pusher/auth', 
    })

    const channel = pusher.subscribe(`private-user-${user.id}`)
    channel.bind('new-notification', (notification: Notification) => {
      setNotifications(prev => [notification, ...prev])
    })

    fetchNotifications()

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
      pusher.disconnect()
    }
  }, [user])

  const unreadCount = notifications.filter(n => !n.read).length

  const publicNavItems = useMemo(
    () => ['tenders', 'profile/companyprofiles', 'contact'],
    []
  )
  const privateNavItems = useMemo(() => ['chats', 'socialMedia'], [])

  const renderNavItems = useCallback(
    (isMobile = false) => {
      const items = [...publicNavItems]
      if (isSignedIn) items.push(...privateNavItems)

      return items.map(item => (
        <Link
          key={item}
          href={`/${locale}/${item}`}
          className={`${isMobile ? 'block' : ''} text-lg md:text-base lg:text-lg font-medium px-4 py-2 transition-colors hover:text-primary ${
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
      className="px-4 lg:px-6 h-16 flex items-center justify-between font-balooBhaijaan border-b bg-white sticky top-0 z-40"
      dir={direction}
    >
      {/* Logo */}
      <Link href={`/${locale}`} className="flex items-center justify-center" prefetch={false}>
        <img src={ELAF_LOGO_URL} alt="Elaf Logo" className="h-12 w-auto" />
        <span className="sr-only">Elaf</span>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex flex-row items-center gap-2">
        {renderNavItems()}
      </nav>

      {/* Right side Actions */}
      <div className={`hidden md:flex items-center space-x-4 ${isRTL ? 'space-x-reverse' : ''}`}>
        
        {/* Notification Bell with Chic Badge */}
        {isSignedIn && (
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDropdown} 
              className="relative rounded-full hover:bg-gray-100 transition-all"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
                </span>
              )}
            </Button>

            {/* Notification Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl border border-gray-100 rounded-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="text-sm font-bold text-gray-900">{t('notifications') || 'Notifications'}</h3>
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">All caught up!</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="p-4 border-b last:border-0 hover:bg-gray-50 transition-colors flex gap-3">
                        <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-gray-200' : 'bg-primary'}`} />
                        <div>
                          <p className="text-sm text-gray-800 line-clamp-2">{n.content}</p>
                          <p className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <CreateOrViewCompanyButton variant="outline" size="sm" />

        {!isLoaded ? (
          <div className="h-8 w-8 rounded-full bg-gray-100 animate-pulse" />
        ) : isSignedIn ? (
          <UserButton afterSignOutUrl={`/${locale}`} />
        ) : (
          <Link href={`/${locale}/sign-in`}>
            <Button variant="default" size="sm" className="rounded-full px-6">
              {t('signin')}
            </Button>
          </Link>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center gap-3">
         {isSignedIn && (
           <Button variant="ghost" size="icon" onClick={toggleDropdown} className="relative">
             <Bell className="h-5 w-5" />
             {unreadCount > 0 && <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white" />}
           </Button>
         )}
        <Button variant="ghost" size="icon" onClick={toggleMenu}>
          {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b py-6 shadow-xl md:hidden z-50 flex flex-col items-center gap-4">
          {renderNavItems(true)}
          <hr className="w-4/5 border-gray-100" />
          <CreateOrViewCompanyButton variant="outline" className="w-[80%]" />
          {!isSignedIn && (
             <Link href={`/${locale}/sign-in`} className="w-[80%]">
               <Button className="w-full">{t('signin')}</Button>
             </Link>
          )}
        </div>
      )}
    </header>
  )
}