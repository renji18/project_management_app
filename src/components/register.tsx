import { signIn } from "next-auth/react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

interface RegisterResponse {
  error?: string;
  message?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

const Register = ({ setRegister }: { setRegister: (arg: boolean) => void }) => {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = (await response.json()) as RegisterResponse;
    setLoading(false);

    if (!response.ok) {
      toast.error("Registration failed: " + data.error);
      return;
    }

    toast.success("Registration successful! Logging in...");

    const signInRes = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (signInRes?.error) {
      toast.error("Auto-login failed: " + signInRes.error);
    } else {
      window.location.reload();
    }
  }

  return (
    <div className="flex h-full items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-[350px] space-y-6 rounded-lg bg-white p-8 shadow-lg"
      >
        <div className="flex flex-col space-y-4">
          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Name</span>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#1E3A8A] focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            className="w-full rounded-md bg-[#1E3A8A] py-2 text-white transition hover:bg-[#1A2F6A]"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <button
            type="button"
            className="text-sm text-[#1E3A8A] hover:underline"
            onClick={() => setRegister(false)}
          >
            Already have an account?
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
