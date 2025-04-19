import "@/styles/globals.scss";
import { nanumNeo, roboto } from "@/types/GlobalType";
import type { AppProps } from "next/app";

import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";
import AlertProvider from "@/components/alert/AlertProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AlertProvider
      alertWrapperClassName="alertWrapperDiv"
      alertClassName="alertDiv"
    >
      <DefaultSeo {...SEO} />
      <Component
        className={`${nanumNeo.className} ${roboto.className}`}
        {...pageProps}
      />
    </AlertProvider>
  );
}
