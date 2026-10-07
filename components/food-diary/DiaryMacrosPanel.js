import { View, StyleSheet } from "react-native";

import COLORS from "../../constants/colorConstants";
import DiaryMacroText from "./DiaryMacroText";

function DiaryMacrosPanel({ protein, carbs, fat }) {
  return (
    <View style={styles.container}>
      <DiaryMacroText label="P:" amount={protein} color={COLORS.PROTEIN_500} />
      <DiaryMacroText label="C:" amount={carbs} color={COLORS.CARBS_500} />
      <DiaryMacroText label="F:" amount={fat} color={COLORS.FAT_500} />
    </View>
  );
}

export default DiaryMacrosPanel;

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    width: 40,
  },
});
