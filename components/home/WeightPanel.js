import { useNavigation } from "@react-navigation/native";

import StatCard from "./StatCard";
import useWeightData from "../../hooks/home/useWeightData";

function WeightPanel() {
  const navigation = useNavigation();
  const { last7Weight, statInfo, lastWeight } = useWeightData();

  function navigateToAddWeightScreen() {
    navigation.navigate("AddWeight", {
      lastWeight,
    });
  }

  return (
    <StatCard
      title="Weight"
      last7Name="weight log"
      last7Data={last7Weight}
      statLegend="Weight (kg)"
      totalLabel="Net change (7 logs):"
      avaregeLabel="Average change / log:"
      totalValue={statInfo.netChange}
      avaregeValue={statInfo.avaregeLog}
      valueAmountName="kg"
      onPress={navigateToAddWeightScreen}
    />
  );
}

export default WeightPanel;
