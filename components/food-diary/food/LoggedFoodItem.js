import { View, StyleSheet } from "react-native";

import IconButton from "../../UI/custom-buttons/IconButton";
import FoodOrMealItem from "../FoodOrMealItem";

function LoggedFoodItem({
  foodHistoryId,
  name,
  quantity,
  consumedCalories,
  imageUri,
  mealCategory,
  style,
  onPress,
  onDeletePress,
  isMealLogScreen = false,
  accent = false,
}) {
  return (
    <View style={[styles.constainer, style]}>
      <FoodOrMealItem
        name={name}
        quantity={quantity}
        consumedCalories={consumedCalories}
        imageUri={imageUri}
        accent={accent}
        isLoggedFood
        onPress={onPress}
        style={styles.foodOrMealItem}
      />
      {!isMealLogScreen && (
        <View style={styles.iconContainer}>
          <IconButton
            icon="close"
            iconSize={30}
            accent={!accent}
            style={styles.iconButton}
            onPress={() => {
              onDeletePress({ id: foodHistoryId, mealCategory });
            }}
          />
        </View>
      )}
    </View>
  );
}

export default LoggedFoodItem;

const styles = StyleSheet.create({
  constainer: {
    flexDirection: "row",
  },
  foodOrMealItem: {
    flex: 1,
  },
  iconContainer: {
    justifyContent: "center",
  },
  iconButton: {
    width: 30,
    height: 30,
  },
});
