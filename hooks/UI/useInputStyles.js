import { useEffect, useState } from "react";

import COLORS from "../../constants/colorConstants";
import { getDynamicColors } from "../../utils/colorUtils";

function useInputStyles({
  errorMessage,
  isFocused = false,
  isTouched = false,
  shouldUse800ShadeAsBorder = false,
  shouldUseGreenBorder = false,
  accent = false,
}) {
  const colors = getDynamicColors(accent);
  const inputTextColor = colors.shade500;
  const cursorColor = colors.shade700;
  const selectionColor = colors.shade800;

  const [borderColor, setBorderColor] = useState(
    shouldUse800ShadeAsBorder ? colors.shade800 : colors.shade900,
  );
  const [labelColor, setLabelColor] = useState(colors.shade50);

  // Correcting a wrong input gives us instant confirmation.
  useEffect(() => {
    if (errorMessage) {
      setBorderColor(COLORS.ERROR_500);
      setLabelColor(COLORS.ERROR_500);
    } else if (isTouched || borderColor === COLORS.ERROR_500) {
      setBorderColor(
        shouldUseGreenBorder
          ? COLORS.GOOD_500
          : isFocused
            ? colors.shade500
            : shouldUse800ShadeAsBorder
              ? colors.shade800
              : colors.shade900,
      );
      setLabelColor(colors.shade50);
    }
  }, [errorMessage, isTouched, isFocused]);

  return {
    borderColor,
    setBorderColor,
    labelColor,
    inputTextColor,
    cursorColor,
    selectionColor,
  };
}

export default useInputStyles;
