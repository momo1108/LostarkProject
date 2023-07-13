import { DefaultSeoProps } from "next-seo";

const config: DefaultSeoProps = {
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "http://loaple.site",
    images: [
      {
        url: "/images/loaple_seo.jpg",
        width: 456,
        height: 308,
        alt: "로아플 이미지",
      },
    ],
    siteName: "로아플(Loaple)",
  },
  twitter: {
    handle: "@banghyechan",
    site: "@banghyechan",
    cardType: "summary_large_image",
  },
};

export default config;
