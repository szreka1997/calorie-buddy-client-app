import { StyleSheet, View } from "react-native";

import CustomText from "../UI/CustomText";
import { getSignedValueText } from "../../utils/homeUtils";

function StatPanel({
  totalLabel,
  totalValue,
  avaregeLabel,
  avaregeValue,
  valueAmountName,
  accent = false,
}) {
  return (
    <View style={styles.container}>
      {/* LABELS */}
      <View>
        <CustomText accent={accent}>{totalLabel}</CustomText>
        <CustomText accent={accent}>{avaregeLabel}</CustomText>
      </View>

      {/* VALUES */}
      <View>
        <CustomText accent={!accent} isHighlight>
          {getSignedValueText(totalValue)} {valueAmountName}
        </CustomText>
        <CustomText accent={!accent} isHighlight>
          {getSignedValueText(avaregeValue)} {valueAmountName}
        </CustomText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default StatPanel;
