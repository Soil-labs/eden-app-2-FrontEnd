import "../styles/global.css";
import "react-toastify/dist/ReactToastify.css";

import type { NextPage } from "next";
import type { AppProps } from "next/app";
// import dynamic from "next/dynamic";
import type { ReactElement, ReactNode } from "react";
import * as React from "react";

import { AppProviders } from "@/components/config/AppProviders";

import mixpanelConfig from "../utils/tools/mixpanel";

// const AppDeviceLayout = dynamic(
//   () => import(`@eden/package-ui/src/layout/AppDeviceLayout/AppDeviceLayout`),
//   {
//     ssr: false,
//   }
// );

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
  pageProps: { ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  // console.log(IS_DEVELOPMENT ? "development" : "production");
  mixpanelConfig();

  return (
    <AppProviders>
      <>
        {/* <AppMaintainanceLayout /> */}
        {/* <AppDeviceLayout /> */}
        {getLayout(<Component {...pageProps} />)}
      </>
    </AppProviders>
  );
};

export default App;
