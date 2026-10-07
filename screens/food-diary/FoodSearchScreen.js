import { useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import LoadingOverlay from "../../components/UI/LoadingOverlay";
import FoodSearchContent from "../../components/food-diary/FoodSearchContent";
import useFetchFoodSearchItems from "../../hooks/food-diary/useFetchFoodSearchItems";
import useFoodSearchByBarcode from "../../hooks/food-diary/useFoodSearchByBarcode";

function FoodSearchScreen() {
  const [isMealTabOpen, setIsMealTabOpen] = useState(false);

  const isFocused = useIsFocused();
  const {
    isFetchingData,
    foodHistoryList,
    foodDataList,
    mealDataList,
    foodDataSearchedList,
    mealDataSearchedList,
    setFoodDataSearchedList,
    setMealDataSearchedList,
  } = useFetchFoodSearchItems({
    isFocused,
    isMealTabOpen,
  });
  useFoodSearchByBarcode({ foodDataList, isMealTabOpen });

  if (isFetchingData) return <LoadingOverlay />;

  return (
    <FoodSearchContent
      foodHistoryList={foodHistoryList}
      foodDataList={foodDataList}
      mealDataList={mealDataList}
      foodDataSearchedList={foodDataSearchedList}
      mealDataSearchedList={mealDataSearchedList}
      onFoodDataSearchedListChanged={setFoodDataSearchedList}
      onMealDataSearchedListChanged={setMealDataSearchedList}
      onTabChanged={setIsMealTabOpen}
      isMealTabOpen={isMealTabOpen}
    />
  );
}

export default FoodSearchScreen;
