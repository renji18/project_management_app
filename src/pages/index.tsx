import Header from "@/components/Header";
import Register from "@/components/register";
import { SignIn } from "@/components/sign-in";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();
  const [register, setRegister] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      void router.replace("/home");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <main className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </main>
    );
  }

  return (
    <>
      <Header title="Authentication" desc="Enter the project management app" />
      <main className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <div className="w-[400px] rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-700">
            {register ? "Create an Account" : "Sign In"}
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            {register
              ? "Register to manage your projects"
              : "Sign in to continue"}
          </p>
          {status === "unauthenticated" ? (
            register ? (
              <Register setRegister={setRegister} />
            ) : (
              <SignIn setRegister={setRegister} />
            )
          ) : (
            <div className="text-gray-700">Authenticated, redirecting...</div>
          )}
        </div>
      </main>
    </>
  );
}
