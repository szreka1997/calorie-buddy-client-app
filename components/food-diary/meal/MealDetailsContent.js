import { View, ScrollView } from "react-native";

import COLORS from "../../../constants/colorConstants";
import OutlinedButton from "../../UI/custom-buttons/OutlinedButton";
import ScreenContainer from "../../UI/ScreenContainer";
import CustomKeyboardAvoidingView from "../../UI/CustomKeyboardAvoidingView";
import DetailsHeader from "../DetailsHeader";
import NutriensInfoPanel from "../NutriensInfoPanel";
import MealItemsContainer from "../MealItemsContainer";
import LogQuantityCardForMeal from "../LogQuantityCardForMeal";
import useCustomForm from "../../../hooks/useCustomForm";
import { getStartingMealCategory } from "../../../utils/foodDiaryUtils";

function MealDetailsContent({
  mealData,
  mealItemList,
  nutriensInfo,
  foodIdAndQuantityList,
  onSubmit,
}) {
  const startingMeal = getStartingMealCategory();

  const { handleSubmit, methods } = useCustomForm({
    onSubmit,
    accent: true,
    defaultValues: {
      mealCategory: startingMeal,
    },
  });

  return (
    <ScreenContainer>
      {/* DETAILS HEADER */}
      {nutriensInfo && (
        <DetailsHeader
          name={mealData.name}
          calories={nutriensInfo.kcal}
          imageUri={mealData.imageUri}
          nutriScore={mealData.nutriScore}
          isMeal
          accent
        />
      )}

      <CustomKeyboardAvoidingView>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* MEAL CATEGORY */}
          <LogQuantityCardForMeal methods={methods} />

          {/* NUTRIENS INFO PANEL */}
          {mealItemList?.length > 0 && (
            <NutriensInfoPanel nutriensInfo={nutriensInfo} accent />
          )}

          {/* MEAL ITEM CONTAINER */}
          <MealItemsContainer
            mealData={mealData}
            mealItemList={mealItemList}
            foodIdAndQuantityList={foodIdAndQuantityList}
            isMealLogScreen
            accent
          />

          {/* LOG MEAL BUTTON */}
          <OutlinedButton
            icon="journal"
            accent
            style={{ marginTop: 4 }}
            onPress={handleSubmit}
          >
            Log meal
          </OutlinedButton>

          {/* MARGIN */}
          <View style={{ marginBottom: 24 }}></View>
        </ScrollView>
      </CustomKeyboardAvoidingView>
    </ScreenContainer>
  );
}

export default MealDetailsContent;
