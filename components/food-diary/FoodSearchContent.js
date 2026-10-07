import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";

import ScreenContainer from "../UI/ScreenContainer";
import CustomKeyboardAvoidingView from "../UI/CustomKeyboardAvoidingView";
import SearchInput from "../UI/SearchInput";
import FoodTabs from "../../navigation/FoodTabs";
import SearchResultPanel from "./SearchResultPanel";
import { filterFoodDataBySearchText } from "../../utils/foodDiaryUtils";

function FoodSearchContent({
  foodHistoryList,
  foodDataList,
  mealDataList,
  foodDataSearchedList,
  mealDataSearchedList,
  onFoodDataSearchedListChanged,
  onMealDataSearchedListChanged,
  onTabChanged,
  isMealTabOpen = false,
}) {
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const route = useRoute();

  useEffect(() => {
    const hasSearchText = !!searchText?.trim();
    setIsSearching(hasSearchText);

    if (!hasSearchText) {
      onFoodDataSearchedListChanged(foodDataList);
      onMealDataSearchedListChanged(mealDataList);
      return;
    }

    if (!isMealTabOpen) {
      const filteredFoodList = filterFoodDataBySearchText(
        [...foodDataList],
        searchText,
      );
      onFoodDataSearchedListChanged(filteredFoodList);
    } else {
      const filteredMealList = filterFoodDataBySearchText(
        [...mealDataList],
        searchText,
      );
      onMealDataSearchedListChanged(filteredMealList);
    }
  }, [searchText, foodDataList, mealDataList, isMealTabOpen]);

  return (
    <ScreenContainer style={styles.screen}>
      <CustomKeyboardAvoidingView>
        <View style={styles.container}>
          {/* SEARCH INPUT */}
          <SearchInput
            value={searchText}
            placeholder={`Search for ${isMealTabOpen ? "Meal" : "Food"}`}
            style={styles.searchPanel}
            onChange={setSearchText}
          />

          {/* FOOD TABS */}
          {!searchText && !route.params?.isSearchForMealItem && (
            <View style={styles.tabsContainer}>
              <FoodTabs
                onTabChanged={onTabChanged}
                routeName={isMealTabOpen ? "Meal" : "Food"}
              />
            </View>
          )}

          {/* SEARCH RESULT PANEL */}
          <SearchResultPanel
            searchText={searchText}
            foodHistoryList={foodHistoryList}
            foodDataSearchedList={foodDataSearchedList}
            mealDataSearchedList={mealDataSearchedList}
            isSearching={isSearching}
            isMealTabOpen={isMealTabOpen}
          />
        </View>
      </CustomKeyboardAvoidingView>
    </ScreenContainer>
  );
}

export default FoodSearchContent;

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  container: {
    flex: 1,
  },
  searchPanel: {
    marginHorizontal: 4,
  },
  tabsContainer: {
    height: 180,
  },
});
