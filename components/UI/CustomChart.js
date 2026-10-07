import { View, StyleSheet } from "react-native";
import { ProgressChart } from "react-native-chart-kit";

import CustomText from "./CustomText";
import { getCustomChartData } from "../../utils/helperFunctions";

function CustomChart({
  actualAmount,
  totalAmount,
  amountName,
  accent = false,
}) {
  const { data, chartConfig } = getCustomChartData({
    actualAmount,
    totalAmount,
    accent,
  });

  return (
    <View style={styles.container}>
      {/* CHART */}
      <ProgressChart
        data={data}
        width={150}
        height={150}
        strokeWidth={16}
        radius={50}
        hideLegend={true}
        chartConfig={chartConfig}
      />

      {/* ABSOLUTE TEXT */}
      <View style={[styles.textContainer, styles.container]}>
        <CustomText isHighlight accent={accent} style={styles.text}>
          {actualAmount} / {totalAmount}
          {amountName}
        </CustomText>
      </View>
    </View>
  );
}

export default CustomChart;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    position: "absolute",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
  },
});
