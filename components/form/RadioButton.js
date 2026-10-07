import { Pressable, StyleSheet, View } from "react-native";

import GLOBAL_STYLES from "../../constants/styleConstants";
import CustomText from "../UI/CustomText";
import { getDynamicColors } from "../../utils/colorUtils";

function RadioButton({
  label,
  value,
  details,
  checkedValue,
  onChange,
  accent = false,
}) {
  const colors = getDynamicColors(accent);
  const isSelected = checkedValue === value;
  const borderColor = isSelected ? colors.shade200 : colors.shade800;

  return (
    <View style={[styles.outerContainer, { borderColor }]}>
      <Pressable
        onPress={() => {
          onChange(value);
        }}
        android_ripple={{ color: colors.shade50, foreground: true }}
        style={({ pressed }) => pressed && GLOBAL_STYLES.pressed}
      >
        <View style={styles.innerContainer}>
          {/* LABEL */}
          <CustomText accent={accent} style={styles.labelText}>
            {label}
          </CustomText>

          {/* DETAILS TEXT */}
          {details && (
            <CustomText
              style={[styles.detailsText, { color: colors.shade700 }]}
            >
              {details}
            </CustomText>
          )}
        </View>
      </Pressable>
    </View>
  );
}

export default RadioButton;

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 8,
    borderRadius: 15,
    borderWidth: 1,
    overflow: "hidden",
  },
  innerContainer: {
    paddingVertical: 12,
    justifyContent: "center",
    borderRadius: 15,
  },
  labelText: {
    textAlign: "center",
    fontWeight: "bold",
  },
  detailsText: {
    marginHorizontal: 12,
    textAlign: "center",
    fontSize: 12,
  },
});
