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
        <title>로아플 - 로스트아크 유저를 위한 도구모음</title>
        <title>Loaple - Lostark Helper</title>
      </Head>
      <Component
        className={`${nanumNeo.className} ${roboto.className}`}
        {...pageProps}
      />
    </Provider>
  );
}
