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

  if (status === "unauthenticated") {
    if (typeof window !== "undefined") void router.push("/");
    return <div>Redirecting to login...</div>;
  }

  const isActive = (path: string) => router.pathname === path;

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="flex items-center justify-between bg-[#1E3A8A] px-6 py-4 text-white shadow-md">
        <h2 className="text-lg font-semibold">
          Welcome, <span className="font-bold">{user?.name}</span>!
        </h2>
        <div className="flex items-center gap-10">
          <ul className="flex items-center gap-6 text-sm">
            {[
              { href: "/home", label: "My Tasks" },
              { href: "/assigned", label: "Assigned Tasks" },
              { href: "/archive", label: "Archive" },
              { href: "/profile", label: "Profile" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`rounded-md px-3 py-1 transition ${
                    isActive(href)
                      ? "bg-white text-[#1E3A8A] shadow-sm"
                      : "hover:bg-[#1A2F6A]"
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            className="rounded bg-red-500 px-3 py-1 text-sm font-medium text-white transition hover:bg-red-600"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-8 py-6">{children}</main>
    </div>
  );
};

export default Layout;
