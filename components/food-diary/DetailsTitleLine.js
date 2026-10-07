import { View, StyleSheet } from "react-native";

import CardTitle from "../UI/CardTitle";
import FoodOrMealImage from "./FoodOrMealImage";
import KcalContainer from "./KcalContainer";

function DetailsTitleLine({
  name,
  calories,
  imageUri,
  isMeal = false,
  accent = false,
}) {
  return (
    <View style={styles.container}>
      {/* IMAGE & TITLE */}
      <View style={styles.imageTitleContainer}>
        <FoodOrMealImage imageUri={imageUri} accent={accent} isDetails />

        {/* TITLE */}
        <CardTitle accent={accent} style={styles.titleContainer}>
          {name}
        </CardTitle>
      </View>

      {/* KCAL */}
      <KcalContainer
        calories={calories}
        isMeal={isMeal}
        accent={accent}
        isDetails
      />
    </View>
  );
}

export default DetailsTitleLine;

const styles = StyleSheet.create({
  container: {
    marginBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  imageTitleContainer: {
    marginRight: 8,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
});
