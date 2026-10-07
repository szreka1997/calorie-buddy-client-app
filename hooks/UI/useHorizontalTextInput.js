import { useImperativeHandle } from "react";

import useHorizontalInputBase from "./useHorizontalInputBase";

function useHorizontalTextInput({ ref, onBlur }) {
  const base = useHorizontalInputBase({ onBlur });

  function pressHandler() {
    base.setIsTouched(true);
    base.setIsFocused(true);
    base.inputRef.current?.focus();
  }

  useImperativeHandle(
    ref,
    () => ({
      blur() {
        base.inputRef.current?.blur();
        base.inputContainerRef.current?.blur();
      },
      focus() {
        pressHandler();
      },
      measure(x, y, width, height, pageX, pageY) {
        base.inputRef.current?.measure(x, y, width, height, pageX, pageY);
      },
      isFocused: base.isFocused,
    }),
    [base.isFocused],
  );

  return {
    ...base,
    pressHandler,
  };
}

export default useHorizontalTextInput;
