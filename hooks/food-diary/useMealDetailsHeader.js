import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

import IconButton from "../../components/UI/custom-buttons/IconButton";

function useMealDetailsHeader({ mealData, foodIdAndQuantityList }) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          icon="pencil-sharp"
          iconSize={28}
          accent
          onPressOut={() => {
            navigation.navigate("CreateAndEditMeal", {
              mealData,
              foodIdAndQuantityList,
            });
          }}
        />
      ),
    });
  }, [navigation, mealData, foodIdAndQuantityList]);
}

export default useMealDetailsHeader;
