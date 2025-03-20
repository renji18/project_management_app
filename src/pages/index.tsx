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
      <main className="flex h-screen w-screen items-center justify-center">
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <>
      <Header title="Authentication" desc="Enter the project management app" />
      <main className="flex h-screen w-screen items-center justify-center">
        {status === "unauthenticated" ? (
          register ? (
            <Register setRegister={setRegister} />
          ) : (
            <SignIn setRegister={setRegister} />
          )
        ) : (
          <div>Authenticated, redirecting...</div>
        )}
      </main>
    </>
  );
}
