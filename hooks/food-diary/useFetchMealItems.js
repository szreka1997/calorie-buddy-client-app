import { useContext, useLayoutEffect, useState } from "react";

import { AuthContext } from "../../contexts/auth-context";
import { AlertContext } from "../../contexts/alert-context";
import {
  getNutritionInfoFromFoodAndQuantity,
  getNumberRepresentationOfNutriScore,
  getInitialMealNutriensInfo,
} from "../../utils/foodDiaryUtils";
import * as FoodService from "../../services/food-service";
import * as MealService from "../../services/meal-service";

function useFetchMealItems({
  mealId,
  foodIdAndQuantityList,
  setFoodIdAndQuantityList,
  isFocused = false,
  isCreateAndEditMealScreen = false,
  accent = false,
}) {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [mealItemList, setMealItemList] = useState([]);
  const [nutriensInfo, setNutriensInfo] = useState({
    ...getInitialMealNutriensInfo(),
  });

  const authCtx = useContext(AuthContext);
  const alertCtx = useContext(AlertContext);

  useLayoutEffect(() => {
    async function getMealItems() {
      setIsFetchingData(true);
      try {
        const { token } = await authCtx.getTokenAndId();

        let foodIdsAndQuantities;
        if (foodIdAndQuantityList) {
          foodIdsAndQuantities = foodIdAndQuantityList;
        } else if (mealId) {
          const meal = await MealService.getMealByMealId({ token, mealId });
          foodIdsAndQuantities = meal.foods;
        }

        setFoodIdAndQuantityList(foodIdsAndQuantities);
        if (!foodIdsAndQuantities || foodIdsAndQuantities?.length === 0) {
          setMealItemList([]);
          setNutriensInfo({ ...getInitialMealNutriensInfo() });
          return;
        }

        const fetchedFoods = await Promise.all(
          foodIdsAndQuantities.map((item) =>
            FoodService.getFoodById({ foodId: item.foodId }),
          ),
        );

        const tempMealItems = [];
        const tempNutriensInfo = { ...getInitialMealNutriensInfo() };

        foodIdsAndQuantities.forEach((item, i) => {
          const foodData = fetchedFoods[i];
          tempMealItems.push({
            foodData,
            quantity: item.quantity,
          });
          const nutriensInfoForItem = getNutritionInfoFromFoodAndQuantity({
            food: foodData,
            quantity: item.quantity,
          });

          Object.entries(nutriensInfoForItem).forEach(([key, value]) => {
            tempNutriensInfo[key] += value;
          });

          tempNutriensInfo.quantity += parseInt(item.quantity);
          tempNutriensInfo.nutriScore += getNumberRepresentationOfNutriScore(
            foodData.nutriScore,
          );
        });

        tempNutriensInfo.nutriScore =
          parseFloat(tempNutriensInfo.nutriScore) / foodIdsAndQuantities.length;

        setMealItemList([...tempMealItems]);
        setNutriensInfo({ ...tempNutriensInfo });
      } catch (error) {
        alertCtx.showAlert({ accent, error });
      } finally {
        setIsFetchingData(false);
      }
    }

    if (isFocused) {
      getMealItems();
    }
  }, [!isCreateAndEditMealScreen && isFocused, foodIdAndQuantityList, mealId]);

  return {
    isFetchingData,
    mealItemList,
    nutriensInfo,
  };
}

export default useFetchMealItems;
