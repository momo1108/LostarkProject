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
      html = html.toUpperCase();
      html = html.replace(/['"]/g, `"`);
      html = html.replace(/FONT/g, "span");
      html = html.replace(/P/g, "p");
      html = html.replace(/ALIGN="/g, "style='text-align:");
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
      return parse(html);
    },
    []
  );
  parseApiDataToHtmlString(
    "<font size='14'><font color='#91fe02'>갈망</font></font>"
  );
  return { parseApiDataToHtmlString };
}

export default useApiTagParser;
