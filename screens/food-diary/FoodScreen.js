import { Dimensions } from "react-native";

import FoodCategoryButtonsBar from "../../components/food-diary/FoodCategoryButtonsBar";
import FoodCategoryButton from "../../components/food-diary/FoodCategoryButton";

function FoodScreen({ navigation }) {
  const screenWidth = Dimensions.get("screen").width;

  function navigateToAddFoodScreen() {
    navigation.navigate("AddAndEditFood");
  }

  function navigateToCameraScreen() {
    navigation.navigate("Camera", {
      isSearchingForFood: true,
    });
  }

  return (
    <FoodCategoryButtonsBar>
      {/* ADD A FOOD */}
      <FoodCategoryButton
        source={require("../../assets/images/add-food-image.png")}
        width={screenWidth / 2 - 8}
        onPress={navigateToAddFoodScreen}
      >
        Add a food
      </FoodCategoryButton>

      {/* SCAN A BARCODE */}
      <FoodCategoryButton
        source={require("../../assets/images/barcode-image.png")}
        width={screenWidth / 2 - 8}
        onPress={navigateToCameraScreen}
      >
        Scan a barcode
      </FoodCategoryButton>
    </FoodCategoryButtonsBar>
  );
}

export default FoodScreen;
