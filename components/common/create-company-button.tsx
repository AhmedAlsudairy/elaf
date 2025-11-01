'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function CreateCompanyProfilePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-4">Create Company Profile</h1>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        This is a test page for your company profile form.
      </p>
      <Button variant="outline" onClick={() => router.push('/')}>
        Back Home
      </Button>
    </div>
  )
}
