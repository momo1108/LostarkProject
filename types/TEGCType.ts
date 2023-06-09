/*
Engraving, Gem, Card 를 위한 타입파일
*/

import { CharData } from "./ReducerType";

export type ArmoryTEGCProps = {
  data: CharData;
  className: string;
};

export type GemTooltipProps = {
  data: GemData;
};

export type GemData = any;

export type StatData = any;

export type TendencyData = any;

export const tendencyImageMap: { [key: string]: string } = {
  지성: "/images/tendency1.png",
  담력: "/images/tendency2.png",
  매력: "/images/tendency3.png",
  친절: "/images/tendency4.png",
};

export const gradeCardBackgroundMap: { [key: string]: string } = {
  일반: "common",
  고급: "uncommon",
  희귀: "rare",
  영웅: "epic",
  전설: "legendary",
  유물: "legendary",
};

export const engravingLevelColorMap: { [key: string]: string } = {
  "3": "#fe9600",
  "2": "#ce43fc",
  "1": "#00b5ff",
  "3d": "#de7600",
  "2d": "#ae23dc",
  "1d": "#0095df",
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
};
