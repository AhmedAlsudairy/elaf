'use server'
import supabaseServer from "@/lib/utils/supabase/supabase-call-server"
import { redirect } from "next/navigation"

export const SignOut=async () => {
supabaseServer.auth.signOut()
redirect("/")

}