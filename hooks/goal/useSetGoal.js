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

function useSetGoal({ isFirstGoalSet = false }) {
  const [isFetchingData, setIsFetchingData] = useState(false);

  const getCalorieData = useCalorieData();
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const userCtx = useContext(UserContext);
  const alertCtx = useContext(AlertContext);

  async function setGoal({ values, weight, startingDate }) {
    if (isFetchingData) return;
    setIsFetchingData(true);
    try {
      const { token, id: userId } = await authCtx.getTokenAndId();
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
      } = values;

      const localWeight = weight || startingWeight;
      const userData = { sex, birthday: getDateShortStringFormat(birthday) };
      let goalData = {
        height,
        startingWeight: localWeight,
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

      if (isFirstGoalSet) {
        await WeightService.postNewWeight({
          token,
          userId,
          weight: startingWeight,
        });
        await UserService.updateUserData({ token, userId, userData });
        await GoalService.postNewGoal({ token, userId, goalData });
        await authCtx.setIsFirstLogin(false);
      } else {
        await WeightService.postNewWeight({
          token,
          userId,
          weight: localWeight,
        });
        await GoalService.updateGoal({ token, userId, goalData });
        navigation.goBack();
      }

      await userCtx.fetchData({ token, userId });
    } catch (error) {
      alertCtx.showAlert({
        title: "Data sync failed!",
        accent: !isFirstGoalSet,
        error,
      });
    } finally {
      setIsFetchingData(false);
    }
  }

  return { isFetchingData, setGoal };
}

export default useSetGoal;
