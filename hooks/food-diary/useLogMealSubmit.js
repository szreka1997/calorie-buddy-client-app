import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import { AuthContext } from "../../contexts/auth-context";
import { DateContext } from "../../contexts/date-context";
import { AlertContext } from "../../contexts/alert-context";
import { getDateShortStringFormat } from "../../utils/dateUtils";
import * as FoodHistoryService from "../../services/food-history-service";

function useLogMealSubmit({ mealItemList }) {
  const [isSubmittingData, setIsSubmittingData] = useState(false);

  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const dateCtx = useContext(DateContext);
  const alertCtx = useContext(AlertContext);
  const date = dateCtx.date;

  async function onSubmit(values) {
    const { mealCategory } = values;

    try {
      setIsSubmittingData(true);
      const { token, id: userId } = await authCtx.getTokenAndId();

      for (var item of mealItemList) {
        const data = {
          date: getDateShortStringFormat(date),
          quantity: item.quantity,
          foodId: item.foodData.id,
          mealCategory,
        };

        await FoodHistoryService.postNewFoodHistoryItem({
          token,
          userId,
          foodHistoryData: data,
        });
      }

      navigation.popTo("Tabs", {
        screen: "FoodDiary",
        params: { mealCategory },
      });
    } catch (error) {
      alertCtx.showAlert({ accent: true, error });
    } finally {
      setIsSubmittingData(false);
    }
  }

  return { isSubmittingData, onSubmit };
}

export default useLogMealSubmit;
