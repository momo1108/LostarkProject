import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          name="keywords"
          content="로스트아크,로아플,loaple,Loaple,로스트아크사이트"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Loaple" />
        <meta property="og:title" content="Loaple - Lostark Helper" />
        <meta
          property="og:description"
          content="로아플은 세계에서 가장 작은 로스트아크 웹서비스로, 혼자 야무지게 만든 웹서비스입니다."
        />
        <meta property="og:image" content="/images/loaple_seo.jpg" />
        <meta property="og:url" content="http://loaple.site" />

        <meta property="twitter:card" content="summary" />
        <meta property="twitter:site" content="Loaple" />
        <meta property="twitter:title" content="Loaple - Lostark Helper" />
        <meta
          property="twitter:description"
          content="로아플은 세계에서 가장 작은 로스트아크 웹서비스로, 혼자 야무지게 만든 웹서비스입니다."
        />
        <meta property="twitter:image" content="/images/loaple_seo.jpg" />
        <meta property="twitter:url" content="http://loaple.site" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
