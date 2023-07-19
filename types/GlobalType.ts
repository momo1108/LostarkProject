import localFont from "next/font/local";
import { AccessoryInfo, EngraveInfo } from "./EngraveType";
import { KeyboardEventHandler } from "react";

export type PageProps = {
  children?: React.ReactNode;
  className?: string;
  onKeyDown?: KeyboardEventHandler<HTMLDivElement> | undefined;
};

export type FooterProps = {
  children?: React.ReactNode;
  className?: string;
};

export type ModalProps = {
  children?: React.ReactNode;
  className?: string;
  closeTimer?: number;
  isOpen: boolean;
  data: string;
  closeFunc?: () => void;
};

export type EngravePreset = {
  name: string;
  descr: {
    engrave: string; // ex."원예저타아피 333331"
    stat: string; // ex."치특"
  };
  data: string;
};

export type EngravePresetWithParsedData = {
  name: string;
  descr: {
    engrave: string; // ex."원예저타아피 333331"
    stat: string; // ex."치특"
  };
  data: ModalData;
};

export type ModalData = {
  targetList: EngraveInfo[];
  equipList: EngraveInfo[];
  abilityList: EngraveInfo[];
  negativeEngrave: EngraveInfo;
  accessoryList: AccessoryInfo[];
};

export type MenuProps = {
  menu: Menu[];
};

export type Menu = {
  id: number;
  title: string;
  desc: string;
  url: string;
  strokeWidth: number;
};

export type InfoPage = {
  id: number;
  title: string;
  desc: string;
  url: string;
};

export type MainProps = {
  menu: Menu[];
};

export type MainBodyProps = {
  menu: Menu[];
};

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

export const gradeClassMap: { [key: string]: string } = {
  일반: "normalBackground",
  고급: "uncommonBackground",
  희귀: "rareBackground",
  영웅: "epicBackground",
  전설: "legendaryBackground",
  유물: "relicBackground",
  고대: "ancientBackground",
  에스더: "siderealBackground",
};

export const gradeTextColorMap: { [key: string]: string } = {
  일반: "commonColor",
  고급: "uncommonColor",
  희귀: "rareColor",
  영웅: "epicColor",
  전설: "legendaryColor",
  유물: "relicColor",
  고대: "ancientColor",
  에스더: "siderealColor",
};

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
  소울이터: "class_34.png",
};

export const engravingIconMap: { [key: string]: string } = {
  "감소 효과 선택": "empty_engrave.png",
  "공격력 감소": "001.png",
  "공격속도 감소": "002.png",
  "방어력 감소": "003.png",
  "이동속도 감소": "004.png",
  각성: "011.png",
  강령술: "013.png",
  "강화 방패": "015.png",
  "결투의 대가": "016.png",
  구슬동자: "020.png",
  "굳은 의지": "021.png",
  "급소 타격": "023.png",
  "기습의 대가": "024.png",
  "달인의 저력": "027.png",
  돌격대장: "028.png",
  "마나 효율 증가": "030.png",
  "마나의 흐름": "031.png",
  바리케이드: "033.png",
  "번개의 분노": "035.png",
  "부러진 뼈": "036.png",
  "분쇄의 주먹": "038.png",
  불굴: "039.png",
  선수필승: "042.png",
  "슈퍼 차지": "044.png",
  승부사: "045.png",
  "실드 관통": "046.png",
  "안정된 상태": "049.png",
  "약자 무시": "050.png",
  "에테르 포식자": "051.png",
  "여신의 가호": "052.png",
  "예리한 둔기": "055.png",
  원한: "058.png",
  "위기 모면": "059.png",
  "저주받은 인형": "061.png",
  "정기 흡수": "066.png",
  "중갑 착용": "068.png",
  "최대 마나 증가": "073.png",
  "탈출의 명수": "076.png",
  "폭발물 전문가": "077.png",
  "질량 증가": "085.png",
  추진력: "086.png",
  "타격의 대가": "087.png",
  "시선 집중": "088.png",
  아드레날린: "089.png",
  속전속결: "090.png",
  전문의: "091.png",
  긴급구조: "092.png",
  "정밀 단도": "093.png",
  갈증: "012.png",
  "강화 무기": "014.png",
  "고독한 기사": "017.png",
  광기: "018.png",
  "광전사의 비기": "019.png",
  "극의: 체술": "022.png",
  "넘치는 교감": "025.png",
  "달의 소리": "026.png",
  "두 번째 동료": "029.png",
  "멈출 수 없는 충동": "032.png",
  버스트: "034.png",
  "분노의 망치": "037.png",
  "사냥의 시간": "040.png",
  "상급 소환사": "041.png",
  세맥타통: "043.png",
  심판자: "047.png",
  "아르데타인의 기술": "048.png",
  역천지체: "053.png",
  "포격 강화": "054.png",
  "오의 강화": "056.png",
  "완벽한 억제": "057.png",
  "잔재된 기운": "060.png",
  "전투 태세": "062.png",
  "절실한 구원": "063.png",
  절정: "064.png",
  절제: "065.png",
  "죽음의 습격": "067.png",
  "중력 수련": "069.png",
  "진실된 용맹": "070.png",
  "진화의 유산": "071.png",
  초심: "072.png",
  "축복의 오라": "074.png",
  "충격 단련": "075.png",
  피스메이커: "078.png",
  핸드거너: "079.png",
  "화력 강화": "080.png",
  "황제의 칙령": "081.png",
  "황후의 은총": "082.png",
  일격필살: "083.png",
  오의난무: "084.png",
  점화: "094.png",
  환류: "095.png",
  회귀: "097.png",
  만개: "098.png",
  이슬비: "099.png",
  질풍노도: "100.png",
  처단자: "101.png",
  포식자: "102.png",
  "만월의 집행자": "103.png",
  "그믐의 경계": "104.png",
};

