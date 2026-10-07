import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";

import CustomText from "../../UI/CustomText";
import { SEX } from "../../../constants/commonConstants";
import { getOptimalWeightMessage } from "../../../utils/goalUtils";

function OptimalWeightText({ control, formState }) {
  const { sex, birthday, height } = useWatch(control, [
    "sex",
    "birthday",
    "height",
  ]);
  const [text, setText] = useState();

  useEffect(() => {
    const message = getOptimalWeightMessage(
      sex,
      birthday,
      height,
      formState.errors,
      formState.touchedFields,
      sex === SEX.FEMALE,
      CustomText,
    );

    setText(message);
  }, [sex, birthday, height, formState]);

  return text;
}

export default OptimalWeightText;
