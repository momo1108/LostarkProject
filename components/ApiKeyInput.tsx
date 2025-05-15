import { useEffect, useRef, useState } from "react";
import { MenuIcons, Edit, Check, Info } from "@/components/icons/Index";
import Link from "next/link";
import { ApiKeyInputProps } from "@/types/CustomType";
import MyInput from "./custom/MyInput";
import {
  useApiKeyActionContext,
  useApiKeySelectorContext,
  useApiKeyStaticContext,
} from "@/contexts/ApiKeyContext";

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ isShining }) => {
  const { apiKey } = useApiKeySelectorContext();
  const { setApiKey } = useApiKeyActionContext();
  const { apiKeyRef } = useApiKeyStaticContext();
  const [editApiKey, setEditApiKey] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClickRegister = () => {
    setApiKey(inputRef!.current!.value);
    setEditApiKey(false);
    localStorage.setItem("loapleApiKey", inputRef!.current!.value);
  };
  const handleClickEdit = () => {
    inputRef!.current!.value = apiKey;
    setEditApiKey(true);
  };
  const handleClickCancel = () => {
    inputRef!.current!.value = apiKeyRef.current;
    setEditApiKey(false);
  };

  return (
    <>
      <div
        className={`${editApiKey ? "apiDiv" : "hidden"}${
          isShining ? " shinyShadow" : ""
        }`}
      >
        <MyInput placeholder="API 키 입력" ref={inputRef} />
        <div className="flex gap-1 items-center">
          <button className="myButtons" onClick={handleClickRegister}>
            <Check size={16} color="#fff" />
          </button>
          <button className="myButtons" onClick={handleClickCancel}>
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
          <button className="myButtons" data-px="2" onClick={handleClickEdit}>
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
