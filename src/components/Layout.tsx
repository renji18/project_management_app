import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();

  const router = useRouter();

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    if (typeof window !== "undefined") void router.push("/");
    return <div>Redirecting to login...</div>;
  }

  const isActive = (path: string) => router.pathname === path;

  return (
    <div className="flex h-screen flex-col">
      {/* Navbar */}
      <nav className="flex w-full items-center justify-between bg-gray-800 p-3 text-white">
        <h2 className="text-lg font-bold">Welcome, {session?.user?.name}!</h2>
        <div className="flex items-center gap-12">
          <ul className="flex items-center gap-7 text-sm">
            <li>
              <Link
                href="/home"
                className={`px-2 py-1 ${
                  isActive("/home") ? "text-blue-400 underline" : "text-white"
                }`}
              >
                My Tasks
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className={`px-2 py-1 ${
                  isActive("/profile")
                    ? "text-blue-400 underline"
                    : "text-white"
                }`}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                href="/notification"
                className={`px-2 py-1 ${
                  isActive("/notification")
                    ? "text-blue-400 underline"
                    : "text-white"
                }`}
              >
                Notifications
              </Link>
            </li>
          </ul>
          <button
            className="rounded bg-red-500 px-2 py-1 text-sm text-white"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-5">{children}</main>
    </div>
  );
};

export default Layout;
