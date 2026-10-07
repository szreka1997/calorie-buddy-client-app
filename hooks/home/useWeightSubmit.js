import { useContext, useState } from "react";

import useSetGoal from "../../hooks/goal/useSetGoal";
import { UserContext } from "../../contexts/user-context";
import { AlertContext } from "../../contexts/alert-context";

function useWeightSubmit() {
  const [isFetchingData, setIsFetchingData] = useState(false);

  const userCtx = useContext(UserContext);
  const alertCtx = useContext(AlertContext);
  const { setGoal } = useSetGoal({});

  async function onSubmit(values) {
    if (isFetchingData) return;
    setIsFetchingData(true);
    try {
      const data = userCtx.userData;
      const goalData = {
        sex: data.sex,
        birthday: data.birthday,
        height: data.height,
        startingWeight: data.startingWeight,
        activityLevel: data.activityLevel,
        goalWeight: data.goalWeight,
        goalCalories: data.goalCalories,
        goalProtein: data.goalProtein,
        goalCarbs: data.goalCarbs,
        goalFat: data.goalFat,
      };

      await setGoal({
        values: goalData,
        weight: values.weight,
        startingDate: data.startingDate,
      });
    } catch (error) {
      alertCtx.showAlert({ accent: true, error });
    } finally {
      setIsFetchingData(false);
    }
  }

  return { isFetchingData, onSubmit };
}

export default useWeightSubmit;
