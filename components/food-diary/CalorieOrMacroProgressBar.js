import { View, StyleSheet } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import LabeledProgressBar from "../UI/LabeledProggressBar";
import CustomText from "../UI/CustomText";
import {
  getFeedbackEmoticonName,
  calculateProgress,
} from "../../utils/foodDiaryUtils";

function CalorieOrMacroProgressBar({
  name,
  consumed,
  max,
  color,
  labelColor,
  style,
  isCalorie = false,
  isProtein = false,
}) {
  return (
    <View style={[!isCalorie && styles.macroContainer, style]}>
      {/* LABEL */}
      <View style={styles.labelContainer}>
        <CustomText isHighlight style={[styles.labelText, { color }]}>
          {name}:
        </CustomText>
        <View style={styles.iconContainer}>
          <FontAwesome5
            name={getFeedbackEmoticonName(consumed, max, isCalorie, isProtein)}
            size={14}
            color={color}
          />
        </View>
      </View>

      {/* PROGRESS BAR */}
      <LabeledProgressBar
        height={18}
        label={`${consumed} / ${max} g`}
        color={color}
        labelColor={labelColor}
        progress={calculateProgress(consumed, max, isCalorie)}
      />
    </View>
  );
}

export default CalorieOrMacroProgressBar;

const styles = StyleSheet.create({
  macroContainer: {
    flex: 1,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginLeft: 8,
  },
  labelText: {
    textAlign: "center",
    fontSize: 12,
  },
});
