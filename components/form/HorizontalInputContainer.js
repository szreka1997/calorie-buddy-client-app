import { useImperativeHandle } from "react";
import { View, StyleSheet, Pressable } from "react-native";

import COLORS from "../../constants/colorConstants";
import GLOBAL_STYLES from "../../constants/styleConstants";
import CustomText from "../UI/CustomText";
import { getDynamicColors } from "../../utils/colorUtils";

function HorizontalInputContainer({
  ref,
  children,
  label,
  errorMessage,
  labelColor,
  borderColor,
  setBorderColor,
  onFocus,
  onPress,
  onBlur,
  accent = false,
}) {
  const colors = getDynamicColors(accent);

  function pressHandler() {
    onPress();
    focusHandler();
  }

  function focusHandler() {
    onFocus();
    if (!errorMessage) {
      setBorderColor(colors.shade500);
    }
  }

  function blurHandler() {
    if (!errorMessage) {
      setBorderColor(colors.shade800);
    }
    onBlur();
  }

  useImperativeHandle(
    ref,
    () => ({
      blur: blurHandler,
      focus: focusHandler,
    }),
    [pressHandler, focusHandler, blurHandler],
  );

  return (
    <>
      <View style={[styles.container, { borderColor }]}>
        <Pressable
          android_ripple={{ color: colors.shade50, foreground: true }}
          style={({ pressed }) => pressed && GLOBAL_STYLES.pressed}
          onPress={pressHandler}
        >
          <View style={styles.innerContainer}>
            <CustomText
              isHighlight
              style={[styles.text, { color: labelColor }]}
            >
              {label}
            </CustomText>
            {children}
          </View>
        </Pressable>
      </View>
      {errorMessage && (
        <CustomText style={styles.labelInvalid}>{errorMessage}</CustomText>
      )}
    </>
  );
}

export default HorizontalInputContainer;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 4,
    borderRadius: 8,
    minHeight: 50,
    maxHeight: 50,
    justifyContent: "center",
    overflow: "hidden",
    borderWidth: 1,
  },
  innerContainer: {
    marginVertical: 8,
    minHeight: 50,
    maxHeight: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    marginHorizontal: 12,
  },
  labelInvalid: {
    color: COLORS.ERROR_500,
  },
});
