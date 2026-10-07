import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

import CustomText from "../../UI/CustomText";
import { SEX } from "../../../constants/commonConstants";
import { getGoalPlanMessage } from "../../../utils/goalUtils";

function GoalPlanText({ control, formState }) {
  const {
    sex,
    birthday,
    height,
    startingWeight,
    activityLevel,
    goalWeight,
    goalCalories,
  } = useWatch(control, [
    "sex",
    "birthday",
    "height",
    "startingWeight",
    "activityLevel",
    "goalWeight",
    "goalCalories",
  ]);
  const [text, setText] = useState();

  useEffect(() => {
    const message = getGoalPlanMessage(
      sex,
      birthday,
      height,
      startingWeight,
      activityLevel,
      goalWeight,
      goalCalories,
      formState.errors,
      sex === SEX.FEMALE,
      CustomText,
    );
    setText(message);
  }, [
    sex,
    birthday,
    height,
    startingWeight,
    activityLevel,
    goalWeight,
    goalCalories,
    formState,
  ]);

  return text;
}

export default GoalPlanText;
