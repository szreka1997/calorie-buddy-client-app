import { View, StyleSheet } from "react-native";

import COLORS from "../../constants/colorConstants";
import MacroPercentagesPanel from "./MacroPercentagesPanel";

function MacrosPieChartExplanatoryTexts({ protein, carbs, fat, style }) {
  const sum = carbs + protein + fat;

  return (
    <View style={[styles.container, style]}>
      {/* PROTEIN */}
      <MacroPercentagesPanel
        label="Protein"
        amount={protein}
        color={COLORS.PROTEIN_500}
        sum={sum}
      />

      {/* CARBS */}
      <MacroPercentagesPanel
        label="Carbs"
        amount={carbs}
        color={COLORS.CARBS_500}
        sum={sum}
      />

      {/* FAT */}
      <MacroPercentagesPanel
        label="Fat"
        amount={fat}
        color={COLORS.FAT_500}
        sum={sum}
      />
    </View>
  );
}

export default MacrosPieChartExplanatoryTexts;

const styles = StyleSheet.create({
  container: {
    marginRight: 12,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
