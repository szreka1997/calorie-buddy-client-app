import { useRef } from "react";

import LoadingOverlay from "../../components/UI/LoadingOverlay";
import FoodDiaryContent from "../../components/food-diary/food/FoodDiaryContent";
import useFetchFoodDiaryItems from "../../hooks/food-diary/useFetchFoodDiaryItems";
import { MEAL } from "../../constants/commonConstants";

function FoodDiaryScreen({ route }) {
  const mealEntriesRefs = {
    [MEAL.BREAKFAST]: useRef(null),
    [MEAL.LUNCH]: useRef(null),
    [MEAL.DINNER]: useRef(null),
    [MEAL.SNACK]: useRef(null),
    [MEAL.LIQUID_CALORIES]: useRef(null),
  };

  const { isFetchingData, foodHistory, nutriensInfo, getFoodHistory } =
    useFetchFoodDiaryItems({
      mealEntriesRefs,
      mealCategory: route.params?.mealCategory,
    });

  if (isFetchingData) return <LoadingOverlay />;

  return (
    <FoodDiaryContent
      mealEntriesRefs={mealEntriesRefs}
      foodHistory={foodHistory}
      nutriensInfo={nutriensInfo}
      onFoodDeleted={getFoodHistory}
    />
  );
}

export default FoodDiaryScreen;
