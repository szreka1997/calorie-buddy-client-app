import { useContext, useLayoutEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

import { AlertContext } from "../../contexts/alert-context";

function useFoodSearchByBarcode({ foodDataList, isMealTabOpen = false }) {
  const navigation = useNavigation();
  const route = useRoute();
  const alertCtx = useContext(AlertContext);

  const { mealData, foodIdAndQuantityList, isSearchForMealItem } =
    route.params || {};

  function navigateToFoodDetailsScreen(foodData) {
    navigation.replaceParams({
      ...route?.params,
      barcode: null,
    });
    navigation.navigate("FoodDetails", {
      foodData,
      mealData,
      foodIdAndQuantityList,
      accent: isMealTabOpen,
      isSearchForMealItem,
    });
  }

  useLayoutEffect(() => {
    const barcode = route?.params?.barcode;
    if (barcode) {
      for (var item of foodDataList) {
        if (item.barcode === barcode) {
          navigateToFoodDetailsScreen(item);
          return;
        }
      }
      alertCtx.showAlert({
        title: "This barcode doesn't exist yet!",
        message: `No food is associated yet with the barcode: ${barcode}.`,
        accent: true,
      });

      navigation.setParams({ barcode: undefined });
    }
  }, [foodDataList, route?.params?.barcode]);
}

export default useFoodSearchByBarcode;
