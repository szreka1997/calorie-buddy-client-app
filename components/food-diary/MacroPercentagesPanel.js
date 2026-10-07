import { View, StyleSheet } from "react-native";

import CustomText from "../UI/CustomText";
import { calculatePercentage } from "../../utils/helperFunctions";

function MacroPercentagesPanel({ label, amount, sum, color }) {
  return (
    <View style={styles.container}>
      <CustomText
        isHighlight
        style={[styles.chartTitle, styles.text, { color }]}
      >
        {label}
      </CustomText>
      <CustomText style={[styles.text, { color }]}>
        {calculatePercentage(amount, sum)}%
      </CustomText>
      <CustomText style={[styles.text, { color }]}>
        {amount.toFixed(1)}g
      </CustomText>
    </View>
  );
}

export default MacroPercentagesPanel;

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-around",
  },
  chartTitle: {
    fontSize: 16,
  },
  text: {
    textAlign: "center",
  },
});
