import StatCard from "./StatCard";
import {
  sumListElements,
  avaregeListElements,
} from "../../utils/helperFunctions";

function CalorieDeficitPanel({ last7DayCalorieDeficit }) {
  const totalValue = sumListElements([...last7DayCalorieDeficit.data], true);
  const avaregeValue = avaregeListElements(
    [...last7DayCalorieDeficit.data],
    true,
  );

  return (
    <StatCard
      title="Calorie Burned"
      last7Name="days"
      last7Data={last7DayCalorieDeficit}
      statLegend="Burned (kcal)"
      totalLabel="Total Kcal Burned in the Last 7 Days:"
      avaregeLabel="Average Daily Kcal Burned:"
      totalValue={totalValue}
      avaregeValue={avaregeValue}
      valueAmountName="kcal"
      accent
    />
  );
}

export default CalorieDeficitPanel;
