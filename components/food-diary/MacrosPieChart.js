import { View, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";

import COLORS from "../../constants/colorConstants";
import CustomText from "../UI/CustomText";
import { getMacrosPieChartData } from "../../utils/foodDiaryUtils";

function MacrosPieChart({
  calories,
  protein,
  carbs,
  fat,
  style,
  accent = false,
}) {
  const { data, chartConfig } = getMacrosPieChartData({ protein, carbs, fat });

  return (
    <View style={style}>
      {/* PIE CHART */}
      <PieChart
        data={data}
        width={150}
        height={150}
        center={[38, 0]}
        backgroundColor={"transparent"}
        accessor={"population"}
        chartConfig={chartConfig}
        hasLegend={false}
      />

      {/* CHART TEXT */}
      <View style={styles.chartTextContainer}>
        <View style={styles.chartTextInnerContainer}>
          <CustomText isHighlight accent={!accent} style={styles.chartText}>
            {calories}
          </CustomText>
          <CustomText accent={accent} style={styles.chartSubtext}>
            kcal
          </CustomText>
        </View>
      </View>
    </View>
  );
}

export default MacrosPieChart;

const styles = StyleSheet.create({
  chartTextContainer: {
    height: 150,
    width: 150,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  chartTextInnerContainer: {
    height: 90,
    width: 90,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.PRIMARY_900,
    borderRadius: 45,
  },
  chartText: {
    fontSize: 22,
  },
  chartSubtext: {
    fontSize: 12,
  },
});
