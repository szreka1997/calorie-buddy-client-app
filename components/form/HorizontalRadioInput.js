import { StyleSheet } from "react-native";

import CustomText from "../UI/CustomText";
import HorizontalInputContainer from "../form/HorizontalInputContainer";
import useHorizontalRadioInput from "../../hooks/UI/useHorizontalRadioInput";
import useInputStyles from "../../hooks/UI/useInputStyles";
import { getHorizontalInputValueTextColor } from "../../utils/colorUtils";

function HorizontalRadioInput({
  label,
  value,
  placeholderText,
  errorMessage,
  radioConfig,
  onFocus,
  onBlur,
  onChange,
  isTouched = false,
  accent = false,
}) {
  const inputTextColor = getHorizontalInputValueTextColor(value, false, accent);

  const {
    inputContainerRef,
    isFocused,
    pressHandler,
    focusHandler,
    blurHandler,
  } = useHorizontalRadioInput({
    label,
    value,
    radioConfig,
    accent: !accent,
    onFocus,
    onBlur,
    onChange,
  });

  const { labelColor, borderColor, setBorderColor } = useInputStyles({
    isFocused,
    isTouched,
    errorMessage,
    accent,
    shouldUse800ShadeAsBorder: true,
  });

  return (
    <HorizontalInputContainer
      ref={inputContainerRef}
      label={label}
      errorMessage={errorMessage}
      accent={accent}
      labelColor={labelColor}
      borderColor={borderColor}
      setBorderColor={setBorderColor}
      onFocus={focusHandler}
      onPress={pressHandler}
      onBlur={blurHandler}
    >
      <CustomText isHighlight style={[styles.text, { color: inputTextColor }]}>
        {value || placeholderText}
      </CustomText>
    </HorizontalInputContainer>
  );
}

export default HorizontalRadioInput;

const styles = StyleSheet.create({
  text: {
    marginHorizontal: 12,
  },
});
