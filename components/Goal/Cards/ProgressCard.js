import { StyleSheet, View } from "react-native";

import Card from "../../UI/Card";
import CardTitle from "../../UI/CardTitle";
import WeightProgressChart from "../WeightProgressChart";
import ProgressExplainingPanel from "../ProgressExplainingPanel";

function ProgressCard({
  startingWeight,
  goalWeight,
  currentWeight,
  plan,
  style,
}) {
  return (
    <Card style={style}>
      {/* TITLE */}
      <CardTitle>Progress</CardTitle>

      <View style={styles.innerContainer}>
        {/* PROGRESS CHART */}
        <WeightProgressChart
          startingWeight={startingWeight}
          goalWeight={goalWeight}
          currentWeight={currentWeight}
        />

        {/* EXPLANATORY TEXTS */}
        <ProgressExplainingPanel
          startingWeight={startingWeight}
          goalWeight={goalWeight}
          currentWeight={currentWeight}
          plan={plan}
        />
      </View>
    </Card>
  );
}

export default ProgressCard;

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: "row",
  },
});
