import { useEffect, useState } from "react";

export default function useWindowSize() {
    const [hexPerLines, setHexPerLines] = useState<number>(0);
  
    useEffect(() => {
        // windowSize state 설정 함수
        function handleResize() {
            setHexPerLines(Math.floor((window.innerWidth-100) / 180));
        }
        
        // 리사이즈 이벤트 핸들러 - 너비 변화 확인
        window.addEventListener("resize", handleResize);
        
        // 초기화
        handleResize();
        
        // unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return hexPerLines;
}