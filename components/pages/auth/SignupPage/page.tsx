"use client"

import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen py-12">
      <SignUp routing="hash" />
    </div>
  );
};

export default SignUpPage;
