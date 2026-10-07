import { ProgressChart } from "react-native-chart-kit";

import { getChartConfig } from "../../utils/helperFunctions";

function MacroChart({ data, color, radius }) {
  return (
    <ProgressChart
      data={data}
      width={200}
      height={200}
      strokeWidth={14}
      radius={radius}
      hideLegend={true}
      chartConfig={getChartConfig({ color })}
    />
  );
}

export default MacroChart;
