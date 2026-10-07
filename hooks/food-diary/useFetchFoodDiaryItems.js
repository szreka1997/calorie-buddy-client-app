import { useContext, useLayoutEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import { AuthContext } from "../../contexts/auth-context";
import { AlertContext } from "../../contexts/alert-context";
import { DateContext } from "../../contexts/date-context";
import {
  getInitialFoodHistory,
  getInitialFoodDiaryNutriensInfo,
  accumulateMealCategoryMacrosAndSugars,
  getNutritionInfoFromFoodAndQuantity,
} from "../../utils/foodDiaryUtils";
import * as FoodService from "../../services/food-service";
import * as FoodHistoryService from "../../services/food-history-service";

function useFetchFoodDiaryItems({
  mealEntriesRefs,
  mealCategory,
  isHomeScreen = false,
}) {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [foodHistory, setFoodHistory] = useState({
    ...getInitialFoodHistory(),
  });
  const [nutriensInfo, setNutriensInfo] = useState({
    ...getInitialFoodDiaryNutriensInfo(),
  });

  const isFocused = useIsFocused();
  const authCtx = useContext(AuthContext);
  const alertCtx = useContext(AlertContext);
  const dateCtx = useContext(DateContext);

  async function getFoodHistory({ date, mealCategory }) {
    try {
      setIsFetchingData(true);
      const { token, id: userId } = await authCtx.getTokenAndId();
      const localFoodHistory =
        await FoodHistoryService.getFoodHistoriesByUserIdAndByDateOrderByDate({
          token,
          userId,
          date,
        });

      const foods = getInitialFoodHistory();
      const tempNutriensInfo = {
        ...getInitialFoodDiaryNutriensInfo(),
      };

      for (let item of localFoodHistory) {
        const food = await FoodService.getFoodById({ foodId: item.foodId });
        const consumedAmounts = getNutritionInfoFromFoodAndQuantity({
          food,
          quantity: item.quantity,
        });

        const category = item.mealCategory;
        const categoryFoods = foods[category];

        categoryFoods.push({
          ...food,
          ...consumedAmounts,
          foodHistoryId: item.id,
          mealCategory: category,
          consumedGramm: item.quantity,
        });

        accumulateMealCategoryMacrosAndSugars({
          nutriensInfo: tempNutriensInfo,
          category,
          food: categoryFoods[categoryFoods.length - 1],
        });
      }

      Object.entries(tempNutriensInfo).forEach(([nutriensCategory, values]) => {
        Object.entries(values).forEach(([mealCategory, value]) => {
          tempNutriensInfo[nutriensCategory][mealCategory] = Math.round(value);
        });
      });
      tempNutriensInfo.sugar = Math.round(tempNutriensInfo.sugar);
      tempNutriensInfo.addedSugar = Math.round(tempNutriensInfo.addedSugar);

      setFoodHistory({
        ...foods,
      });
      setNutriensInfo({
        kcal: { ...tempNutriensInfo.kcal },
        protein: { ...tempNutriensInfo.protein },
        carbs: { ...tempNutriensInfo.carbs },
        fat: { ...tempNutriensInfo.fat },
        sugar: tempNutriensInfo.sugar,
        addedSugar: tempNutriensInfo.addedSugar,
      });
    } catch (error) {
      alertCtx.showAlert({ accent: true, error });
    } finally {
      setIsFetchingData(false);

      const timeout = setTimeout(() => {
        if (mealEntriesRefs)
          mealEntriesRefs[mealCategory]?.current?.openCollapsible();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }

  useLayoutEffect(() => {
    if (isFocused) {
      getFoodHistory({
        date: isHomeScreen ? new Date() : dateCtx.date,
        mealCategory,
      });
    }
  }, [isFocused, mealCategory, dateCtx.date]);

  return {
    isFetchingData,
    foodHistory,
    nutriensInfo,
    getFoodHistory,
  };
}

export default useFetchFoodDiaryItems;
