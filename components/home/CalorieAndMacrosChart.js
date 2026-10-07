import { View, StyleSheet } from "react-native";

import MacroChart from "./MacroChart";
import { getCaloriesAndMacrosChartData } from "../../utils/homeUtils";

function CalorieAndMacrosChart({
  consumedKcal,
  consumedProtein,
  consumedCarbs,
  consumedFat,
  maxKcal,
  maxProtein,
  maxCarbs,
  maxFat,
  accent = false,
}) {
  const chartConfigs = getCaloriesAndMacrosChartData({
    consumedKcal,
    consumedProtein,
    consumedCarbs,
    consumedFat,
    maxKcal,
    maxProtein,
    maxCarbs,
    maxFat,
    accent,
  });

  return (
    <View>
      {chartConfigs.map((chart, index) => (
        <View key={chart.key} style={index !== 0 && styles.absoluteContainer}>
          <MacroChart
            data={chart.data}
            color={chart.color}
            radius={chart.radius}
          />
        </View>
      ))}
    </View>
  );
}

export default CalorieAndMacrosChart;

const styles = StyleSheet.create({
  absoluteContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
