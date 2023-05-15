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
  return { parseApiDataToHtmlString };
}

export default useApiTagParser;
