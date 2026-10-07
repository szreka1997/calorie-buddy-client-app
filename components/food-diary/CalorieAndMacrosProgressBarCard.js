import { StyleSheet, View } from "react-native";

import Card from "../UI/Card";
import CalorieOrMacroProgressBar from "./CalorieOrMacroProgressBar";
import { getDynamicColors, getMacroColors } from "../../utils/colorUtils";

function CalorieAndMacrosProgressBarCard({
  maxCalories,
  consumedCalories,
  maxProtein,
  consumedProtein,
  maxFat,
  consumedFat,
  maxCarbs,
  consumedCarbs,
  accent = false,
  style,
}) {
  const colors = getDynamicColors(accent);
  const macroColors = getMacroColors();
  const lightMacroColors = getMacroColors(true);

  return (
    <Card style={style}>
      {/* CALORIES */}
      <View style={styles.caloriesContainer}>
        <CalorieOrMacroProgressBar
          name="Calories"
          consumed={consumedCalories}
          max={maxCalories}
          color={colors.shade800}
          labelColor={colors.shade100}
          isCalorie
        />
      </View>

      {/* MACROS */}
      <View style={[styles.macrosContainer]}>
        {/* PROTEIN */}
        <CalorieOrMacroProgressBar
          name="Protein"
          consumed={consumedProtein}
          max={maxProtein}
          color={macroColors.protein}
          labelColor={lightMacroColors.protein}
          isProtein
        />

        {/* CARBS */}
        <CalorieOrMacroProgressBar
          name="Carbs"
          consumed={consumedCarbs}
          max={maxCarbs}
          color={macroColors.carbs}
          labelColor={lightMacroColors.carbs}
          style={{ marginHorizontal: 4 }}
        />

        {/* FAT */}
        <CalorieOrMacroProgressBar
          name="Fat"
          consumed={consumedFat}
          max={maxFat}
          color={macroColors.fat}
          labelColor={lightMacroColors.fat}
        />
      </View>
    </Card>
  );
}

export default CalorieAndMacrosProgressBarCard;

const styles = StyleSheet.create({
  caloriesContainer: {
    marginTop: -4,
  },
  macrosContainer: {
    flexDirection: "row",
    marginTop: 4,
  },
});
