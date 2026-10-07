import { StyleSheet, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import Card from "../UI/Card";
import CustomChart from "../UI/CustomChart";
import CardTitle from "../../components/UI/CardTitle";
import { getFeedbackEmoticonName } from "../../utils/foodDiaryUtils";
import { getDynamicColors } from "../../utils/colorUtils";

function SimpleCardChart({
  label,
  actualAmount,
  totalAmount,
  amountName,
  style,
  accent = false,
}) {
  const colors = getDynamicColors(accent);

  return (
    <Card style={style}>
      <View style={styles.container}>
        {/* LABEL */}
        <View style={styles.labelContainer}>
          <CardTitle accent={accent} textStyle={styles.labelText}>
            {label}
          </CardTitle>
          <View style={styles.labelIconContainer}>
            <FontAwesome5
              name={getFeedbackEmoticonName(actualAmount, totalAmount)}
              size={20}
              color={colors.shade500}
            />
          </View>
        </View>

        {/* CHART */}
        <CustomChart
          actualAmount={actualAmount}
          totalAmount={totalAmount}
          amountName={amountName}
          accent={accent}
        ></CustomChart>
      </View>
    </Card>
  );
}

export default SimpleCardChart;

const styles = StyleSheet.create({
  container: {
    minHeight: 160,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  labelText: {
    fontSize: 14,
    textAlign: "center",
  },
  labelIconContainer: {
    marginLeft: 8,
  },
});
