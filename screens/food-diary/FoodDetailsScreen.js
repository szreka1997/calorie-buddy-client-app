import LoadingOverlay from "../../components/UI/LoadingOverlay";
import FoodDetailsContent from "../../components/food-diary/food/FoodDetailsContent";
import useLogFoodSubmit from "../../hooks/food-diary/useLogFoodSubmit";
import useFoodHeader from "../../hooks/food-diary/useFoodHeader";

function FoodDetailsScreen({ route }) {
  const {
    foodData,
    mealData,
    foodHistoryId,
    foodHistoryMealCategory,
    consumedGramm,
    foodIdAndQuantityList,
    isModifying = false,
    isMealLogScreen = false,
    isSearchForMealItem = false,
    isCreateAndEditMealScreen = false,
    accent = false,
  } = route.params;
  const commonParams = {
    foodData,
    mealData,
    foodHistoryId,
    foodIdAndQuantityList,
    isModifying,
    isMealLogScreen,
    isSearchForMealItem,
    isCreateAndEditMealScreen,
  };

  useFoodHeader({
    foodData,
    params: {
      ...commonParams,
      consumedGramm,
    },
  });
  const { isUploading, submit } = useLogFoodSubmit({ ...commonParams });

  if (isUploading) return <LoadingOverlay message="Logging Food..." />;

  return (
    <FoodDetailsContent
      foodData={foodData}
      foodHistoryMealCategory={foodHistoryMealCategory}
      consumedGramm={consumedGramm}
      foodIdAndQuantityList={foodIdAndQuantityList}
      isModifying={isModifying}
      isMealLogScreen={isMealLogScreen}
      isSearchForMealItem={isSearchForMealItem}
      isCreateAndEditMealScreen={isCreateAndEditMealScreen}
      accent={accent}
      onSubmit={submit}
    />
  );
}

export default FoodDetailsScreen;
