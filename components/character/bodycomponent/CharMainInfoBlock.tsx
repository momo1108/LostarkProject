import { CharMainInfoParams } from "@/types/CharacterType";
import styles from "@/styles/character/Body.module.scss";

const CharMainInfoBlock: React.FC<CharMainInfoParams> = ({ data, render }) => {
  return (
    <div className={styles.infoContainer}>
      {render ? (
        <>
          <div className={styles.infoContainerItemDiv}>
            <div className={styles.profileDiv}>
              {data.ArmoryProfile.CharacterImage ? (
                <img
                  className={styles.profileImage}
                  src={data.ArmoryProfile.CharacterImage}
                  alt=""
                />
              ) : (
                <svg
                  version="1.0"
                  xmlns="http://www.w3.org/2000/svg"
                  className={styles.emptyProfileIcon}
                  viewBox="0 0 275 432"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <g
                    transform="translate(-12,442) scale(0.05,-0.05)"
                    fill="#aaa"
                    stroke="#aaa"
                  >
                    <path
                      strokeWidth="50"
                      d="M2730 8532 c-573 -142 -826 -813 -491 -1300 391 -569 1296 -411 1474 258 163 614 -381 1191 -983 1042z m495 -159 c686 -335 455 -1380 -305 -1380 -819 0 -997 1132 -223 1420 124 46 394 26 528 -40z"
                    />
                    <path
                      strokeWidth="50"
                      d="M640 8305 c-199 -100 -252 -463 -197 -1355 24 -384 14 -353 163 -541 205 -259 340 -332 703 -380 582 -77 646 -333 505 -2009 -66 -782 -163 -1974 -205 -2530 -51 -683 18 -917 300 -1010 407 -134 634 413 861 2070 92 666 171 1120 208 1186 58 103 200 -615 411 -2079 120 -827 156 -940 338 -1046 265 -156 491 27 581 470 86 423 67 833 -130 2799 -144 1438 -98 1974 181 2066 440 146 571 43 641 -506 54 -423 154 -605 330 -605 192 0 288 416 231 1002 -64 669 -223 899 -699 1018 -221 55 -1332 51 -1332 -5 0 -39 18 -40 560 -53 1152 -27 1303 -137 1391 -1016 33 -330 -9 -729 -84 -804 -137 -137 -258 55 -316 503 -64 491 -136 599 -410 615 -712 42 -799 -342 -570 -2515 201 -1918 183 -2634 -74 -2860 -216 -190 -405 36 -476 570 -220 1638 -383 2472 -503 2572 -138 115 -227 -149 -348 -1032 -260 -1906 -461 -2438 -833 -2208 -216 134 -216 212 37 3148 168 1953 91 2279 -561 2363 -508 65 -744 290 -784 747 -75 840 -11 1318 178 1336 152 15 229 -148 302 -646 86 -576 191 -718 571 -771 173 -24 639 7 685 45 67 56 8 66 -387 66 -614 0 -668 49 -761 678 -57 386 -94 509 -185 616 -110 129 -206 159 -322 101z"
                    />
                    <path d="M2806 6195 c-217 -85 -401 -532 -257 -626 99 -65 157 -4 210 224 36 155 82 194 217 182 219 -18 223 -66 35 -436 -198 -389 -218 -720 -44 -719 86 1 102 31 114 206 8 124 24 194 61 266 28 54 88 172 134 261 126 246 135 383 31 506 -107 128 -351 194 -501 136z" />
                    <path d="M2893 4683 c-70 -77 -14 -203 90 -203 38 0 117 90 117 133 0 87 -146 137 -207 70z" />
                  </g>
                </svg>
              )}
            </div>
          </div>
          <div className={styles.infoContainerItemDiv}>hello</div>
          <div className={styles.infoContainerItemDiv}>hello</div>
        </>
      ) : (
        <p>로딩중...</p>
      )}
    </div>
  );
};

export default CharMainInfoBlock;
