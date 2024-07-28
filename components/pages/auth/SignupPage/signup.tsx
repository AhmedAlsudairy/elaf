'use client'
import { useState } from "react";
import Auth from "../components/auth";
import { authWithGoogle } from "@/actions/supabase/action";
import { ELAF_LOGO_URL } from "@/constant/svg";



const SignupPage= () => {

  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    setIsLoading(true);
    try {
      await authWithGoogle();
    } catch (error) {
      console.error("Error during authentication:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
    return   <Auth
    mode="login"
    isLoading={isLoading}
    onAuth={handleAuth}
    logoUrl={ELAF_LOGO_URL}

  />;
  };

export default SignupPage