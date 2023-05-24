import wrapper from "@/redux/init";
import "@/styles/globals.scss";
import { nanumNeo, roboto } from "@/types/GlobalType";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Provider } from "react-redux";

export default function App({ Component, ...rest }: AppProps) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  return (
    <Provider store={store}>
      <Head>
        <title>Loaple - Lostark Helper</title>
      </Head>
      <Component
        className={`${nanumNeo.className} ${roboto.className}`}
        {...pageProps}
      />
    </Provider>
  );
}
