import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import useCalorieData from "./useCalorieData";
import { AuthContext } from "../../contexts/auth-context";
import { UserContext } from "../../contexts/user-context";
import { AlertContext } from "../../contexts/alert-context";
import { getDateShortStringFormat } from "../../utils/dateUtils";
import * as UserService from "../../services/user-service";
import * as GoalService from "../../services/goal-service";
import * as WeightService from "../../services/weight-service";

function useUpdateUser() {
  const [isFetchingData, setIsFetchingData] = useState(false);

  const getCalorieData = useCalorieData();
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const alertCtx = useContext(AlertContext);

  async function updateUser({ values, startingDate }) {
    if (isFetchingData) return;
    setIsFetchingData(true);
    try {
      const { token, id: userId } = await authCtx.getTokenAndId();
      const result = await WeightService.getLastWeightByUserId({
        token,
        userId,
      });
      const weight = result?.weight;
      const {
        username,
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
      } = values;
      const userData = {
        username,
        sex,
        birthday: getDateShortStringFormat(birthday),
      };
      let goalData = {
        height,
        startingWeight: weight || startingWeight,
        activityLevel,
        goalWeight,
        goalCalories,
        goalProtein,
        goalCarbs,
        goalFat,
      };

      const { resultPlan, goalData: localGoalData } = getCalorieData({
        userData,
        goalData,
        shouldUpdateGoalCalories: true,
      });

      goalData = {
        ...localGoalData,
        ...resultPlan,
        startingWeight,
        startingDate:
          getDateShortStringFormat(startingDate) ||
          getDateShortStringFormat(new Date()),
      };

      await Promise.all([
        await GoalService.updateGoal({ token, userId, goalData }),
        await UserService.updateUserData({ token, userId, userData }),
      ]);

      await userCtx.fetchData({ token, userId });

      navigation.goBack();
    } catch (error) {
      alertCtx.showAlert({ title: "Data sync failed!", accent: true, error });
    } finally {
      setIsFetchingData(false);
    }
  }

  return { isFetchingData, updateUser };
}

export default useUpdateUser;
