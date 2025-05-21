/**
 * 지정한 시간 간격(`delay`) 동안 한 번만 실행되는 쓰로틀링 함수입니다.
 * 주어진 원본 함수(`func`)를 래핑하여, 빠르게 반복 호출되는 상황에서도
 * 일정 간격 이상으로만 실행되도록 제한합니다.
 *
 * @template F - 쓰로틀링할 함수(어떤 인자든 받고, void 를 return)의 타입입니다.
 * @param {F} func - 쓰로틀링할 원본 함수
 * @param {number} delay - 두 호출 사이 최소 대기 시간 (밀리초 단위)
 * @returns {F} 쓰로틀링된 함수. 원본 함수와 동일한 타입으로 반환됩니다.
 *
 * @example
 * ```ts
 * const throttledFn = throttle(() => console.log('실행됨!'), 1000);
 * window.addEventListener('scroll', throttledFn);
 * ```
 *
 * @remarks
 * - 이 함수는 **선 실행(leading edge)** 방식입니다. 즉, 호출 직후 한 번 실행되며,
 *   이후 `delay` 시간 동안은 무시됩니다.
 * - 내부적으로 `this`와 전달된 인자(`args`)를 유지하여 원래 함수와 동일한 컨텍스트에서 실행됩니다.
 * - 후행 실행(trailing edge)이 필요한 경우, 커스텀 구현이 필요합니다.
 */
export function throttle<F extends (...args: any[]) => void>(
  func: F,
  delay: number
): F {
  let lastCall = 0; // 클로저를 활용하여 내부 함수의 호출 타임스탬프를 기록합니다.

  return function (this: any, ...args: any[]) {
    // 함수의 호출 간격이 delay 보다 오래됐으면 함수를 실행합니다.
    const now = Date.now();
    console.log(now, lastCall);
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args); // 객체의 메서드를 고려해 this 를 바인딩하고 args 를 전달합니다.
    }
  } as F;
}
