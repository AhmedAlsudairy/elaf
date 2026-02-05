"use client"

import { SignIn } from "@clerk/nextjs";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen py-12">
      <SignIn routing="hash" />
    </div>
  );
};

export default LoginPage;
