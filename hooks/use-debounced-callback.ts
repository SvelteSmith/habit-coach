import { useRef, useEffect, useMemo } from "react";

export interface CallOptions {
  /**
   * Controls if the function should be invoked on the leading edge of the timeout.
   */
  leading?: boolean;
  /**
   * Controls if the function should be invoked on the trailing edge of the timeout.
   */
  trailing?: boolean;
}

export interface Options extends CallOptions {
  /**
   * The maximum time the given function is allowed to be delayed before it's invoked.
   */
  maxWait?: number;
  /**
   * If the setting is set to true, all debouncing and timers will happen on the server side as well
   */
  debounceOnServer?: boolean;
}

export interface ControlFunctions<ReturnT> {
  /**
   * Cancel pending function invocations
   */
  cancel: () => void;
  /**
   * Immediately invoke pending function invocations
   */
  flush: () => ReturnT | undefined;
  /**
   * Returns `true` if there are any pending function invocations
   */
  isPending: () => boolean;
}

/**
 * Subsequent calls to the debounced function return the result of the last func invocation.
 * Note, that if there are no previous invocations you will get undefined. You should check it in your code properly.
 */
export interface DebouncedState<T extends (...args: any) => ReturnType<T>>
  extends ControlFunctions<ReturnType<T>> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
}

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked, or until the next browser frame is drawn.
 */
export default function useDebouncedCallback<T extends (...args: any) => ReturnType<T>>(
  func: T,
  wait?: number,
  options?: Options
): DebouncedState<T> {
  const lastCallTime = useRef(null);
  const lastInvokeTime = useRef(0);
  const timerId = useRef(null);
  const lastArgs = useRef<unknown[]>([]);
  const lastThis = useRef<unknown>();
  const result = useRef<ReturnType<T>>();
  const funcRef = useRef(func);
  const mounted = useRef(true);
  
  funcRef.current = func;

  const isClientSide = typeof window !== "undefined";
  const useRAF = !wait && wait !== 0 && isClientSide;

  if (typeof func !== "function") {
    throw new TypeError("Expected a function");
  }

  wait = +wait || 0;
  options = options || {};

  const leading = !!options.leading;
  const trailing = "trailing" in options ? !!options.trailing : true;
  const maxing = "maxWait" in options;
  const debounceOnServer = "debounceOnServer" in options ? !!options.debounceOnServer : false;
  const maxWait = maxing ? Math.max(+options.maxWait || 0, wait) : null;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const debounced = useMemo(() => {
    const invokeFunc = (time: number) => {
      const args = lastArgs.current;
      const thisArg = lastThis.current;

      lastArgs.current = lastThis.current = null;
      lastInvokeTime.current = time;
      return (result.current = funcRef.current.apply(thisArg, args));
    };

    const startTimer = (pendingFunc: () => void, wait: number) => {
      if (useRAF) cancelAnimationFrame(timerId.current);
      timerId.current = useRAF ? requestAnimationFrame(pendingFunc) : setTimeout(pendingFunc, wait);
    };

    const shouldInvoke = (time: number) => {
      if (!mounted.current) return false;

      const timeSinceLastCall = time - lastCallTime.current;
      const timeSinceLastInvoke = time - lastInvokeTime.current;

      return (
        !lastCallTime.current ||
        timeSinceLastCall >= wait ||
        timeSinceLastCall < 0 ||
        (maxing && timeSinceLastInvoke >= maxWait)
      );
    };

    const trailingEdge = (time: number) => {
      timerId.current = null;

      if (trailing && lastArgs.current) {
        return invokeFunc(time);
      }
      lastArgs.current = lastThis.current = null;
      return result.current;
    };

    const timerExpired = () => {
      const time = Date.now();
      if (shouldInvoke(time)) {
        return trailingEdge(time);
      }
      
      if (!mounted.current) {
        return;
      }
      
      const timeSinceLastCall = time - lastCallTime.current;
      const timeSinceLastInvoke = time - lastInvokeTime.current;
      const timeWaiting = wait - timeSinceLastCall;
      const remainingWait = maxing
        ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
        : timeWaiting;

      startTimer(timerExpired, remainingWait);
    };

    const func: DebouncedState<T> = (...args: Parameters<T>): ReturnType<T> => {
      if (!isClientSide && !debounceOnServer) {
        return;
      }
      const time = Date.now();
      const isInvoking = shouldInvoke(time);

      lastArgs.current = args;
      lastThis.current = this;
      lastCallTime.current = time;

      if (isInvoking) {
        if (!timerId.current && mounted.current) {
          lastInvokeTime.current = lastCallTime.current;
          startTimer(timerExpired, wait);
          return leading ? invokeFunc(lastCallTime.current) : result.current;
        }
        if (maxing) {
          startTimer(timerExpired, wait);
          return invokeFunc(lastCallTime.current);
        }
      }
      if (!timerId.current) {
        startTimer(timerExpired, wait);
      }
      return result.current;
    };

    func.cancel = () => {
      if (timerId.current) {
        useRAF ? cancelAnimationFrame(timerId.current) : clearTimeout(timerId.current);
      }
      lastInvokeTime.current = 0;
      lastArgs.current = lastCallTime.current = lastThis.current = timerId.current = null;
    };

    func.isPending = () => {
      return !!timerId.current;
    };

    func.flush = () => {
      return !timerId.current ? result.current : trailingEdge(Date.now());
    };

    return func;
  }, [leading, maxing, wait, maxWait, trailing, useRAF, isClientSide, debounceOnServer]);

  return debounced;
}