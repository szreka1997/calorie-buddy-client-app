import { StyleSheet, View } from "react-native";

import SimpleCardChart from "./SimpleCardChart";
import { calculateMaxHealthySugarAmount } from "../../utils/foodDiaryUtils";

function SugarPanel({ sugar, addedSugar, goalCalories }) {
  return (
    <View style={styles.container}>
      <SimpleCardChart
        label="Total Sugars"
        actualAmount={sugar}
        totalAmount={calculateMaxHealthySugarAmount(goalCalories)}
        amountName="g"
        accent
        style={styles.sugarCard}
      />
      <SimpleCardChart
        label="Total Added Sugars"
        actualAmount={addedSugar}
        totalAmount={calculateMaxHealthySugarAmount(goalCalories, true)}
        amountName="g"
        style={styles.addedSugarCard}
      />
    </View>
  );
}

export default SugarPanel;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  sugarCard: {
    flex: 1,
    marginRight: 2,
  },
  addedSugarCard: {
    flex: 1,
    marginLeft: 2,
  },
});
