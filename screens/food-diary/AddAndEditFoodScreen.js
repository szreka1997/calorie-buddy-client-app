import { useLayoutEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import LoadingOverlay from "../../components/UI/LoadingOverlay";
import AddAndEditFoodContent from "../../components/food-diary/food/AddAndEditFoodContent";
import useAddAndEditFoodSubmit from "../../hooks/food-diary/useAddAndEditFoodSubmit";

function AddAndEditFoodScreen({ navigation, route }) {
  const {
    mealData,
    foodHistoryId,
    consumedGramm,
    foodIdAndQuantityList,
    isModifying,
    isMealLogScreen,
    isSearchForMealItem,
    isCreateAndEditMealScreen,
  } = route.params || {};

  const [foodData, setFoodData] = useState(route.params?.foodData);
  const isFocused = useIsFocused();

  const { isUploading, submit } = useAddAndEditFoodSubmit({
    foodData,
    mealData,
    foodHistoryId,
    consumedGramm,
    foodIdAndQuantityList,
    isModifying,
    isMealLogScreen,
    isSearchForMealItem,
    isCreateAndEditMealScreen,
  });

  useLayoutEffect(() => {
    if (isFocused) {
      const paramsFoodData = route.params?.foodData;
      const paramsBarcode = route.params?.barcode;

      if (paramsFoodData) {
        setFoodData({
          ...paramsFoodData,
          barcode: paramsBarcode ?? paramsFoodData?.barcode,
        });
      }
    } else {
      setFoodData(null);
    }
  }, [isFocused, route.params?.foodData, route.params?.barcode]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: foodData ? "Edit Food" : "Add Food",
    });
  }, [navigation, foodData]);

  return (
    <>
      {isUploading ? (
        <LoadingOverlay message="Uploading data..." />
      ) : (
        <AddAndEditFoodContent
          data={foodData && { ...foodData }}
          onSubmit={submit}
        />
      )}
    </>
  );
}

export default AddAndEditFoodScreen;
