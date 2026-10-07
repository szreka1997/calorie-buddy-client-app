import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { AuthContext } from "../../contexts/auth-context";
import { AlertContext } from "../../contexts/alert-context";
import { DateContext } from "../../contexts/date-context";
import { getDateShortStringFormat } from "../../utils/dateUtils";
import * as FoodHistoryService from "../../services/food-history-service";

function useLogFoodSubmit({
  foodData,
  mealData,
  foodHistoryId,
  foodIdAndQuantityList,
  isModifying = false,
  isMealLogScreen = false,
  isSearchForMealItem = false,
  isCreateAndEditMealScreen = false,
}) {
  const [isUploading, setIsUploading] = useState(false);

  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const alertCtx = useContext(AlertContext);
  const dateCtx = useContext(DateContext);
  const date = dateCtx.date;

  // Helper function: handles building meal items & navigation
  function handleMealItemFlow(quantity) {
    const list = isModifying
      ? foodIdAndQuantityList.map((item) =>
          item.foodId === foodData.id ? { ...item, quantity } : item,
        )
      : [...(foodIdAndQuantityList ?? []), { foodId: foodData.id, quantity }];

    const screenName = isMealLogScreen ? "MealDetails" : "CreateAndEditMeal";
    const params = {
      mealData,
      foodIdAndQuantityList: list,
    };

    navigation.popTo(screenName, { ...params });
  }

  async function submit({ quantity, mealCategory }) {
    // Handle Meal flow
    if (isSearchForMealItem || isMealLogScreen || isCreateAndEditMealScreen) {
      handleMealItemFlow(quantity);
      return;
    }

    // Handle Food flow
    try {
      setIsUploading(true);
      const { token, id: userId } = await authCtx.getTokenAndId();
      const payload = {
        foodId: foodData.id,
        mealCategory,
        quantity,
        date: getDateShortStringFormat(date),
      };

      navigation.popTo("Tabs", {
        screen: "FoodDiary",
        params: { mealCategory },
      });

      if (foodHistoryId) {
        await FoodHistoryService.updateFoodHistoryItem({
          token,
          foodHistoryId,
          foodHistoryData: payload,
        });
      } else {
        await FoodHistoryService.postNewFoodHistoryItem({
          token,
          userId,
          foodHistoryData: payload,
        });
      }
    } catch (error) {
      alertCtx.showAlert({ accent: true, error });
    } finally {
      setIsUploading(false);
    }
  }

  return { isUploading, submit };
}

export default useLogFoodSubmit;
