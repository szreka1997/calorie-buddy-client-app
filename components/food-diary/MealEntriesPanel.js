import { useContext } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import MealEntryCard from "./MealEntryCard";
import LoggedFoodItem from "./food/LoggedFoodItem";
import { MEAL } from "../../constants/commonConstants";
import { AuthContext } from "../../contexts/auth-context";
import { DateContext } from "../../contexts/date-context";
import { AlertContext } from "../../contexts/alert-context";
import * as FoodHistoryService from "../../services/food-history-service";

function MealEntriesPanel({
  mealEntriesRefs,
  foodHistory,
  nutriensInfo,
  onFoodDeleted,
}) {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const dateCtx = useContext(DateContext);
  const alertCtx = useContext(AlertContext);

  function navigateToFoodDetailsScreen({
    foodData,
    foodHistoryId,
    consumedGramm,
    mealCategory,
  }) {
    navigation.navigate("FoodDetails", {
      foodData,
      foodHistoryId,
      consumedGramm,
      foodHistoryMealCategory: mealCategory,
    });
  }

  async function deleteLoggedFoodHandler({ id, mealCategory }) {
    try {
      const { token } = await authCtx.getTokenAndId();
      await FoodHistoryService.deleteFoodHistoryItem({
        token,
        foodHistoryId: id,
      });
      await onFoodDeleted({ date: dateCtx.date, mealCategory });
    } catch (error) {
      alertCtx.showAlert({ accent: true, error });
    }
  }

  function renderLogFoodItems(foodHistoryArray) {
    return (
      <View>
        {foodHistoryArray?.map((foodHistory, index) => {
          const foodData = {
            id: foodHistory.id,
            userId: foodHistory.userId,
            name: foodHistory.name,
            barcode: foodHistory.barcode,
            imageUri: foodHistory.imageUri,
            imageDeleteUri: foodHistory.imageDeleteUri,
            isVerified: foodHistory.isVerified,
            nutriScore: foodHistory.nutriScore,
            kcalPer100G: foodHistory.kcalPer100G,
            proteinPer100G: foodHistory.proteinPer100G,
            carbsPer100G: foodHistory.carbsPer100G,
            fatPer100G: foodHistory.fatPer100G,
            sugarPer100G: foodHistory.sugarPer100G,
            addedSugarPer100G: foodHistory.addedSugarPer100G,
            recommendedServingSize: foodHistory.recommendedServingSize,
          };

          return (
            <LoggedFoodItem
              key={index}
              foodHistoryId={foodHistory.foodHistoryId}
              name={foodHistory.name}
              quantity={foodHistory.consumedGramm}
              consumedCalories={foodHistory.kcal}
              mealCategory={foodHistory.mealCategory}
              imageUri={foodHistory.imageUri}
              onPress={navigateToFoodDetailsScreen.bind(this, {
                foodData,
                foodHistoryId: foodHistory.foodHistoryId,
                consumedGramm: foodHistory.consumedGramm,
                mealCategory: foodHistory.mealCategory,
              })}
              onDeletePress={deleteLoggedFoodHandler}
            />
          );
        })}
      </View>
    );
  }

  return (
    <View>
      {Object.values(MEAL).map((meal, index) => (
        <MealEntryCard
          key={meal}
          ref={mealEntriesRefs[meal]}
          mealName={meal}
          mealCalories={nutriensInfo.kcal[meal]}
          mealProtein={nutriensInfo.protein[meal]}
          mealCarbs={nutriensInfo.carbs[meal]}
          mealFat={nutriensInfo.fat[meal]}
          style={index === 0 && { marginTop: 0 }}
        >
          {renderLogFoodItems(foodHistory[meal])}
        </MealEntryCard>
      ))}
    </View>
  );
}

export default MealEntriesPanel;
