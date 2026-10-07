import { View } from "react-native";

import MacrosChartCard from "./MacrosChartCard";
import SugarCard from "./SugarCard";

function NutriensInfoPanel({ nutriensInfo, style, accent = false }) {
  return (
    <View style={style}>
      <MacrosChartCard
        calories={nutriensInfo?.kcal}
        carbs={nutriensInfo?.carbs}
        protein={nutriensInfo?.protein}
        fat={nutriensInfo?.fat}
        accent={accent}
      />
      <SugarCard
        sugar={nutriensInfo?.sugar}
        addedSugar={nutriensInfo?.addedSugar}
        accent={accent}
      />
    </View>
  );
}

export default NutriensInfoPanel;
