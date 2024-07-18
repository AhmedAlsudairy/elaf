"use client"

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { useTransition } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function LocalSwitcher() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale()
  const t = useTranslations('LocalSwitcher')

  const isRTL = locale === 'ar'

  const onValueChange = (nextLocale: string) => {
    startTransition(() => {
      const currentPathname = pathname || '/'
      const newPathname = currentPathname.replace(`/${locale}`, `/${nextLocale}`)
      router.push(newPathname)
    })
  }

  return (
    <Select 
      defaultValue={locale} 
      onValueChange={onValueChange} 
      disabled={isPending}
    >
      <SelectTrigger 
        className={`w-full md:w-[120px] font-balooBhaijaan ${isRTL ? 'text-right' : 'text-left'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <SelectValue placeholder={t('selectLanguage')} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem 
          value="en"
          className="font-balooBhaijaan"
        >
          {t('english')}
        </SelectItem>
        <SelectItem 
          value="ar"
          className="font-balooBhaijaan"
        >
          {t('arabic')}
        </SelectItem>
      </SelectContent>
    </Select>
  )
}

