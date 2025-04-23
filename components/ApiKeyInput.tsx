import { useEffect, useRef, useState } from "react";
import { MenuIcons, Edit, Check, Info } from "@/components/icons/Index";
import Link from "next/link";
import { ApiKeyInputProps } from "@/types/CustomType";
import MyInput from "./custom/MyInput";

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ isShining }) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [editApiKey, setEditApiKey] = useState<boolean>(false);
  const apiKeyRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const key = localStorage.getItem("loapleApiKey");
    if (key === null) localStorage.setItem("loapleApiKey", "");
    else setApiKey(key);
  }, []);

  return (
    <>
      <div
        className={`${editApiKey ? "apiDiv" : "hidden"}${
          isShining ? " shinyShadow" : ""
        }`}
      >
        <MyInput placeholder="API 키 입력" ref={apiKeyRef} />
        <div className="flex gap-1 items-center">
          <button
            className="myButtons"
            onClick={() => {
              setApiKey(apiKeyRef!.current!.value);
              setEditApiKey(false);
              localStorage.setItem("loapleApiKey", apiKeyRef!.current!.value);
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
      <div
        className={`${editApiKey ? "hidden" : "apiDiv"}${
          isShining ? " shinyShadow" : ""
        }`}
      >
        <p className={"apiDescr"} data-register={!!apiKey}>
          {apiKey
            ? "◎ API Key 등록 완료"
            : "★ 서비스 사용을 위해서 반드시 API Key를 등록해주세요"}
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
