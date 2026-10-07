import { StyleSheet, View } from "react-native";

import Card from "../../UI/Card";
import CardTitle from "../../UI/CardTitle";
import CustomText from "../../UI/CustomText";
import GoalPanel from "../GoalPanel";

function GoalsCard({ userData, plan, macrosInGramm, style }) {
  return (
    <Card style={style}>
      <CardTitle>Goals</CardTitle>

      <View style={styles.innerContainer}>
        {/* WEIGHT */}
        <GoalPanel
          title="Weight"
          highlightText={`${userData.goalWeight} kg`}
          icon="scale"
        >
          <CustomText>
            {plan.plan}{" "}
            {plan.weeklyRate && plan.weeklyRate.toFixed(2) + " kg / week"}
          </CustomText>
        </GoalPanel>

        {/* DAILY CALORIES */}
        <GoalPanel
          title="Daily Calories"
          highlightText={`${userData.goalCalories} kcal`}
          icon="flame"
        >
          <CustomText>
            {`Protein: ${userData.goalProtein}% - (${macrosInGramm.proteinInGramm}g)`}
          </CustomText>
          <CustomText>
            {`Carbs: ${userData.goalCarbs}% - (${macrosInGramm.carbsInGramm}g)`}
          </CustomText>
          <CustomText>
            {`Fat: ${userData.goalFat}% - (${macrosInGramm.fatInGramm}g)`}
          </CustomText>
        </GoalPanel>
      </View>
    </Card>
  );
}

export default GoalsCard;

const styles = StyleSheet.create({
  innerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
