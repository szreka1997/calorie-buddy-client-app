import { useRef } from "react";
import { Dimensions } from "react-native";

import { calculateCenterOffset, handleScrollY } from "../../utils/scrollUtils";

function useFormScrollAndBlur(inputRefs) {
  const scrollViewRef = useRef(null);
  const scrollY = useRef(0);

  const { height: screenHeight } = Dimensions.get("screen");

  function blurTextInputs() {
    Object.values(inputRefs).forEach((ref) => {
      if (ref.current?.isFocused) ref.current.blur();
    });
  }

  function inputSubmitHandler(inputRef) {
    inputRef.current.focus();
    inputRef.current.measure((x, y, width, height, pageX, pageY) => {
      const centerOffset = calculateCenterOffset(
        scrollY.current,
        pageY,
        screenHeight,
      );
      scrollViewRef.current.scrollTo({
        x: 0,
        y: centerOffset,
        animated: true,
      });
    });
  }

  function scrollHandle(event) {
    scrollY.current = handleScrollY(event);
  }

  return {
    scrollViewRef,
    blurTextInputs,
    inputSubmitHandler,
    scrollHandle,
  };
}

export default useFormScrollAndBlur;
