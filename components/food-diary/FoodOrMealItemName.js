import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";

import CustomText from "../UI/CustomText";
import { getDynamicColors } from "../../utils/colorUtils";
import { getHighlightTextsFromFoodNameAndSearchText } from "../../utils/foodDiaryUtils";

function FoodOrMealItemName({ searchText, name, accent = false }) {
  const [highlightText, setHighlightText] = useState();

  const inverseColors = getDynamicColors(!accent);

  useEffect(() => {
    setHighlightText(
      getHighlightTextsFromFoodNameAndSearchText({ name, searchText }),
    );
  }, [name, searchText]);

  return (
    <>
      {highlightText ? (
        <CustomText accent={accent} style={styles.text}>
          {highlightText.preHighlightText}
          <CustomText
            accent={!accent}
            style={{ backgroundColor: inverseColors.shade700 }}
          >
            {highlightText.highlightText}
          </CustomText>
          {highlightText.postHightlightText}
        </CustomText>
      ) : (
        <CustomText accent={accent} style={styles.text}>
          {name}
        </CustomText>
      )}
    </>
  );
}

export default FoodOrMealItemName;

const styles = StyleSheet.create({
  text: {
    flex: 1,
    marginLeft: 8,
    fontSize: 12,
  },
});
