import { useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import LoadingOverlay from "../../components/UI/LoadingOverlay";
import MealDetailsContent from "../../components/food-diary/meal/MealDetailsContent";
import useLogMealSubmit from "../../hooks/food-diary/useLogMealSubmit";
import useFetchMealItems from "../../hooks/food-diary/useFetchMealItems";
import useMealDetailsHeader from "../../hooks/food-diary/useMealDetailsHeader";

function MealDetailsScreen({ route }) {
  const { mealData } = route.params || {};

  const [foodIdAndQuantityList, setFoodIdAndQuantityList] = useState(
    route.params?.foodIdAndQuantityList,
  );

  const isFocused = useIsFocused();

  const { isFetchingData, mealItemList, nutriensInfo } = useFetchMealItems({
    mealId: mealData.id,
    foodIdAndQuantityList: route.params?.foodIdAndQuantityList,
    setFoodIdAndQuantityList,
    isFocused,
    accent: true,
  });

  const { isSubmittingData, onSubmit } = useLogMealSubmit({ mealItemList });

  useMealDetailsHeader({ mealData, foodIdAndQuantityList });

  if (isFetchingData || isSubmittingData) {
    return <LoadingOverlay />;
  }

  return (
    <MealDetailsContent
      mealData={mealData}
      mealItemList={mealItemList}
      nutriensInfo={nutriensInfo}
      foodIdAndQuantityList={foodIdAndQuantityList}
      onSubmit={onSubmit}
    />
  );
}

export default MealDetailsScreen;
