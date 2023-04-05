import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import { api } from "../utils/api";

import "../styles/globals.css";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";

import { DefaultSeo } from "next-seo";
import SEO from "../../next-seo.config";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

export const themes = ["light", "dark"];

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = (({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <SessionProvider session={session as Session}>
      <ThemeProvider themes={themes} attribute="data-theme">
        <DefaultSeo {...SEO} />
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </SessionProvider>
  );
}) as AppType<{ session: Session | null }>;

export default api.withTRPC(MyApp);
