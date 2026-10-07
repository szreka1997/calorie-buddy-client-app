import { useContext, useState, useLayoutEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useIsFocused, useNavigation } from "@react-navigation/native";

import COLORS from "../../../constants/colorConstants";
import IconButton from "../../UI/custom-buttons/IconButton";
import OutlinedButton from "../../UI/custom-buttons/OutlinedButton";
import LoadingOverlay from "../../UI/LoadingOverlay";
import CustomScrollView from "../../UI/CustomScrollView";
import ImagePickerContent from "../ImagePickerContent";
import MealItemsContainer from "../MealItemsContainer";
import NutriensInfoPanel from "../NutriensInfoPanel";
import CreateAndEditMealForm from "./CreateAndEditMealForm";
import useCustomForm from "../../../hooks/useCustomForm";
import useMealHeader from "../../../hooks/food-diary/useMealHeader";
import useFetchMealItems from "../../../hooks/food-diary/useFetchMealItems";
import { AlertContext } from "../../../contexts/alert-context";
import { getDynamicColors } from "../../../utils/colorUtils";
import {
  validateMealItems,
  getStringRepresentationOfNutriScoreFromNumber,
} from "../../../utils/foodDiaryUtils";

function CreateAndEditMealContent({
  mealData,
  foodIdAndQuantityList,
  onSubmit,
}) {
  const colors = getDynamicColors(!!mealData);

  const [pickedImage, setPickedImage] = useState();
  const [pickedImageUri, setPickedImageUri] = useState(mealData?.imageUri);
  const [noMealItemColor, setNoMealItemColor] = useState(colors.shade500);
  const [localFoodIdAndQuantityList, setLocalFoodIdAndQuantityList] = useState(
    foodIdAndQuantityList,
  );

  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const alertCtx = useContext(AlertContext);

  useMealHeader({ mealData });

  const { isFetchingData, mealItemList, nutriensInfo } = useFetchMealItems({
    foodIdAndQuantityList: localFoodIdAndQuantityList,
    setFoodIdAndQuantityList: setLocalFoodIdAndQuantityList,
    isFocused,
    accent: !mealData,
    isCreateAndEditMealScreen: true,
  });

  function submitHandler(values) {
    const validation = validateMealItems(localFoodIdAndQuantityList);
    if (!validation.valid) {
      setNoMealItemColor(COLORS.ERROR_500);
      alertCtx.showAlert({ message: validation.error, accent: true });
      return;
    }

    onSubmit({
      name: values.name,
      kcal: nutriensInfo.kcal,
      image: pickedImage,
      imageUri: pickedImageUri,
      imageDeleteUri: mealData?.imageDeleteUri,
      foodIdAndQuantityList: localFoodIdAndQuantityList,
      nutriScore: getStringRepresentationOfNutriScoreFromNumber(
        nutriensInfo.nutriScore,
      ),
    });
  }

  const { handleSubmit, methods } = useCustomForm({
    onSubmit: submitHandler,
    accent: true,
    defaultValues: {
      name: mealData?.name || "",
    },
  });

  function navigateToFoodSearchScreen() {
    navigation.navigate("FoodSearch", {
      mealData,
      isSearchForMealItem: true,
      foodIdAndQuantityList: localFoodIdAndQuantityList,
    });
  }

  function deleteHandler({ id }) {
    setLocalFoodIdAndQuantityList((prev) => prev.filter((_, i) => i !== id));
  }

  useLayoutEffect(() => {
    setLocalFoodIdAndQuantityList(foodIdAndQuantityList);
  }, [foodIdAndQuantityList]);

  if (isFetchingData) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <CustomScrollView>
        {/* IMAGE PANEL */}
        <ImagePickerContent
          imageUri={pickedImage || pickedImageUri}
          accent={!!mealData}
          onChange={(image) => {
            setPickedImage(image);
            if (!image) setPickedImageUri(null);
          }}
        />

        {/* INPUT */}
        <CreateAndEditMealForm methods={methods} accent={!!mealData} />

        {/* NUTRIENS INFOS */}
        {mealItemList?.length > 0 && (
          <NutriensInfoPanel nutriensInfo={nutriensInfo} accent={!!mealData} />
        )}

        {/* MEAL ITEMS */}
        <MealItemsContainer
          mealData={mealData}
          mealItemList={mealItemList}
          foodIdAndQuantityList={localFoodIdAndQuantityList}
          noMealItemColor={noMealItemColor}
          isCreateAndEditMealScreen
          accent={!!mealData}
          onDeletePress={deleteHandler}
        ></MealItemsContainer>

        {/* SAVE BUTTON */}
        <OutlinedButton
          icon="save"
          accent={!mealData}
          style={{ marginTop: 4 }}
          onPress={handleSubmit}
        >
          Save Meal
        </OutlinedButton>

        {/* MARGIN */}
        <View style={{ height: 60 }}></View>
      </CustomScrollView>

      {/* ADD BUTTON */}
      <View style={styles.floatingButtonContainer}>
        <IconButton
          icon="add"
          iconSize={30}
          borderWidth={2}
          accent={!mealData}
          useBackgroundColor
          shouldAndroidRipple
          onPress={navigateToFoodSearchScreen}
        />
      </View>
    </View>
  );
}

export default CreateAndEditMealContent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 50,
    right: 20,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
