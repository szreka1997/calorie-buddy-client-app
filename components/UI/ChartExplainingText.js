import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import COLORS from "../../constants/colorConstants";
import CustomText from "./CustomText";

function ChartExplainingText({
  label,
  value,
  icon,
  iconColor,
  textColor,
  highlightColor,
  accent = false,
}) {
  const localIconColor =
    iconColor || (accent ? COLORS.PRIMARY_500 : COLORS.ACCENT_500);

  return (
    <View style={styles.container}>
      {/* ICON */}
      <Ionicons name={icon} size={20} color={localIconColor} />

      {/* TEXT */}
      <View style={styles.textContainer}>
        {/* LABEL */}
        <CustomText accent={accent} style={textColor && { color: textColor }}>
          {label}
        </CustomText>

        {/* HIGHLIGHT */}
        <CustomText
          accent={accent}
          isHighlight
          style={[
            styles.highlightText,
            highlightColor && { color: highlightColor },
          ]}
        >
          {value}
        </CustomText>
      </View>
    </View>
  );
}

export default ChartExplainingText;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  textContainer: {
    marginLeft: 4,
    flexDirection: "row",
  },
  highlightText: {
    fontSize: 16,
  },
});
