import { View, TextInput, StyleSheet } from "react-native";

import COLORS from "../../constants/colorConstants";
import CustomText from "../UI/CustomText";
import DeleteTextButton from "../UI/custom-buttons/DeleteTextButton";
import useInput from "../../hooks/UI/useInput";
import { getDynamicColors } from "../../utils/colorUtils";

function Input({
  label,
  value,
  errorMessage,
  textInputConfig,
  onBlur,
  onChange,
  isLogin = false,
  isTouched = false,
  accent = false,
}) {
  const colors = getDynamicColors(accent);
  const focusCondition = !errorMessage && (!isTouched || isLogin);
  const blurConditon = isLogin && !errorMessage;

  const {
    borderColor,
    labelColor,
    inputTextColor,
    cursorColor,
    selectionColor,
    isFocused,
    focusHandler,
    blurHandler,
    changeTextHandler,
  } = useInput({
    colors,
    errorMessage,
    focusCondition,
    blurConditon,
    shouldUseGreenBorder: !isLogin,
    isTouched,
    accent,
    onChange,
    onBlur,
  });

  return (
    <View>
      {/* LABEL */}
      <CustomText style={{ color: labelColor }}>{label}</CustomText>

      {/* INPUT CONTAINER*/}
      <View style={[styles.textInputContainer, { borderColor }]}>
        {/* INPUT */}
        <TextInput
          {...textInputConfig}
          value={value}
          cursorColor={cursorColor}
          selectionColor={selectionColor}
          allowFontScaling={false}
          onFocus={focusHandler}
          onBlur={blurHandler}
          onChangeText={changeTextHandler}
          style={[styles.textInput, { color: inputTextColor }]}
        />

        {/* DELETE TEXT BUTTON */}
        <DeleteTextButton
          isVisible={!!value && isFocused}
          accent={accent}
          onDelete={changeTextHandler.bind(this, "")}
        />
      </View>

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <CustomText style={styles.labelInvalid}>{errorMessage}</CustomText>
      )}
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  textInputContainer: {
    marginTop: 4,
    height: 50,
    minWidth: 250,
    flexDirection: "row",
    borderRadius: 4,
    borderWidth: 2,
  },
  textInput: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    flex: 1,
    fontSize: 16,
  },
  labelInvalid: {
    color: COLORS.ERROR_500,
  },
});
