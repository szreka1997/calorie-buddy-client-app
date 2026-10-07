import { View, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import GLOBAL_STYLES from "../../../constants/styleConstants";
import CustomText from "../CustomText";
import { getDynamicColors } from "../../../utils/colorUtils";

function OutlinedButton({
  children,
  icon,
  style,
  onPress,
  fontSize = 14,
  iconSize = 21,
  accent = false,
}) {
  const colors = getDynamicColors(accent);
  const textStyle = { marginLeft: icon ? 8 : 0 };

  return (
    <View style={[styles.outerContrainer, style]}>
      <Pressable
        android_ripple={{ color: colors.shade50, foreground: true }}
        style={({ pressed }) => pressed && GLOBAL_STYLES.pressed}
        onPress={onPress}
      >
        <View style={[styles.innerContainer, { borderColor: colors.shade500 }]}>
          {icon && (
            <Ionicons name={icon} color={colors.shade500} size={iconSize} />
          )}
          <CustomText
            accent={accent}
            style={[styles.text, textStyle, { fontSize }]}
          >
            {children}
          </CustomText>
        </View>
      </Pressable>
    </View>
  );
}

export default OutlinedButton;

const styles = StyleSheet.create({
  outerContrainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  innerContainer: {
    padding: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
  },
  text: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
