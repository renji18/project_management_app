import { type RootState } from "@/store";
import { setTasks, type Task } from "@/store/slices/taskSlice";
import { setUser, type User } from "@/store/slices/userSlice";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { status } = useSession();

  const router = useRouter();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) throw new Error("Failed to fetch tasks");

        const data = (await res.json()) as Task[];
        dispatch(setTasks(data));
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      }
    };

    void fetchTasks();
  }, [dispatch]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch user details");

        const data = (await res.json()) as User;
        dispatch(setUser(data));
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    void fetchUserDetails();
  }, [dispatch]);

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
        <h2 className="text-lg font-bold">Welcome, {user?.name}!</h2>
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
                href="/assigned"
                className={`px-2 py-1 ${
                  isActive("/assigned")
                    ? "text-blue-400 underline"
                    : "text-white"
                }`}
              >
                Assigned Tasks
              </Link>
            </li>
            <li>
              <Link
                href="/archive"
                className={`px-2 py-1 ${
                  isActive("/archive")
                    ? "text-blue-400 underline"
                    : "text-white"
                }`}
              >
                Archive
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
