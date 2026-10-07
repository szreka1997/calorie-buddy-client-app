import { StyleSheet, View } from "react-native";
import { ProgressChart } from "react-native-chart-kit";

import CustomText from "../UI/CustomText";
import {
  calculateProgressRemaining,
  getWeightProggressChartData,
} from "../../utils/goalUtils";

function WeightProgressChart({ startingWeight, goalWeight, currentWeight }) {
  const { data, chartConfig } = getWeightProggressChartData({
    startingWeight,
    goalWeight,
    currentWeight,
  });

  return (
    <View style={styles.container}>
      {/* CHART */}
      <ProgressChart
        data={[data]}
        width={150}
        height={150}
        strokeWidth={16}
        radius={50}
        hideLegend={true}
        chartConfig={chartConfig}
      />

      {/* CHART TEXT */}
      <View style={styles.chartTextContainer}>
        <CustomText isHighlight accent style={styles.chartText}>
          {calculateProgressRemaining(currentWeight, goalWeight).toFixed(1)} kg
        </CustomText>
        <CustomText accent isHighlight style={styles.chartSubtext}>
          Remaining
        </CustomText>
      </View>
    </View>
  );
}

export default WeightProgressChart;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  chartTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  chartText: {
    fontSize: 22,
  },
  chartSubtext: {
    fontSize: 12,
  },
});
