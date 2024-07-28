import React, { useEffect, useState } from 'react';
import Terms from "@/components/common/terms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthProps } from "@/types";
import { FaGoogle } from "react-icons/fa";
import ClipLoader from "react-spinners/ClipLoader";

const Auth = ({ 
  mode, 
  isLoading, 
  onAuth, 
  onSignOut,
  logoUrl, 
  user
}: AuthProps) => {
  const isLogin = mode === "login";
  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      if (typeof user === 'function') {
        const loggedIn = await user();
        setIsSignedIn(loggedIn);
      } else {
        setIsSignedIn(user);
      }
    };
    checkLoginStatus();
  }, [user]);

  let title, buttonText;
  if (isSignedIn) {
    title = "Welcome Back!";
    buttonText = "Sign out";
  } else {
    title = isLogin ? "Welcome Back" : "Let's Start";
    buttonText = isLogin ? "Sign in with Google" : "Sign up with Google";
  }

  const handleButtonClick = () => {
    if (isSignedIn) {
      onSignOut();
    } else {
      onAuth();
    }
  };

  // Show spinner while loading
  if (isSignedIn === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <ClipLoader color="#4A90E2" size={50} />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-[320px] sm:max-w-[400px]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <img
              src={logoUrl}
              alt="Logo"
              className="w-32 h-32 sm:w-40 sm:h-40"
            />
          </div>
          <CardTitle className="font-balooBhaijaan text-3xl sm:text-4xl ">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 pb-6">
          <Button 
            onClick={handleButtonClick}
            disabled={isLoading}
            className={`font-balooBhaijaan w-full h-10 text-md px-4 sm:px-6 ${
              isSignedIn ? 'bg-red-500 hover:bg-red-600 text-white' : ''
            }`}
            variant={isSignedIn ? "destructive" : "default"}
          >
            {isLoading ? (
              <ClipLoader color="#ffffff" size={20} />
            ) : (
              <>
                {!isSignedIn && <FaGoogle className="mr-2 h-4 w-4" />}
                {buttonText}
              </>
            )}
          </Button>
        </CardContent>
        {!isSignedIn && (
          <CardFooter className="flex justify-center text-center">
            <Terms linkText="Terms of Service" linkHref="/terms">
              By {isLogin ? "signing in" : "signing up"}, you agree to our
            </Terms>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Auth;