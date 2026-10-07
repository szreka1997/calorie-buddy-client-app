import { StyleSheet } from "react-native";

import Card from "../UI/Card";
import MacrosPieChart from "./MacrosPieChart";
import MacrosPieChartExplanatoryTexts from "./MacrosPieChartExplanatoryTexts";

function MacrosChartCard({
  calories,
  protein,
  carbs,
  fat,
  style,
  accent = false,
}) {
  const sum = protein + carbs + fat;
  if (sum === 0) return;

  return (
    <Card style={[styles.card, style]}>
      {/* CHART */}
      <MacrosPieChart
        calories={calories}
        protein={protein}
        carbs={carbs}
        fat={fat}
        accent={accent}
      />

      {/* EXPLANATORY TEXTS */}
      <MacrosPieChartExplanatoryTexts
        protein={protein}
        carbs={carbs}
        fat={fat}
      />
    </Card>
  );
}

export default MacrosChartCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
