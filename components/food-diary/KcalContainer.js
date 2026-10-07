import { View, StyleSheet } from "react-native";

import CustomText from "../UI/CustomText";
import { getKcalTextStyle } from "../../utils/styleUtils";

function KcalContainer({
  calories,
  style,
  isLoggedFood = false,
  isDetails = false,
  isMeal = false,
  accent = false,
}) {
  return (
    <View style={[styles.container, style]}>
      {/* KCAL */}
      <CustomText
        isHighlight
        accent={!accent}
        style={getKcalTextStyle(isDetails)}
      >
        {calories}
      </CustomText>

      {/* KCAL LABEL */}
      <CustomText accent={accent} style={styles.kcalPer100GText}>
        {isLoggedFood ? "kcal" : isMeal ? "kcal / meal" : "kcal / 100g"}
      </CustomText>
    </View>
  );
}

export default KcalContainer;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  kcalPer100GText: {
    fontSize: 10,
  },
});
