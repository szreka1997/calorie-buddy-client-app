import { Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";

import { getCustomLineChartData } from "../../utils/helperFunctions";

function CustomLineChart({ rawData, legend, accent = false }) {
  const screenWidth = Dimensions.get("window").width;

  const { data, chartConfig } = getCustomLineChartData({
    rawData,
    legend,
    accent,
  });

  return (
    <LineChart
      data={data}
      width={screenWidth - 40}
      height={220}
      chartConfig={chartConfig}
    />
  );
}

export default CustomLineChart;
