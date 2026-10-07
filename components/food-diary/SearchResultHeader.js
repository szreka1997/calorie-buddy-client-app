import { useContext } from "react";
import { View, StyleSheet } from "react-native";

import CardTitle from "../UI/CardTitle";
import OutlinedButton from "../UI/custom-buttons/OutlinedButton";
import { MEAL } from "../../constants/commonConstants";
import { RadioContext } from "../../contexts/radio-context";

function SearchResultHeader({
  checkedValue,
  onRadioChanged,
  isSearching = false,
  isMealTabOpen = false,
}) {
  const radioCtx = useContext(RadioContext);

  function radioChangeHandler(value) {
    radioCloseHandler();
    onRadioChanged(value);
  }

  function radioCloseHandler() {
    radioCtx.hideRadio();
  }

  function filterHandler() {
    radioCtx.showRadio({
      title: "Filer By Meals",
      options: [
        {
          label: MEAL.BREAKFAST,
          value: MEAL.BREAKFAST,
        },
        {
          label: MEAL.LUNCH,
          value: MEAL.LUNCH,
        },
        {
          label: MEAL.DINNER,
          value: MEAL.DINNER,
        },
        {
          label: MEAL.SNACK,
          value: MEAL.SNACK,
        },
        {
          label: MEAL.LIQUID_CALORIES,
          value: MEAL.LIQUID_CALORIES,
        },
      ],
      checkedValue,
      accent: !isMealTabOpen,
      onChange: radioChangeHandler,
      onCloseByBackButton: radioCloseHandler,
    });
  }

  return (
    <View style={styles.container}>
      {/* TITLE */}
      <CardTitle accent={isMealTabOpen}>
        {isSearching
          ? "Search Result"
          : isMealTabOpen
            ? "My Meals"
            : "Food History"}
      </CardTitle>

      {/* FILTER BUTTON */}
      {!isSearching && !isMealTabOpen && (
        <OutlinedButton
          icon="filter"
          fontSize={12}
          iconSize={16}
          onPress={filterHandler}
          accent
        >
          {checkedValue}
        </OutlinedButton>
      )}
    </View>
  );
}

export default SearchResultHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
});
