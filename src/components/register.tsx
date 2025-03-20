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
        className="flex flex-col space-y-8 border p-10"
      >
        <div className="flex flex-col space-y-5">
          <label className="space-y-2">
            <span>Name</span>
            <input
              name="name"
              type="text"
              required
              className="w-full border px-2 py-1"
            />
          </label>
          <label className="space-y-2">
            <span>Email</span>
            <input
              name="email"
              type="email"
              required
              className="w-full border px-2 py-1"
            />
          </label>
          <label className="space-y-2">
            <span>Password</span>
            <input
              name="password"
              type="password"
              required
              className="w-full border px-2 py-1"
            />
          </label>
        </div>
        <div className="flex flex-col gap-3">
          <button type="submit" className="bg-emerald-500 py-1 text-white">
            {loading ? "Registering..." : "Register"}
          </button>

          <button className="text-sm" onClick={() => setRegister(false)}>
            Already have an account?
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
