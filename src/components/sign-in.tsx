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
        className="flex flex-col space-y-8 border p-10"
      >
        <div className="flex flex-col space-y-5">
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
            Sign In
          </button>

          <button className="text-sm" onClick={() => setRegister(true)}>
            Don&apos;t have an account?
          </button>
        </div>
      </form>
    </div>
  );
}
