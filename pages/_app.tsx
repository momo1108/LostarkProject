import wrapper from "@/redux/init";
import "@/styles/globals.scss";
import { nanumNeo, roboto } from "@/types/GlobalType";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";

import { DefaultSeo } from "next-seo";
import SEO from "../next-seo.config";

export default function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  return (
    <Provider store={store}>
      <DefaultSeo {...SEO} />
      <Component
        className={`${nanumNeo.className} ${roboto.className}`}
        {...pageProps}
      />
    </Provider>
  );
}
