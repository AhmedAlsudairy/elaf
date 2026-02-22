import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <SignIn 
        appearance={{
          elements: {
            // Main Card
            card: 'bg-white shadow-2xl shadow-gray-200/50 ring-1 ring-gray-100 rounded-3xl',
            
            // Header Typography
            headerTitle: 'text-3xl font-extrabold text-gray-900 tracking-tight',
            headerSubtitle: 'text-sm text-gray-500 font-medium',
            
            // Social Buttons (Google, GitHub, etc.)
            socialButtonsBlockButton: 'bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 ease-in-out text-gray-700 font-medium text-sm rounded-xl py-2.5',
            
            // Dividers ("or")
            dividerLine: 'bg-gray-200',
            dividerText: 'text-gray-500 font-medium',
            
            // Form Inputs & Labels
            formFieldLabel: 'text-sm font-semibold text-gray-800',
            formFieldInput: 'w-full rounded-xl border-gray-200 bg-gray-50/50 py-2.5 px-4 text-sm text-gray-900 transition-all focus:border-black focus:bg-white focus:ring-1 focus:ring-black focus:outline-none',
            
            // Primary Button ("Continue")
            formButtonPrimary: 'bg-black text-white hover:bg-gray-800 transition-all duration-200 ease-in-out text-sm font-semibold rounded-xl py-3 shadow-md hover:shadow-lg',
            
            // Footer Links ("Don't have an account? Sign Up")
            footerActionText: 'text-gray-500 text-sm font-medium',
            footerActionLink: 'text-black font-semibold hover:text-gray-700 hover:underline transition-colors',
            
            // Identity Preview (When user is editing email)
            identityPreviewText: 'text-gray-900 font-medium',
            identityPreviewEditButton: 'text-black hover:text-gray-700 hover:underline transition-colors'
          }
        }}
      />
    </div>
  )
}