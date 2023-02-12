import "../styles/global.css";
import "react-toastify/dist/ReactToastify.css";

import { ApolloProvider } from "@apollo/client";
import { UserProvider } from "@eden/package-context";
import { apolloClient } from "@eden/package-graphql";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import type { ReactElement, ReactNode } from "react";
import * as React from "react";
import { ToastContainer } from "react-toastify";

// import { IS_DEVELOPMENT } from "../constants";

export { reportWebVitals } from "next-axiom";

export type NextPageWithLayout<P = any, IP = P> = NextPage<P, IP> & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  // console.log(IS_DEVELOPMENT ? "development" : "production");

  return (
    <SessionProvider session={session}>
      <ApolloProvider client={apolloClient}>
        <UserProvider>{getLayout(<Component {...pageProps} />)}</UserProvider>

        <ToastContainer />
      </ApolloProvider>
    </SessionProvider>
  );
};

export default App;
