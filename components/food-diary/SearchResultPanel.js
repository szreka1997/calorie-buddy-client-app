import { useState } from "react";
import { StyleSheet } from "react-native";

import Card from "../UI/Card";
import SearchResultHeader from "./SearchResultHeader";
import SearchResultFoodList from "./SearchResultFoodList";
import SearchResultMealList from "./SearchResultMealList";
import { getStartingMealCategory } from "../../utils/foodDiaryUtils";

function SearchResultPanel({
  searchText,
  foodHistoryList,
  foodDataSearchedList,
  mealDataSearchedList,
  isSearching = false,
  isMealTabOpen = false,
}) {
  const [selectedMealCategory, setSelectedMealCategory] = useState(
    getStartingMealCategory(),
  );

  return (
    <Card accent={isMealTabOpen} style={styles.container}>
      {/* HEADER */}
      <SearchResultHeader
        checkedValue={selectedMealCategory}
        isSearching={isSearching}
        isMealTabOpen={isMealTabOpen}
        onRadioChanged={setSelectedMealCategory}
      />

      {/* FOOD LIST */}
      <SearchResultFoodList
        searchText={searchText}
        selectedMealCategory={selectedMealCategory}
        foodHistoryList={foodHistoryList}
        foodDataSearchedList={foodDataSearchedList}
        isSearching={isSearching}
        isMealTabOpen={isMealTabOpen}
      />

      {/* MEAL LIST */}
      <SearchResultMealList
        searchText={searchText}
        mealDataSearchedList={mealDataSearchedList}
        isMealTabOpen={isMealTabOpen}
      />
    </Card>
  );
}

export default SearchResultPanel;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 4,
    marginTop: 4,
  },
});
