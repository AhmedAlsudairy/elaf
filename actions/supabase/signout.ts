'use server'
import supabaseServer from "@/lib/utils/supabase/supabase-call-server"


export const SignOut=async () => {
const{}=supabaseServer.auth.signOut()


}