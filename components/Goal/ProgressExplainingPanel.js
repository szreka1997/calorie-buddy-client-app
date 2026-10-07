import { StyleSheet, View } from "react-native";

import ChartExplainingText from "../../components/UI/ChartExplainingText";
import { GOALS } from "../../constants/commonConstants";
import {
  getProgressTotalGoalLabelName,
  calculateTotalLost,
} from "../../utils/goalUtils";

function ProgressExplainingPanel({
  startingWeight,
  goalWeight,
  currentWeight,
  plan,
}) {
  return (
    <View style={styles.container}>
      {/* STARTING WEIGHT */}
      <ChartExplainingText
        label="Starting weight: "
        value={`${startingWeight} kg`}
        icon="scale"
      />

      {/* GOAL WEIGHT */}
      <ChartExplainingText
        label="Goal weight: "
        value={`${goalWeight} kg`}
        icon="flag"
      />

      {/* TOTAL LOST / GAIN */}
      <ChartExplainingText
        label={getProgressTotalGoalLabelName({
          startingWeight,
          goalWeight,
          plan,
        })}
        value={`${calculateTotalLost(
          startingWeight,
          goalWeight,
          currentWeight,
          plan.plan === GOALS.GAIN,
        ).toFixed(1)} kg`}
        icon="stats-chart"
      />

      {/* CURRENT WEIGHT */}
      <ChartExplainingText
        label="Current weight: "
        value={`${currentWeight} kg`}
        icon="flash"
      />
    </View>
  );
}

export default ProgressExplainingPanel;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
});
