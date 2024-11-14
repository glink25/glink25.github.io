export const useAttrRef = <Attr extends Record<string, any>>(attar: Attr) => {
  let ref: any;
  const setRef = (v: any) => {
    ref = v;
    set(attar);
  };
  const set = (v: Partial<Attr>) => {
    if (!ref) return;
    Object.entries({ ...attar, ...v }).forEach(([k, v]) => {
      if (v === false) {
        (ref as HTMLElement).removeAttribute(k);
        return;
      }
      (ref as HTMLElement)?.setAttribute(k, v);
    });
  };
  return [setRef, set] as const;
};

export const useMemoFn = <T>(fn: () => T) => {
  let memo: T | undefined;
  const run = () => {
    if (memo) return memo;
    memo = fn();
    return memo;
  };
  return run;
};

export const withCreated = <P extends any[], R extends any, F extends (...args: P) => R>(
  fn: (onCreated: (f: (v: R) => void) => void) => F
) => {
  const createdFns: any[] = [];
  const onCreated = (fn: any) => {
    createdFns.push(fn);
  };
  const runner = (...args: P) => {
    const f = fn(onCreated);
    const res = f(...args);
    createdFns.forEach((fn) => fn(res));
    return res;
  };
  return runner as F;
};
