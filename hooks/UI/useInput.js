import { useState } from "react";

import useInputStyles from "./useInputStyles";

function useInput({
  colors,
  onChange,
  onBlur,
  errorMessage = "",
  isTouched = false,
  focusCondition = true,
  blurConditon = true,
  shouldUse800ShadeAsBorder = false,
  shouldUseGreenBorder = false,
  accent = false,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const {
    borderColor,
    setBorderColor,
    labelColor,
    inputTextColor,
    cursorColor,
    selectionColor,
  } = useInputStyles({
    isFocused,
    isTouched,
    errorMessage,
    shouldUse800ShadeAsBorder,
    shouldUseGreenBorder,
    accent,
  });

  function focusHandler() {
    setIsFocused(true);
    if (focusCondition) setBorderColor(colors.shade500);
  }

  function blurHandler() {
    if (blurConditon) {
      setBorderColor(
        shouldUse800ShadeAsBorder ? colors.shade800 : colors.shade900,
      );
    }

    setIsFocused(false);
    onBlur();
  }

  function changeTextHandler(text) {
    onChange(text);
  }

  return {
    isFocused,
    borderColor,
    labelColor,
    inputTextColor,
    cursorColor,
    selectionColor,
    focusHandler,
    blurHandler,
    changeTextHandler,
  };
}

export default useInput;
