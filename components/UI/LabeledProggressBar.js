import { StyleSheet, View } from "react-native";
import { ProgressBar } from "react-native-paper";

import CustomText from "./CustomText";

function LabeledProgressBar({
  label,
  progress,
  color,
  labelColor,
  height = 22,
  fontSize = 12,
  backgroundColor = "transparent",
}) {
  return (
    <View style={{ height }}>
      {/* PROGRESS BAR */}
      <ProgressBar
        progress={progress}
        color={color}
        style={[styles.progressBar, { borderColor: color, backgroundColor }]}
      />

      {/* LAABEL */}
      <View style={styles.labelContainer}>
        <CustomText style={[styles.label, { color: labelColor, fontSize }]}>
          {label}
        </CustomText>
      </View>
    </View>
  );
}

export default LabeledProgressBar;

const styles = StyleSheet.create({
  progressBar: {
    height: "100%",
    width: "100%",
    borderRadius: 5,
    borderWidth: 1,
  },
  labelContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  label: {
    textAlign: "center",
  },
});
