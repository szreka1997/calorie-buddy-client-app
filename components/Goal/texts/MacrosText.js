import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

import CustomText from "../../UI/CustomText";
import { SEX } from "../../../constants/commonConstants";
import { getMacrosMessage } from "../../../utils/goalUtils";

function MacrosText({ control, formState }) {
  const {
    sex,
    birthday,
    height,
    startingWeight,
    activityLevel,
    goalWeight,
    goalCalories,
    goalProtein,
    goalCarbs,
    goalFat,
  } = useWatch(control, [
    "sex",
    "birthday",
    "height",
    "startingWeight",
    "activityLevel",
    "goalWeight",
    "goalCalories",
    "goalProtein",
    "goalCarbs",
    "goalFat",
  ]);
  const [text, setText] = useState();

  useEffect(() => {
    const message = getMacrosMessage(
      sex,
      birthday,
      height,
      startingWeight,
      activityLevel,
      goalWeight,
      goalCalories,
      goalProtein,
      goalCarbs,
      goalFat,
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
    goalProtein,
    goalCarbs,
    goalFat,
    formState,
  ]);

  return text;
}

export default MacrosText;
