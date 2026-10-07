import { FlatList } from "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";

import FoodOrMealItem from "./FoodOrMealItem";
import EmptyComponentText from "./EmptyComponentText";

function SearchResultFoodList({
  searchText,
  selectedMealCategory,
  foodHistoryList,
  foodDataSearchedList,
  isSearching = false,
  isMealTabOpen = false,
}) {
  const navigation = useNavigation();
  const route = useRoute();
  const { mealData, foodIdAndQuantityList, isSearchForMealItem } =
    route.params || {};

  function navigateToFoodDetailsScreen(foodData) {
    navigation.replaceParams({
      ...route.params,
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

  function renderFoodItem({ item }) {
    return (
      <FoodOrMealItem
        searchText={searchText}
        name={item.name}
        kcalPer100G={item.kcalPer100G}
        imageUri={item.imageUri}
        isVerified={item.isVerified}
        accent={false}
        onPress={navigateToFoodDetailsScreen.bind(this, item)}
      />
    );
  }

  return (
    <>
      {/* FOOD HISTORY LIST */}
      {!isSearching && !isMealTabOpen && (
        <FlatList
          keyExtractor={(item) => item.id}
          data={foodHistoryList[selectedMealCategory]}
          showsVerticalScrollIndicator={false}
          renderItem={renderFoodItem}
          ListEmptyComponent={() => (
            <EmptyComponentText
              message={`You don't have any ${selectedMealCategory} food history item yet.`}
            />
          )}
        />
      )}

      {/* FULL FOOD LIST */}
      {isSearching && !isMealTabOpen && (
        <FlatList
          keyExtractor={(item) => item.id}
          data={foodDataSearchedList}
          showsVerticalScrollIndicator={false}
          renderItem={renderFoodItem}
          ListEmptyComponent={() => (
            <EmptyComponentText
              message={`No food found with this name: ${searchText}`}
            />
          )}
        />
      )}
    </>
  );
}

export default SearchResultFoodList;
