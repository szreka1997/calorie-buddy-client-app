import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

function useMealHeader({ mealData }) {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    if (mealData) {
      navigation.setOptions({ title: "Edit Meal" });
    }
  }, [mealData, navigation]);
}

export default useMealHeader;
