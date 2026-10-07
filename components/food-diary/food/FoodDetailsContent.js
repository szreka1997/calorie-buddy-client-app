import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import CustomScrollView from "../../UI/CustomScrollView";
import OutlinedButton from "../../UI/custom-buttons/OutlinedButton";
import LogQuantityCard from "../../food-diary/LogQuantityCard";
import DetailsHeader from "../../food-diary/DetailsHeader";
import NutriensInfoPanel from "../NutriensInfoPanel";
import useCustomForm from "../../../hooks/useCustomForm";
import { MAX_QUANTITY } from "../../../constants/validationConstants";
import {
  getStartingMealCategory,
  getQuantityFromIdAndQuantityList,
  getNutritionInfoFromFoodAndQuantity,
} from "../../../utils/foodDiaryUtils";

function FoodDetailsContent({
  foodData,
  foodHistoryMealCategory,
  consumedGramm,
  foodIdAndQuantityList,
  onSubmit,
  isModifying = false,
  isMealLogScreen = false,
  isSearchForMealItem = false,
  isCreateAndEditMealScreen = false,
  accent = false,
}) {
  const startingMeal = getStartingMealCategory();

  const [quantity, setQuantity] = useState(
    consumedGramm || foodData.recommendedServingSize.toString(),
  );

  const { handleSubmit, methods } = useCustomForm({
    onSubmit,
    accent,
    defaultValues: {
      quantity:
        quantity?.toString() ||
        getQuantityFromIdAndQuantityList(foodIdAndQuantityList, foodData.id),
      mealCategory: foodHistoryMealCategory || startingMeal,
    },
  });

  const { watch } = methods;

  useEffect(() => {
    const { unsubscribe } = watch((value, { name }) => {
      if (name === "quantity") setQuantity(value.quantity);
    });
    return () => unsubscribe();
  }, [watch]);

  return (
    <CustomScrollView>
      {/* DETAILS HEADER */}
      <DetailsHeader
        name={foodData.name}
        calories={foodData.kcalPer100G}
        imageUri={foodData.imageUri}
        isVerified={foodData.isVerified}
        nutriScore={foodData.nutriScore}
        accent={accent}
      />

      {/* FORM PANEL */}
      <LogQuantityCard
        methods={methods}
        recommendedServingSize={foodData.recommendedServingSize}
        isMealLogScreen={isMealLogScreen}
        isSearchForMealItem={isSearchForMealItem}
        isCreateAndEditMealScreen={isCreateAndEditMealScreen}
        accent={accent}
      />

      {/* MACROS & SUGAR PANEL */}
      {quantity &&
        parseInt(quantity) > 0 &&
        parseInt(quantity) <= MAX_QUANTITY && (
          <NutriensInfoPanel
            nutriensInfo={getNutritionInfoFromFoodAndQuantity({
              food: foodData,
              quantity,
            })}
            accent={accent}
          />
        )}

      {/* LOG FOOD BUTTON */}
      <View style={styles.buttonContainer}>
        <OutlinedButton icon="journal" accent={!accent} onPress={handleSubmit}>
          {isModifying
            ? "Modify Food"
            : isSearchForMealItem
              ? "Add Food"
              : "Log Food"}
        </OutlinedButton>
      </View>
    </CustomScrollView>
  );
}

export default FoodDetailsContent;

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 4,
  },
});
