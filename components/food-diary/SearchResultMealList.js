import { FlatList } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

import FoodOrMealItem from "./FoodOrMealItem";
import EmptyComponentText from "./EmptyComponentText";

function SearchResultMealList({
  searchText,
  mealDataSearchedList,
  isMealTabOpen = false,
}) {
  const navigation = useNavigation();

  function navigateToMealDetailsScreen(mealData) {
    navigation.navigate("MealDetails", {
      mealData,
      accent: true,
    });
  }

  function renderMealItem({ item }) {
    return (
      <FoodOrMealItem
        searchText={searchText}
        name={item.name}
        imageUri={item.imageUri}
        onPress={navigateToMealDetailsScreen.bind(this, item)}
        isMeal
        accent
      />
    );
  }

  return (
    <>
      {isMealTabOpen && (
        <FlatList
          keyExtractor={(item) => item.id}
          data={mealDataSearchedList}
          showsVerticalScrollIndicator={false}
          renderItem={renderMealItem}
          ListEmptyComponent={() => (
            <EmptyComponentText
              message={
                searchText
                  ? `No meal found with this name: ${searchText}`
                  : "You don't have any meal item yet."
              }
              accent
            />
          )}
        />
      )}
    </>
  );
}

export default SearchResultMealList;
