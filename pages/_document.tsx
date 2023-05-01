import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,700,0,0" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Loaple" />
        <meta property="og:title" content="Loaple - Lostark Helper" />
        <meta property="og:description" content="스타벅스는 세계에서 가장 큰 다국적 커피 전문점으로, 64개국에서 총 23,187개의 매점을 운영하고 있습니다." />
        <meta property="og:image" content="./images/starbucks_seo.jpg" />
        <meta property="og:url" content="https://starbucks.co.kr" />

        <meta property="twitter:card" content="summary" />
        <meta property="twitter:site" content="Loaple" />
        <meta property="twitter:title" content="Loaple - Lostark Helper" />
        <meta property="twitter:description" content="스타벅스는 세계에서 가장 큰 다국적 커피 전문점으로, 64개국에서 총 23,187개의 매점을 운영하고 있습니다." />
        <meta property="twitter:image" content="./images/starbucks_seo.jpg" />
        <meta property="twitter:url" content="https://starbucks.co.kr" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
