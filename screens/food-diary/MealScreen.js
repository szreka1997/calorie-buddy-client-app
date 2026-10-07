import { Dimensions } from "react-native";

import FoodCategoryButton from "../../components/food-diary/FoodCategoryButton";
import FoodCategoryButtonsBar from "../../components/food-diary/FoodCategoryButtonsBar";

function MealScreen({ navigation }) {
  const screenWidth = Dimensions.get("screen").width;

  function navigateToMealScreen() {
    navigation.navigate("CreateAndEditMeal");
  }

  return (
    <FoodCategoryButtonsBar accent>
      <FoodCategoryButton
        source={require("../../assets/images/add-meal-image.png")}
        width={screenWidth / 2 - 8}
        onPress={navigateToMealScreen}
        accent
      >
        Add a meal
      </FoodCategoryButton>
    </FoodCategoryButtonsBar>
  );
}

export default MealScreen;
