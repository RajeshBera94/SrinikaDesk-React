import { useState } from "react";
import Input from "../ui/Input";
import Swal from "sweetalert2";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setErrorEmail] = useState("");
  const [errorpassword, setErrorPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    // for Email validation

    if (!email) {
      setErrorEmail("Email is required");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setErrorEmail("Please enter a valid email address");
      return;
    }

    // for Email validation

    if (!password) {
      setErrorPassword("password is required");
      return;
    }
    if (password.length < 6) {
      setErrorPassword("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Welcome to SrinikaDesk.",
        confirmButtonText: "Continue",
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-md w-full">
        <div className="p-6 rounded-lg bg-white border border-slate-300 shadow-xs md:p-8">
          <h1 className="text-slate-900 text-center text-3xl font-bold">
            SrinikaDesk
          </h1>
          <form className="space-y-6 mt-10" onSubmit={handleLogin} noValidate>
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="SrinikaDesk@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorEmail("");
              }}
              error={emailError}
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorPassword("");
              }}
              error={errorpassword}
              showPassword={true}
            />

            <div className="flex items-start flex-wrap gap-2">
              <a
                href="#"
                className="ml-auto text-sm font-medium text-blue-700 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-3.5 text-sm text-white rounded-md font-semibold tracking-wide border border-blue-600 bg-sky-600 hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus-visible:ring-blue-500 enabled:cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing In" : "Sign in"}
            </button>

            <div className="text-slate-900 text-sm text-center">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-blue-700 hover:underline ml-1 font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded"
              >
                Sign up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Login;
