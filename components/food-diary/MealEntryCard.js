import { useImperativeHandle } from "react";
import { StyleSheet, View } from "react-native";

import Card from "../UI/Card";
import CardTitle from "../UI/CardTitle";
import KcalContainer from "./KcalContainer";
import DiaryMacrosPanel from "./DiaryMacrosPanel";
import useCollapsible from "../../hooks/food-diary/useCollapsible";
import CollapsibleButton from "./CollapsibleButton";

const MealEntryCard = ({
  ref,
  mealName,
  mealCalories,
  mealProtein,
  mealCarbs,
  mealFat,
  children,
  style,
  accent = false,
}) => {
  const { isOpen, openCollapsible, toggle } = useCollapsible();

  useImperativeHandle(
    ref,
    () => ({
      openCollapsible,
    }),
    [openCollapsible],
  );

  return (
    <Card style={style}>
      {/* HEADER */}
      <View style={styles.rowLayout}>
        {/* COLLAPSIBLE BUTTON */}
        <CollapsibleButton isOpen={isOpen} onPress={toggle} />

        <View style={styles.headerInnerContainer}>
          {/* MEAL NAME */}
          <CardTitle
            style={styles.headerTextContainer}
            textStyle={styles.headerText}
          >
            {mealName}
          </CardTitle>

          <View style={styles.rowLayout}>
            {/* CALORIES */}
            <KcalContainer
              calories={mealCalories}
              accent={accent}
              isLoggedFood
            />

            {/* MACROS */}
            <DiaryMacrosPanel
              protein={mealProtein}
              carbs={mealCarbs}
              fat={mealFat}
            />
          </View>
        </View>
      </View>

      {/* COLLAPSIBLE SECTION */}
      {isOpen && <View>{children}</View>}
    </Card>
  );
};

export default MealEntryCard;

const styles = StyleSheet.create({
  rowLayout: {
    flexDirection: "row",
  },
  headerInnerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTextContainer: {
    justifyContent: "center",
  },
  headerText: {
    fontSize: 16,
  },
});
