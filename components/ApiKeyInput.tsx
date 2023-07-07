import { useEffect, useRef, useState } from "react";
import { MenuIcons, Edit, Check, Info } from "@/components/icons/Index";
import Link from "next/link";

const ApiKeyInput: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>("");
  const [editApiKey, setEditApiKey] = useState<boolean>(false);
  const apiKeyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const key = localStorage.getItem("loapleEngraveApiKey");
    if (key === null) localStorage.setItem("loapleEngraveApiKey", "");
    else setApiKey(key);
  }, []);

  return (
    <>
      <div className={editApiKey ? "apiDiv" : "hidden"} data-editing="true">
        <label>
          <input
            className={"apiKeyInput"}
            type="text"
            spellCheck="false"
            ref={apiKeyRef}
            required
          />
          <div className={"placeholder"}>API 키 입력</div>
        </label>
        <div className="flex gap-1 items-center">
          <button
            className="myButtons"
            onClick={() => {
              setApiKey(apiKeyRef!.current!.value);
              setEditApiKey(false);
              localStorage.setItem(
                "loapleEngraveApiKey",
                apiKeyRef!.current!.value
              );
            }}
          >
            <Check size={16} color="#fff" />
          </button>
          <button
            className="myButtons"
            onClick={() => {
              apiKeyRef!.current!.value = apiKey;
              setEditApiKey(false);
            }}
          >
            <MenuIcons type={3} color="#fff" size={16} />
          </button>
        </div>
      </div>
      <div className={editApiKey ? "hidden" : "apiDiv"}>
        <p className={"apiDescr"}>
          ★ 서비스 사용을 위해서 반드시 API Key를 등록해주세요.
        </p>
        <div className={"apiKeyDiv"} data-valid={apiKey ? "true" : "false"}>
          {apiKey ? apiKey : "API Key 가 없습니다."}
        </div>
        <div className="flex gap-1">
          <button
            className="myButtons"
            data-px="2"
            onClick={() => {
              apiKeyRef!.current!.value = apiKey;
              setEditApiKey(true);
            }}
          >
            <Edit size={16} />
            <span>{apiKey ? "재등록" : "등록"}</span>
          </button>
          <Link
            data-tooltip-id="apiKeySettingInfo"
            className="myButtons"
            target="_blank"
            href="/info/apikey"
            rel="noopener noreferrer"
          >
            <Info size={16} fill="#eee" />
            <span>등록방법</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default ApiKeyInput;
