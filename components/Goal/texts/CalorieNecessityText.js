import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

import CustomText from "../../UI/CustomText";
import { SEX } from "../../../constants/commonConstants";
import { getCalorieNecessityMessage } from "../../../utils/goalUtils";

function CalorieNecessityText({ control, formState }) {
  const { sex, birthday, height, startingWeight, activityLevel } = useWatch(
    control,
    ["sex", "birthday", "height", "startingWeight", "activityLevel"],
  );
  const [text, setText] = useState();

  useEffect(() => {
    const message = getCalorieNecessityMessage(
      sex,
      birthday,
      height,
      startingWeight,
      activityLevel,
      formState.errors,
      sex === SEX.FEMALE,
      CustomText,
    );
    setText(message);
  }, [sex, birthday, height, startingWeight, activityLevel, formState]);

  return text;
}

export default CalorieNecessityText;
