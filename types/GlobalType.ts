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

export const classImageMap: { [key: string]: string } = {
  호크아이: "class_1.png",
  소서리스: "class_2.png",
  건슬링어: "class_3.png",
  창술사: "class_4.png",
  서머너: "class_5.png",
  기상술사: "class_6.png",
  블레이드: "class_7.png",
  스트라이커: "class_8.png",
  슬레이어: "class_9.png",
  버서커: "class_10.png",
  워로드: "class_11.png",
  리퍼: "class_12.png",
  아르카나: "class_13.png",
  디스트로이어: "class_14.png",
  홀리나이트: "class_15.png",
  데모닉: "class_16.png",
  블래스터: "class_17.png",
  배틀마스터: "class_18.png",
  기공사: "class_19.png",
  도화가: "class_20.png",
  인파이터: "class_21.png",
  스카우터: "class_22.png",
  데빌헌터: "class_23.png",
  바드: "class_24.png",
  "전사(남)": "class_25.png",
  "전사(여)": "class_26.png",
  "무도가(남)": "class_27.png",
  "무도가(여)": "class_28.png",
  "헌터(남)": "class_29.png",
  "헌터(여)": "class_30.png",
  마법사: "class_31.png",
  암살자: "class_32.png",
  스페셜리스트: "class_33.png",
};
