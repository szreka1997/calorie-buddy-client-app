import { useContext, useEffect, useState } from "react";

import useFetchFoodDiaryItems from "../../hooks/food-diary/useFetchFoodDiaryItems";
import { AuthContext } from "../../contexts/auth-context";
import { UserContext } from "../../contexts/user-context";
import { AlertContext } from "../../contexts/alert-context";
import { sumDictElements } from "../../utils/helperFunctions";
import { getInitialNutriensInfo } from "../../utils/foodDiaryUtils";
import * as CalorieDeficitService from "../../services/calorie-deficit-service";

function useFetchHomeData({ isFocused }) {
  const [isLocallyFetchingData, setIsLocallyFetchingData] = useState(false);
  const [localNutriensInfo, setLocalNutriensInfo] = useState({
    ...getInitialNutriensInfo(),
  });
  const [last7DayCalorieDeficit, setLast7DayCalorieDeficit] = useState({
    labels: [],
    data: [],
  });

  const authCtx = useContext(AuthContext);
  const alertCtx = useContext(AlertContext);
  const userCtx = useContext(UserContext);

  const { isFetchingData, nutriensInfo } = useFetchFoodDiaryItems({
    isHomeScreen: true,
  });

  async function getLast7DayCalorieDeficit() {
    try {
      setIsLocallyFetchingData(true);
      const { token, id: userId } = await authCtx.getTokenAndId();
      const calorieDeficits = await CalorieDeficitService.getCalorieDeficit({
        token,
        userId,
      });

      const labels = [];
      const data = [];
      calorieDeficits.forEach((item) => {
        labels.push(item.date);
        data.push(item.calories);
      });

      setLast7DayCalorieDeficit({
        labels,
        data,
      });
    } catch (error) {
      alertCtx.showAlert({ accent: true, error });
    } finally {
      setIsLocallyFetchingData(false);
    }
  }

  useEffect(() => {
    if (isFocused && userCtx.userData) {
      getLast7DayCalorieDeficit();
    }
  }, [isFocused, userCtx.userData]);

  useEffect(() => {
    const { sugar, addedSugar, ...kcalAndMacros } = nutriensInfo;
    const tempNutriensInfo = { ...getInitialNutriensInfo(), sugar, addedSugar };

    Object.entries(kcalAndMacros).forEach(([nutriens, values]) => {
      tempNutriensInfo[nutriens] = sumDictElements(values);
    });

    setLocalNutriensInfo({ ...tempNutriensInfo });
  }, [nutriensInfo]);

  return {
    isFetchingData:
      isFetchingData ||
      isLocallyFetchingData ||
      !userCtx.userData?.goalCalories ||
      userCtx.userData?.goalCalories === 0,
    nutriensInfo: localNutriensInfo,
    last7DayCalorieDeficit,
  };
}

export default useFetchHomeData;
