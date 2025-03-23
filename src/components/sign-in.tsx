import { signIn } from "next-auth/react";
import { toast } from "sonner";

export function SignIn({
  setRegister,
}: {
  setRegister: (arg: boolean) => void;
}) {
  return (
    <div className="flex h-full items-center justify-center">
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const res = await signIn("credentials", {
            email: formData.get("email"),
            password: formData.get("password"),
            redirect: false,
          });

          if (res?.error) {
            toast.error("Sign-in failed: " + res.error);
          } else {
            toast.success("Logged in successfully");
          }
        }}
        className="w-[350px] space-y-6 rounded-lg bg-white p-8 shadow-lg"
      >
        <div className="flex flex-col space-y-4">
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
          >
            Sign In
          </button>

          <button
            type="button"
            className="text-sm text-[#1E3A8A] hover:underline"
            onClick={() => setRegister(true)}
          >
            Don&apos;t have an account?
          </button>
        </div>
      </form>
    </div>
  );
}
