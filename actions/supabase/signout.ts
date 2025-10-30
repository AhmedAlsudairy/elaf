'use server'

export const SignOut = async () => {
  try {
    // Here you can later clear cookies, JWT, or session storage
    console.log("✅ User signed out successfully (placeholder)")

    // return a response or status if needed
    return { success: true, message: "Signed out successfully" }
  } catch (error) {
    console.error("❌ Error signing out:", error)
    return { success: false, message: "Error during sign-out" }
  }
}
