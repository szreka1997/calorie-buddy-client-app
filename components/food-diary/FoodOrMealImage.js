import { Image } from "react-native";

import { getFoodImageSource } from "../../utils/foodDiaryUtils";
import { getFoodOrMealImageStyle } from "../../utils/styleUtils";

function FoodOrMealImage({ imageUri, accent = false, isDetails = false }) {
  return (
    <Image
      source={getFoodImageSource(imageUri, accent)}
      style={getFoodOrMealImageStyle(isDetails, accent)}
    />
  );
}

export default FoodOrMealImage;
