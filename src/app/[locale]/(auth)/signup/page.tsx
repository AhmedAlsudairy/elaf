import SignupPage from "@/components/pages/auth/SignupPage/signup";
import Login from "../login/page";

const page = () => {
  return (
    <>
      <form action={Login}>
        {" "}
        <SignupPage />
      </form>
    </>
  );
};

export default page;
