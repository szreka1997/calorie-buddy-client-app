import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";

import useHandleImage from "./useHandleImage";
import { AuthContext } from "../../contexts/auth-context";
import { AlertContext } from "../../contexts/alert-context";
import * as FoodService from "../../services/food-service";

function useAddAndEditFoodSubmit({
  foodData,
  mealData,
  foodHistoryId,
  consumedGramm,
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
  const { handleImage } = useHandleImage();

  async function submit(values) {
    setIsUploading(true);
    try {
      const imageObj = await handleImage(values);

      const { token, id: userId } = await authCtx.getTokenAndId();
      const { image, ...payloadValues } = values;
      const payload = {
        ...payloadValues,
        ...imageObj,
      };

      if (foodData) {
        const updatedFoodData = await FoodService.updateNewFood({
          token,
          foodId: foodData.id || values.id,
          foodData: payload,
        });
        navigation.popTo("FoodDetails", {
          foodData: {
            ...updatedFoodData,
          },
          mealData,
          foodHistoryId,
          consumedGramm,
          foodIdAndQuantityList,
          isModifying,
          isMealLogScreen,
          isSearchForMealItem,
          isCreateAndEditMealScreen,
        });
      } else {
        await FoodService.postNewFood({ token, userId, foodData: payload });
        navigation.popTo("FoodSearch", {
          shouldRefreshFoodList: true,
        });
      }

      alertCtx.showAlert({
        title: "Success!",
        message: `Food succesfully ${foodData ? "modified" : "uploaded"}!`,
        accent: true,
      });
    } catch (error) {
      alertCtx.showAlert({ accent: !foodData, error });
    } finally {
      setIsUploading(false);
    }
  }

  return {
    isUploading,
    submit,
  };
}

export default useAddAndEditFoodSubmit;
