import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { type RootState } from "@/store";
import { clearUser, updateUserName } from "@/store/slices/userSlice";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const [name, setName] = useState(user?.name ?? "");
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleUpdateName = async () => {
    if (!name.trim()) return toast.info("Name cannot be empty!");

    const res = await fetch("/api/user/name", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });

    if (res.ok) {
      const name = (await res.json()) as { name: string };
      dispatch(updateUserName(name?.name));
      toast.success("Name updated successfully!");
      setIsEditing(false);
    } else {
      toast.error("Failed to update name.");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action is irreversible!",
      )
    )
      return;

    setIsDeleting(true);

    const res = await fetch("/api/user", { method: "DELETE" });

    if (res.ok) {
      dispatch(clearUser());
      toast.success("Account deleted successfully!");
      await signOut({ callbackUrl: "/" });
    } else {
      toast.error("Failed to delete account.");
    }

    setIsDeleting(false);
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword)
      return toast.info("Please fill all fields!");

    const res = await fetch("/api/user/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oldPassword, newPassword }),
    });

    if (res.ok) {
      toast.success("Password updated successfully!");
      setShowPasswordModal(false);
      setOldPassword("");
      setNewPassword("");
      await signOut({ callbackUrl: "/" });
    } else {
      toast.error("Failed to update password.");
    }
  };

  useEffect(() => {
    if (!user) return;
    setName(user.name);
  }, [user]);

  return (
    <>
      <Header title="Profile" />
      <Layout>
        <div className="mx-auto mt-10 max-w-md space-y-6 rounded bg-white p-6 shadow">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">User Profile</h2>
          </div>

          {/* Name */}
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded border p-2"
                />
                <button
                  className="rounded bg-green-600 px-3 py-1 text-white"
                  onClick={handleUpdateName}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <p className="text-lg font-semibold">{name}</p>
                <button
                  className="rounded bg-blue-600 px-2 py-1 text-white"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              </>
            )}
          </div>

          {/* Email */}
          <p className="text-gray-600">{user?.email}</p>

          {/* Assigned Tasks */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Assigned Tasks</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              <li>Task 1</li>
              <li>Task 2</li>
              <li>Task 3</li>
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h3 className="mb-2 text-lg font-semibold">Projects</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700">
              <li>Project A</li>
              <li>Project B</li>
            </ul>
          </div>

          {/* Change Password & Delete Account */}
          <div className="mt-4 flex flex-col gap-3">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full rounded bg-yellow-500 py-2 text-white"
            >
              Change Password
            </button>
            <button
              className="w-full rounded bg-red-600 py-2 text-white"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Account"}
            </button>
          </div>
        </div>
      </Layout>

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Change Password</h2>

            <label className="block">
              <span className="text-sm font-medium text-gray-700">
                Old Password
              </span>
              <input
                type="password"
                className="mt-1 w-full rounded border p-2"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </label>

            <label className="mt-3 block">
              <span className="text-sm font-medium text-gray-700">
                New Password
              </span>
              <input
                type="password"
                className="mt-1 w-full rounded border p-2"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>

            <div className="mt-5 flex justify-end gap-3">
              <button
                className="rounded bg-gray-400 px-4 py-2 text-white"
                onClick={() => setShowPasswordModal(false)}
              >
                Cancel
              </button>
              <button
                className="rounded bg-blue-600 px-4 py-2 text-white"
                onClick={handleChangePassword}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
