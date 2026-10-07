import { useContext } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import ScreenContainer from "../../UI/ScreenContainer";
import IconButton from "../../UI/custom-buttons/IconButton";
import CalorieAndMacrosProgressBarCard from "../CalorieAndMacrosProgressBarCard";
import FoodDiaryDatePicker from "../FoodDiaryDatePicker";
import MealEntriesPanel from "../MealEntriesPanel";
import SugarPanel from "../SugarPanel";
import { UserContext } from "../../../contexts/user-context";
import { sumDictElements } from "../../../utils/helperFunctions";

function FoodDiaryContent({
  mealEntriesRefs,
  foodHistory,
  nutriensInfo,
  onFoodDeleted,
}) {
  const navigation = useNavigation();
  const userCtx = useContext(UserContext);

  const userData = userCtx.userData;
  const macrosInGramm = userCtx.macrosInGramm;

  function navigateToFoodSearchScreen() {
    navigation.navigate("FoodSearch");
  }

  return (
    <ScreenContainer disableSafeAreaView>
      {/* DATE PICKER */}
      <FoodDiaryDatePicker />

      {/* CALORIES AND MACROS */}
      <CalorieAndMacrosProgressBarCard
        consumedCalories={sumDictElements(nutriensInfo.kcal)}
        consumedProtein={sumDictElements(nutriensInfo.protein)}
        consumedCarbs={sumDictElements(nutriensInfo.carbs)}
        consumedFat={sumDictElements(nutriensInfo.fat)}
        // So that when it arrives here, it doesn’t divide by zero before being displayed
        maxCalories={userData?.goalCalories || 1}
        maxProtein={macrosInGramm?.proteinInGramm || 1}
        maxCarbs={macrosInGramm?.carbsInGramm || 1}
        maxFat={macrosInGramm?.fatInGramm || 1}
        style={styles.macrosContainer}
        accent
      />

      <ScrollView>
        {/* MEAL ENTRIES */}
        <MealEntriesPanel
          mealEntriesRefs={mealEntriesRefs}
          foodHistory={foodHistory}
          nutriensInfo={nutriensInfo}
          onFoodDeleted={onFoodDeleted}
        />

        {/* SUGAR PANEL */}
        <SugarPanel
          sugar={nutriensInfo.sugar}
          addedSugar={nutriensInfo.addedSugar}
          goalCalories={userData?.goalCalories}
        />

        {/* Margin */}
        <View style={{ height: 70 }}></View>
      </ScrollView>

      {/* ADD BUTTON */}
      <View style={styles.floatingButtonContainer}>
        <IconButton
          icon="add"
          iconSize={30}
          borderWidth={2}
          shouldAndroidRipple
          useBackgroundColor
          accent
          onPress={navigateToFoodSearchScreen}
        />
      </View>
    </ScreenContainer>
  );
}

export default FoodDiaryContent;

const styles = StyleSheet.create({
  macrosContainer: {
    marginTop: 4,
    marginBottom: 8,
  },
  floatingButtonContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    bottom: 20,
    right: 20,
    borderRadius: 30,
  },
});
