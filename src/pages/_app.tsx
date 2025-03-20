import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { getSession, SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { Toaster } from "sonner";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps,
}) => {
  const [session, setSession] = useState(pageProps.session);

  useEffect(() => {
    async function fetchSession() {
      const newSession = await getSession();
      setSession(newSession);
    }
    void fetchSession();
  }, []);

  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        <div className={GeistSans.className}>
          <Component {...pageProps} />
          <Toaster richColors position="top-right" />
        </div>
      </Provider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
