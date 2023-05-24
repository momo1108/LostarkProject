import localFont from "next/font/local";

export const roboto = localFont({
  src: [
    {
      path: "../public/fonts/Roboto/Roboto-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Roboto/Roboto-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Roboto/Roboto-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
});

export const nanumNeo = localFont({
  src: [
    {
      path: "../public/fonts/NanumSquareNeo/NanumSquareNeo-aLt.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/NanumSquareNeo/NanumSquareNeo-bRg.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/NanumSquareNeo/NanumSquareNeo-cBd.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/NanumSquareNeo/NanumSquareNeo-dEb.woff",
      weight: "800",
      style: "normal",
    },
  ],
});
