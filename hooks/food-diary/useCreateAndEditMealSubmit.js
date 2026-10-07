import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import useHandleImage from "./useHandleImage";
import { AuthContext } from "../../contexts/auth-context";
import { AlertContext } from "../../contexts/alert-context";
import * as MealService from "../../services/meal-service";

function useCreateAndEditMealSubmit(mealData) {
  const [isFetchingData, setIsFetchingData] = useState(false);

  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const alertCtx = useContext(AlertContext);
  const { handleImage } = useHandleImage();

  async function submit(values) {
    setIsFetchingData(true);
    try {
      const imageObj = await handleImage(values);

      const { token, id: userId } = await authCtx.getTokenAndId();
      const payload = {
        name: values.name,
        kcal: values.kcal,
        nutriScore: values.nutriScore,
        ...imageObj,
        foods: [...values.foodIdAndQuantityList],
      };

      if (mealData) {
        await MealService.updateMeal({
          token,
          mealId: mealData.id || values.id,
          mealData: payload,
        });
      } else {
        await MealService.postNewMeal({ token, userId, mealData: payload });
      }

      navigation.popTo("FoodSearch", { shouldRefreshMealList: true });
      alertCtx.showAlert({
        title: "Success!",
        message: `Meal succesfully ${mealData ? "modified" : "uploaded"}!`,
      });
    } catch (error) {
      alertCtx.showAlert({ accent: !mealData, error });
    } finally {
      setIsFetchingData(false);
    }
  }

  return { isFetchingData, submit };
}

export default useCreateAndEditMealSubmit;
