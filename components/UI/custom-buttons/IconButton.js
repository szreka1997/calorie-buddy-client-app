import { View, Pressable, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  getPressedStyle,
  getIconButtonInnerContainerStyle,
} from "../../../utils/styleUtils";
import { getDynamicColors } from "../../../utils/colorUtils";

function IconButton({
  icon,
  iconSize,
  style,
  onPress,
  onPressOut,
  borderWidth = 0,
  shouldAndroidRipple = false,
  useBackgroundColor = false,
  accent = false,
}) {
  const colors = getDynamicColors(accent);
  const pressedStyle = getPressedStyle(
    Platform.OS === "android",
    shouldAndroidRipple,
  );
  const innerContainerStyle = getIconButtonInnerContainerStyle(
    borderWidth,
    useBackgroundColor,
    accent,
  );

  return (
    <View style={[styles.outerContrainer, style]}>
      <Pressable
        {...(shouldAndroidRipple && {
          android_ripple: { color: colors.shade50, foreground: true },
        })}
        style={({ pressed }) => pressed && pressedStyle}
        onPress={onPress}
        onPressOut={onPressOut}
      >
        <View style={[styles.innerContainer, innerContainerStyle]}>
          <Ionicons name={icon} color={colors.shade500} size={iconSize} />
        </View>
      </Pressable>
    </View>
  );
}

export default IconButton;

const styles = StyleSheet.create({
  outerContrainer: {
    height: 50,
    width: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  innerContainer: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
});
