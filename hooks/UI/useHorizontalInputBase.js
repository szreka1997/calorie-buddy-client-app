import { useRef, useState } from "react";

function useHorizontalInputBase({ onFocus, onBlur }) {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const inputRef = useRef(null);
  const inputContainerRef = useRef(null);

  function focusHandler(e) {
    setIsFocused(true);
    onFocus?.(e);
  }

  function blurHandler(e) {
    setIsFocused(false);
    onBlur?.(e);
  }

  return {
    inputRef,
    inputContainerRef,
    isFocused,
    isTouched,
    setIsFocused,
    setIsTouched,
    focusHandler,
    blurHandler,
  };
}

export default useHorizontalInputBase;
