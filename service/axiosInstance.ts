import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export const lostarkApi = axios.create({
  baseURL: "https://developer-lostark.game.onstove.com/",
  headers: {
    Accept: "application/json",
  },
});

// 요청 인터셉터
lostarkApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 요청 전에 수행할 작업 (예: 로딩 상태 설정)
    console.log(`[Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error("[Request Error]", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터
lostarkApi.interceptors.response.use(
  (response: AxiosResponse) => {
    // 2xx 범위의 응답은 여기로 옵니다.
    return response;
  },
  (error: AxiosError) => {
    // 2xx 외의 범위의 응답은 여기로 옵니다.
    if (error.response) {
      // 서버가 응답했지만 에러 상태 코드 반환
      console.error(
        `[Response Error] Status: ${error.response.status}, URL: ${error.config?.url}`,
        error.response.data
      );

      // 상태 코드에 따른 커스텀 에러 처리
      switch (error.response.status) {
        case 401:
          // 인증 실패 처리 (예: 토큰 갱신)
          console.error("인증 실패: 유효하지 않은 API 키입니다.");
          error.message = "인증 실패: 유효하지 않은 API 키입니다.";
          break;
        case 429:
          // 요청 한도 초과
          console.error("요청 한도 초과: 1분 후에 다시 시도해주세요.");
          error.message = "요청 한도 초과: 1분 후에 다시 시도해주세요.";
          break;
        case 500:
          console.error("서버 내부 오류가 발생했습니다.");
          error.message = "서버 내부 오류가 발생했습니다.";
          break;
        default:
          console.error("알 수 없는 오류가 발생했습니다.");
          error.message = "알 수 없는 오류가 발생했습니다.";
      }
    } else if (error.request) {
      // 요청이 전송되었지만 응답을 받지 못한 경우
      console.error("서버로부터 응답을 받지 못했습니다.", error.request);
      error.message = "서버로부터 응답을 받지 못했습니다.";
    } else {
      // 요청 설정 중에 오류가 발생한 경우
      console.error("요청 설정 중 오류가 발생했습니다.", error.message);
      error.message = "요청 설정 중 오류가 발생했습니다.";
    }

    return Promise.reject(error);
  }
);
