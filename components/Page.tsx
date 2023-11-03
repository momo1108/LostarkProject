import { PageProps } from "@/types/GlobalType";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Page: React.FC<PageProps> = ({ children, className, onKeyDown }) => {
  const router = useRouter();

  // 방문자 카운트를 위함
  useEffect(() => {
    if (!document.cookie) {
      const time_origin = new Date();
      const utc =
        time_origin.getTime() +
        time_origin.getTimezoneOffset() * 60 * 1000 +
        9 * 60 * 60 * 1000;
      const time_korea = new Date(utc);
      const expire = new Date();

      expire.setFullYear(time_korea.getFullYear());
      expire.setMonth(time_korea.getMonth());
      expire.setDate(time_korea.getDate() + 1);
      expire.setHours(0);
      expire.setMinutes(0);
      expire.setSeconds(0);

      document.cookie = `visit=true; expires=${expire.toUTCString()}; path=/`;
      const url =
        process.env.NEXT_PUBLIC_VISIT_API ||
        (process.env.NODE_ENV === "development"
          ? "http://localhost:3000/api/visit"
          : "/loaple/visit");
      axios
        .get(url)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return (
    <div
      className={`hideScroll ${className}`}
      tabIndex={router.asPath === "/" ? 0 : undefined}
      onKeyDown={onKeyDown}
    >
      {children}
    </div>
  );
};

export default Page;
