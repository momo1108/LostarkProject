import { useCallback } from "react";
import parse, { domToReact } from "html-react-parser";

function useApiTagParser() {
  const stylePatterns = {
    fontSize: /style='font-size:[0-9]+"/g,
    color: /style='color:#[0-9A-Za-z]+"/g,
    textAlign: /style='text-align:[A-Z]+"/g,
  };
  const parseApiDataToHtmlString = useCallback(
    (html: string): ReturnType<typeof domToReact> => {
      let checker: string = html;
      html = html.toUpperCase();

      // 아바타 성향 관련 전처리
      if (html.startsWith("|")) html = html.slice(1);
      html = html.replace(/&TDC_SMART|&TDC_COURAGE|&TDC_CHARM|&TDC_KIND/g, "");
      html = html.trim();

      html = html.replace(/['"]/g, `"`);
      html = html.replace(/FONT/g, "span");
      html = html.replace(/P/g, "p");
      html = html.replace(/ALIGN="/g, "style='text-align:");
      html = html.replace(/COLOR=""/g, "");
      html = html.replace(/COLOR="/g, "style='color:");
      html = html.replace(/SIZE="/g, "style='font-size:");
      let ex = stylePatterns.fontSize.exec(html);
      while (ex) {
        html =
          html.substring(0, ex.index + ex[0].length - 1) +
          "px;'" +
          html.substring(ex.index + ex[0].length);
        ex = stylePatterns.fontSize.exec(html);
      }

      ex = stylePatterns.color.exec(html);
      while (ex) {
        html =
          html.substring(0, ex.index + ex[0].length - 1) +
          ";'" +
          html.substring(ex.index + ex[0].length);
        ex = stylePatterns.color.exec(html);
      }

      ex = stylePatterns.textAlign.exec(html);
      while (ex) {
        html =
          html.substring(0, ex.index + ex[0].length - 1) +
          ";'" +
          html.substring(ex.index + ex[0].length);
        ex = stylePatterns.textAlign.exec(html);
      }

      html = html.toLowerCase();
      html = html.replace(
        /src="[a-zA-z]+locked"/g,
        `src="https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/ico_tooltip_locked.png" style="display:inline-block;"`
      );
      html = html.replace(
        /src="[a-zA-z]+changeable"/g,
        `src="https://cdn-lostark.game.onstove.com/2018/obt/assets/images/common/game/ico_tooltip_changeable.png" style="display:inline-block;"`
      );
      // FONT태그에 스타일 2개인 경우
      html = html.replace(/;'\sstyle='/g, "; ");
      if (checker === "fefbweiufbwaueifbawiufb") {
        console.log(checker);
        console.log(html);
      }
      return parse(html);
    },
    []
  );
  const parseEngravingPoint = useCallback(
    (html: string): ReturnType<typeof domToReact> => {
      const point: number = parseInt(html.replace(/<[^>]+>/g, "").slice(11));
      const color: string =
        point >= 12
          ? "#fe9600"
          : point >= 9
          ? "#ce43fc"
          : point >= 6
          ? "#00b5ff"
          : "#61ce02";

      return parse(`<span style="color:${color};">+${point}</span>`);
    },
    []
  );
  const parseGemName = useCallback((html: string): [string, number] => {
    const info: string[] = html.replace(/<[^>]+>/g, "").split(" ");
    return [
      info[0].slice(0, info[0].length - 2) + info[1][0],
      info[1][0] === "멸" ? 0 : 1,
    ];
  }, []);
  const parseSkillPoint = useCallback(
    (point: number): ReturnType<typeof domToReact> => {
      const color: string =
        point >= 10 ? "#fe9600" : point >= 7 ? "#ce43fc" : "#00b5ff";

      return parse(
        `<span style="color:${color}; font-weight:800; font-size:13px;">${point}</span>`
      );
    },
    []
  );
  return {
    parseApiDataToHtmlString,
    parseEngravingPoint,
    parseGemName,
    parseSkillPoint,
  };
}

export default useApiTagParser;
