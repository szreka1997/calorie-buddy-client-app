import { View } from "react-native";

import ChartExplainingText from "../UI/ChartExplainingText";
import { getCaloriesAndMacrosExplanatoryTextsData } from "../../utils/homeUtils";

function CaloriesAndMacrosExplanatoryTexts({
  consumedKcal,
  consumedProtein,
  consumedCarbs,
  consumedFat,
  maxKcal,
  maxProtein,
  maxCarbs,
  maxFat,
  accent = false,
}) {
  const data = getCaloriesAndMacrosExplanatoryTextsData({
    consumedKcal,
    consumedProtein,
    consumedCarbs,
    consumedFat,
    maxKcal,
    maxProtein,
    maxCarbs,
    maxFat,
    accent,
  });

  return (
    <View>
      {data.map((item) => {
        const { key, ...explanatoryData } = item;
        return <ChartExplainingText key={key} {...explanatoryData} />;
      })}
    </View>
  );
}

export default CaloriesAndMacrosExplanatoryTexts;
