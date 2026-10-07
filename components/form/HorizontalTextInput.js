import { TextInput, StyleSheet } from "react-native";

import HorizontalInputContainer from "../form/HorizontalInputContainer";
import useHorizontalTextInput from "../../hooks/UI/useHorizontalTextInput";
import useInputStyles from "../../hooks/UI/useInputStyles";
import { getHorizontalInputValueTextColor } from "../../utils/colorUtils";

function HorizontalTextInput({
  ref,
  label,
  value,
  placeholderText,
  errorMessage,
  textInputConfig,
  onBlur,
  onChange,
  onSubmitEditing,
  submitBehavior = "blurAndSubmit",
  enterKeyHint = "done",
  isTouched = false,
  accent = false,
}) {
  const placeholderTextColor = getHorizontalInputValueTextColor(
    null,
    false,
    accent,
  );

  const {
    inputRef,
    inputContainerRef,
    isFocused,
    pressHandler,
    focusHandler,
    blurHandler,
  } = useHorizontalTextInput({ ref, onBlur });

  const {
    labelColor,
    inputTextColor,
    cursorColor,
    selectionColor,
    borderColor,
    setBorderColor,
  } = useInputStyles({
    isFocused,
    isTouched,
    errorMessage,
    accent,
    shouldUse800ShadeAsBorder: true,
  });

  return (
    <>
      <HorizontalInputContainer
        ref={inputContainerRef}
        label={label}
        errorMessage={errorMessage}
        accent={accent}
        labelColor={labelColor}
        borderColor={borderColor}
        setBorderColor={(value) => setBorderColor(value)}
        onPress={pressHandler}
        onFocus={focusHandler}
        onBlur={blurHandler}
      >
        <TextInput
          {...textInputConfig}
          ref={inputRef}
          value={value}
          placeholder={placeholderText}
          placeholderTextColor={placeholderTextColor}
          cursorColor={cursorColor}
          selectionColor={selectionColor}
          allowFontScaling={false}
          submitBehavior={submitBehavior}
          enterKeyHint={enterKeyHint}
          onFocus={() => inputContainerRef.current.focus()}
          onBlur={() => inputContainerRef.current.blur()}
          onChangeText={onChange}
          onSubmitEditing={onSubmitEditing}
          style={[styles.text, { color: inputTextColor }]}
        />
      </HorizontalInputContainer>
    </>
  );
}

export default HorizontalTextInput;

const styles = StyleSheet.create({
  text: {
    flexShrink: 1,
    marginHorizontal: 12,
    fontWeight: "bold",
  },
});
