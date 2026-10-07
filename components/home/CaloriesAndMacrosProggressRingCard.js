import { StyleSheet } from "react-native";

import Card from "../UI/Card";
import CalorieAndMacrosChart from "./CalorieAndMacrosChart";
import CaloriesAndMacrosExplanatoryTexts from "./CaloriesAndMacrosExplanatoryTexts";

function CaloriesAndMacrosProggressRingCard({
  style,
  ...caloriesAndMacrosProps
}) {
  return (
    <Card style={[styles.chartContainer, style]}>
      {/* CHART */}
      <CalorieAndMacrosChart {...caloriesAndMacrosProps} />

      {/* EXPLANATORY TEXTS */}
      <CaloriesAndMacrosExplanatoryTexts {...caloriesAndMacrosProps} />
    </Card>
  );
}

export default CaloriesAndMacrosProggressRingCard;

const styles = StyleSheet.create({
  chartContainer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
