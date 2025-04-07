import { FooterProps } from "@/types/GlobalType";
import { Github } from "./icons/Index";
import Link from "next/link";
import useAlert from "@/hooks/useAlert";
import { useEffect, useState } from "react";
import axios from "axios";
import useClipboard from "@/hooks/useClipboard";

const Footer: React.FC<FooterProps> = ({ children, className }) => {
  const alert = useAlert();
  const { copyToClipboard } = useClipboard();
  // const [visitCount, setVisitCount] = useState<number>(0);

  // // 방문자 카운트를 위함
  // useEffect(() => {
  //   const url =
  //     process.env.NEXT_PUBLIC_VISIT_API ||
  //     (process.env.NODE_ENV === "development"
  //       ? "http://localhost:3000/api/visit"
  //       : "/loaple/visit");

  //   if (!document.cookie) {
  //     const time_origin = new Date();
  //     const utc =
  //       time_origin.getTime() +
  //       time_origin.getTimezoneOffset() * 60 * 1000 +
  //       9 * 60 * 60 * 1000;
  //     const time_korea = new Date(utc);
  //     const expire = new Date();

  //     expire.setFullYear(time_korea.getFullYear());
  //     expire.setMonth(time_korea.getMonth());
  //     expire.setDate(time_korea.getDate() + 1);
  //     expire.setHours(0);
  //     expire.setMinutes(0);
  //     expire.setSeconds(0);

  //     // UTC로 해야 제대로 만료가 되더라... Timezone 문제인듯. 이렇게 하면 쿠키의 표기에는 -9시간으로 표기됨.
  //     // 그리고 express(next.js) 서버에는 그냥 new Date()를 그대로 사용해도 제대로된 시간대로 적용되는듯?
  //     document.cookie = `visit=true; expires=${expire.toUTCString()}; path=/; SameSite=Lax;`;

  //     axios
  //       .post(url)
  //       .then((res) => {
  //         // console.log(res);
  //         setVisitCount(res.data.visitCount);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   } else {
  //     axios
  //       .get(url)
  //       .then((res) => {
  //         // console.log(res);
  //         setVisitCount(res.data.visitCount);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  // }, []);

  return (
    <footer className={className}>
      {/* {visitCount ? (
        <div className="visitor">오늘의 방문자 수 : {visitCount}</div>
      ) : (
        <></>
      )} */}
      <div className="copyright">
        <div className="descr">
          <p>Copyright © {new Date().getFullYear()} Loaple</p>
        </div>
        <div className="contact">
          <p className="descr">Contact me by</p>
          <p
            title="click to copy email address"
            onClick={() => {
              copyToClipboard("banghyechan@gmail.com");
            }}
            className="email"
          >
            banghyechan@gmail.com
          </p>
          <Link href="https://github.com/momo1108" target="_blank">
            <Github size={25} />
          </Link>
        </div>
      </div>
      <div className="attribution">
        {children}. Sound Effect from{" "}
        <a href="https://pixabay.com/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=87963">
          Pixabay
        </a>
        . Sound Effect from{" "}
        <a href="https://pixabay.com/sound-effects/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=47985">
          Pixabay
        </a>
        . Sound Effect from{" "}
        <a href="https://pixabay.com/sound-effects/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=43861">
          Pixabay.
        </a>
        <a href="https://www.freepik.com/free-photo/rustic-gray-concrete-textured-background_15440578.htm#query=dark%20marble&position=17&from_view=search&track=ais">
          Image by rawpixel.com
        </a>{" "}
        on Freepik
      </div>
    </footer>
  );
};

export default Footer;
