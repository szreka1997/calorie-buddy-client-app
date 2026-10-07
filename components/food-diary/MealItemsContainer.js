import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Card from "../UI/Card";
import CardTitle from "../UI/CardTitle";
import CustomText from "../UI/CustomText";
import LoggedFoodItem from "./food/LoggedFoodItem";
import { calculateConsumedAmount } from "../../utils/foodDiaryUtils";

function MealItemsContainer({
  noMealItemColor,
  mealData,
  mealItemList,
  foodIdAndQuantityList,
  onDeletePress,
  isCreateAndEditMealScreen = false,
  isMealLogScreen = false,
  accent = false,
}) {
  const navigation = useNavigation();

  function navigateToFoodDetailsScreen(foodData, quantity) {
    navigation.navigate("FoodDetails", {
      consumedGramm: quantity,
      foodData,
      mealData,
      foodIdAndQuantityList,
      isCreateAndEditMealScreen,
      isMealLogScreen,
      isModifying: true,
    });
  }

  return (
    <Card>
      {/* TITLE */}
      <CardTitle accent={accent}>Meal Items</CardTitle>

      {!mealItemList || mealItemList.length === 0 ? (
        // NO MEAL ITEM TEXT
        <View style={styles.textContainer}>
          <CustomText style={[styles.text, { color: noMealItemColor }]}>
            No Meal Item Yet.
          </CustomText>
        </View>
      ) : (
        // MEAL ITEM LIST
        <View>
          {mealItemList?.map((mealItem, index) => {
            return (
              <LoggedFoodItem
                key={index}
                foodHistoryId={index}
                name={mealItem.foodData.name}
                quantity={mealItem.quantity}
                consumedCalories={Math.round(
                  calculateConsumedAmount(
                    mealItem.foodData.kcalPer100G,
                    mealItem.quantity,
                  ),
                )}
                imageUri={mealItem.foodData.imageUri}
                isMealLogScreen={isMealLogScreen}
                accent={accent}
                onPress={navigateToFoodDetailsScreen.bind(
                  this,
                  mealItem.foodData,
                  mealItem.quantity,
                )}
                onDeletePress={onDeletePress}
              />
            );
          })}
        </View>
      )}
    </Card>
  );
}

export default MealItemsContainer;

const styles = StyleSheet.create({
  textContainer: {
    marginTop: 4,
  },
  text: {
    textAlign: "center",
  },
});
