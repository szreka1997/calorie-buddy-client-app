import { MACROS } from "../../constants/commonConstants";
import {
  getBMR,
  getCalorieNeeds,
  getLossOrGainPlan,
  getMacroGramm,
} from "../../utils/bmiUtils";

const CALORIE_BUFFER = 100;
const CALORIE_RANGE = 500;

function adjustGoalCalories({ goalData, calorieNeeds }) {
  const startingWeight = parseFloat(goalData.startingWeight);
  const goalWeight = parseFloat(goalData.goalWeight);
  const goalCalories = parseInt(goalData.goalCalories);

  // Maintain
  if (startingWeight === goalWeight) return calorieNeeds;

  // Gain weight
  if (
    startingWeight < goalWeight &&
    (goalCalories < calorieNeeds || goalCalories > calorieNeeds + CALORIE_RANGE)
  )
    return calorieNeeds + CALORIE_BUFFER;

  // Lose weight
  if (
    startingWeight > goalWeight &&
    (goalCalories > calorieNeeds || goalCalories < calorieNeeds - CALORIE_RANGE)
  )
    return calorieNeeds - CALORIE_BUFFER;

  return goalCalories;
}

function getMacros({ goalData }) {
  return {
    proteinInGramm: getMacroGramm(
      MACROS.PROTEIN,
      goalData.goalProtein,
      goalData.goalCalories,
    ),
    carbsInGramm: getMacroGramm(
      MACROS.CARBOHYDRATE,
      goalData.goalCarbs,
      goalData.goalCalories,
    ),
    fatInGramm: getMacroGramm(
      MACROS.FAT,
      goalData.goalFat,
      goalData.goalCalories,
    ),
  };
}

function useCalorieData() {
  function getCalorieData({
    userData,
    goalData,
    shouldUpdateGoalCalories = false,
  }) {
    const localGoalData = { ...goalData };
    const bmr = getBMR(
      userData.sex,
      userData.birthday,
      goalData.height,
      goalData.startingWeight,
    );
    const calorieNeeds = getCalorieNeeds(goalData.activityLevel, bmr);

    if (shouldUpdateGoalCalories) {
      localGoalData.goalCalories = adjustGoalCalories({
        goalData,
        calorieNeeds,
      });
    }

    const resultPlan = getLossOrGainPlan(
      localGoalData.startingWeight,
      localGoalData.goalWeight,
      localGoalData.goalCalories,
      calorieNeeds,
    );
    const macros = getMacros({ goalData: localGoalData });

    return {
      bmr,
      calorieNeeds,
      resultPlan,
      ...macros,
      goalData: localGoalData,
    };
  }

  return getCalorieData;
}

export default useCalorieData;
