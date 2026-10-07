import { useContext, useState, useLayoutEffect } from "react";
import { useRoute } from "@react-navigation/native";

import { MEAL } from "../../constants/commonConstants";
import { AuthContext } from "../../contexts/auth-context";
import { AlertContext } from "../../contexts/alert-context";
import { getInitialFoodHistory } from "../../utils/foodDiaryUtils";
import * as FoodService from "../../services/food-service";
import * as MealService from "../../services/meal-service";
import * as FoodHistoryService from "../../services/food-history-service";

function useFetchFoodSearchItems({ isFocused, isMealTabOpen = false }) {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [foodDataList, setFoodDataList] = useState([]);
  const [mealDataList, setMealDataList] = useState([]);
  const [foodDataSearchedList, setFoodDataSearchedList] = useState([]);
  const [mealDataSearchedList, setMealDataSearchedList] = useState([]);
  const [foodHistoryList, setFoodHistoryList] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: [],
    liquidCalories: [],
  });

  const route = useRoute();
  const authCtx = useContext(AuthContext);
  const alertCtx = useContext(AlertContext);

  async function getFoods() {
    const foods = await FoodService.getFoods();

    foods.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
    setFoodDataList(foods);
    setFoodDataSearchedList(foods);
  }

  async function getFoodHistoryList() {
    const { token, id: userId } = await authCtx.getTokenAndId();
    const foods = { ...getInitialFoodHistory() };

    for (let value of Object.values(MEAL)) {
      const foodHistoryItems =
        await FoodHistoryService.getLast10FoodHistoriesByUserIdAndByMealCategory(
          {
            token,
            userId,
            mealCategory: value,
          },
        );

      for (var item of foodHistoryItems) {
        const food = await FoodService.getFoodById({ foodId: item.foodId });
        foods[value].push({
          ...food,
          foodHistoryId: item.id,
          mealCategory: item.mealCategory,
        });
      }
    }

    setFoodHistoryList({ ...foods });
  }

  async function getMeals() {
    const { token, id: userId } = await authCtx.getTokenAndId();
    const meals = await MealService.getMealsByUserId({ token, userId });

    const tempList = meals.map((meal) =>
      Object.fromEntries(
        Object.entries(meal).filter(([key]) => key !== "foods"),
      ),
    );
    tempList.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

    setMealDataList(tempList);
    setMealDataSearchedList(tempList);
  }

  useLayoutEffect(() => {
    if (isFetchingData) return;

    async function getFoodSearchData() {
      setIsFetchingData(true);
      try {
        if (isFocused || route.params?.shouldRefreshFoodList) {
          await getFoods();
          await getFoodHistoryList();
        }

        if (isFocused || route.params?.shouldRefreshMealList) {
          await getMeals();
        }
      } catch (error) {
        alertCtx.showAlert({ accent: !isMealTabOpen, error });
      } finally {
        setIsFetchingData(false);
      }
    }

    getFoodSearchData();
  }, [
    isFocused,
    route.params?.shouldRefreshFoodList,
    route.params?.shouldRefreshMealList,
  ]);

  return {
    isFetchingData,
    foodHistoryList,
    foodDataList,
    mealDataList,
    foodDataSearchedList,
    mealDataSearchedList,
    setFoodDataSearchedList,
    setMealDataSearchedList,
  };
}

export default useFetchFoodSearchItems;
