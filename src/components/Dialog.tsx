import * as React from "jsx-dom";
import type { ReactElement } from "jsx-dom";
import { useMemoFn } from "../utils/dom";

export const useDialog = (content: () => ReactElement) => {
  const getDialog = useMemoFn(() => {
    const onClick = hide;
    return (
      <div class="fixed z-[100] top-0 left-0 w-full h-full flex items-center justify-center">
        <div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50" onClick={onClick}></div>
        <div class="min-w-[200px] min-h-[200px] z-[2] rounded bg-white">{content()}</div>
      </div>
    );
  });
  const show = () => {
    const dialog = getDialog();
    document.body.appendChild(dialog);
  };
  const hide = () => {
    const dialog = getDialog();
    dialog.parentElement?.removeChild(dialog);
  };
  return {
    show,
    hide,
  };
};