export const classDetailMap: { [key: string]: string[] } = {
  "전사(남)": ["버서커", "워로드", "디스트로이어", "홀리나이트"],
  "전사(여)": ["슬레이어"],
  "무도가(남)": ["스트라이커"],
  "무도가(여)": ["창술사", "배틀마스터", "기공사", "인파이터"],
  "헌터(남)": ["호크아이", "블래스터", "스카우터", "데빌헌터"],
  "헌터(여)": ["건슬링어"],
  마법사: ["소서리스", "서머너", "아르카나", "바드"],
  암살자: ["블레이드", "리퍼", "데모닉"],
  스페셜리스트: ["기상술사", "도화가"],
};

export const CATEGORY_CODE: { [key: string | number]: number } = {
  목걸이: 200010,
  0: 200010,
  귀걸이: 200020,
  1: 200020,
  반지: 200030,
  2: 200030,
  팔찌: 200040,
  "어빌리티 스톤": 30000,
  아뮬렛: 170300,
  보석: 210000,
  각인서: 40000,
};

export const ETC_OPTION_CODE: { [key: string]: number | null } = {
  ANY: null,
  // 전투 특성
  "전투 특성": 2,
  치명: 15,
  특화: 16,
  제압: 17,
  신속: 18,
  인내: 19,
  숙련: 20,
  // 각인 효과
  "각인 효과": 3,
  원한: 118,
  "굳은 의지": 123,
  "실드 관통": 237,
  강령술: 243,
  "저주받은 인형": 247,
  각성: 255,
  "안정된 상태": 111,
  "위기 모면": 140,
  "달인의 저력": 238,
  "중갑 착용": 240,
  "강화 방패": 242,
  "부러진 뼈": 245,
  승부사: 248,
  "기습의 대가": 249,
  "마나의 흐름": 251,
  돌격대장: 254,
  "약자 무시": 107,
  "정기 흡수": 109,
  "에테르 포식자": 110,
  "슈퍼 차지": 121,
  구슬동자: 134,
  "예리한 둔기": 141,
  불굴: 235,
  "여신의 가호": 239,
  선수필승: 244,
  "급소 타격": 142,
  "분쇄의 주먹": 236,
  "폭발물 전문가": 241,
  "번개의 분노": 246,
  바리케이드: 253,
  "마나 효율 증가": 168,
  "최대 마나 증가": 167,
  "탈출의 명수": 202,
  "결투의 대가": 288,
  "질량 증가": 295,
  추진력: 296,
  "타격의 대가": 297,
  "시선 집중": 298,
  아드레날린: 299,
  속전속결: 300,
  전문의: 301,
  긴급구조: 302,
  "정밀 단도": 303,
  광기: 125,
  "오의 강화": 127,
  "강화 무기": 129,
  "화력 강화": 130,
  "광전사의 비기": 188,
  초심: 189,
  "극의: 체술": 190,
  "충격 단련": 191,
  핸드거너: 192,
  "포격 강화": 193,
  "진실된 용맹": 194,
  "절실한 구원": 195,
  점화: 293,
  환류: 294,
  "분노의 망치": 196,
  "중력 수련": 197,
  "상급 소환사": 198,
  "넘치는 교감": 199,
  "황후의 은총": 200,
  "황제의 칙령": 201,
  "전투 태세": 224,
  "고독한 기사": 225,
  세맥타통: 256,
  역천지체: 257,
  "두 번째 동료": 258,
  "죽음의 습격": 259,
  절정: 276,
  절제: 277,
  "잔재된 기운": 278,
  버스트: 279,
  "완벽한 억제": 280,
  "멈출 수 없는 충동": 281,
  심판자: 282,
  "축복의 오라": 283,
  "아르데타인의 기술": 284,
  "진화의 유산": 285,
  갈증: 286,
  "달의 소리": 287,
  피스메이커: 289,
  "사냥의 시간": 290,
  일격필살: 291,
  오의난무: 292,
  회귀: 305,
  만개: 306,
  질풍노도: 307,
  이슬비: 308,
  포식자: 309,
  처단자: 310,
  "만월의 집행자": 311,
  "그믐의 경계": 312,
  // 감소 효과
  "공격력 감소": 800,
  "공격속도 감소": 802,
  "방어력 감소": 801,
  "이동속도 감소": 803,
  // 팔찌 기본 효과
  "팔찌 기본 효과": 1,
  힘: 3,
  민첩: 4,
  지능: 5,
  체력: 6,
  // 팔찌 특수 효과
  "팔찌 특수 효과": 5,
  강타: 39,
  "긴급 수혈": 33,
  돌진: 38,
  마나회수: 36,
  "마법 방어력": 2,
  멸시: 29,
  무시: 30,
  "물리 방어력": 1,
  반격: 28,
  반전: 31,
  속공: 26,
  앵콜: 35,
  오뚝이: 37,
  "응급 처치": 34,
  "전투 중 생명력 회복량": 6,
  "최대 마나": 4,
  "최대 생명력": 3,
  타격: 40,
  투자: 27,
  회생: 32,
  // 팔지 옵션 수량
  "팔지 옵션 수량": 4,
  "고정 효과 수량": 1,
  "부여 효과 수량": 2,
};
