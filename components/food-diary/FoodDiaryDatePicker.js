import { useContext, useState } from "react";
import { StyleSheet, View } from "react-native";

import CardTitle from "../../components/UI/CardTitle";
import IconButton from "../../components/UI/custom-buttons/IconButton";
import { DateContext } from "../../contexts/date-context";
import { getFoodDiaryDateText, getNeighbourDate } from "../../utils/dateUtils";

function FoodDiaryDatePicker() {
  const dateCtx = useContext(DateContext);

  const [dateText, setDateText] = useState(
    getFoodDiaryDateText({ date: dateCtx.date }),
  );

  function changeDate(offset) {
    let date;
    dateCtx.setDate((prevDate) => {
      date = getNeighbourDate({ prevDate, offset });
      return date;
    });
    setDateText(() => getFoodDiaryDateText({ date }));
  }

  return (
    <View style={styles.container}>
      {/* PREV BUTTON */}
      <IconButton
        icon="chevron-back"
        iconSize={30}
        onPress={changeDate.bind(this, -1)}
        style={styles.icon}
      ></IconButton>

      {/* DATE TEXT */}
      <View style={styles.titleContainer}>
        <CardTitle textStyle={styles.text}>{dateText}</CardTitle>
      </View>

      {/* NEXT BUTTON */}
      <IconButton
        icon="chevron-forward"
        iconSize={30}
        onPress={changeDate.bind(this, 1)}
        style={styles.icon}
      ></IconButton>
    </View>
  );
}

export default FoodDiaryDatePicker;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    marginHorizontal: 12,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 35,
    height: 35,
  },
});
