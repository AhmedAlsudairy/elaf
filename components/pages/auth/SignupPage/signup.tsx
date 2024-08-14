"use client"
import { useState } from "react";
import Auth from "../components/auth";
import { ELAF_LOGO_URL } from "@/constant/svg";
import { IsLoggedIn } from "@/actions/supabase/is-user-login";
import { SignOut } from "@/actions/supabase/signout";
import { OauthSignin } from "@/actions/supabase/oauth-signin";

 const SignUp = () => {
   const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    setIsLoading(true);
    await OauthSignin();
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    await SignOut();
    setIsLoading(false);
  };

  return (
    <Auth
      mode="signup"
      isLoading={isLoading}
      onAuth={handleAuth}
      onSignOut={handleSignOut}
      logoUrl={ELAF_LOGO_URL}
      user={IsLoggedIn}
    />
  );
};

export default SignUp;