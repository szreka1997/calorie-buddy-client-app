import { useState } from "react";
import { StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import CustomText from "../UI/CustomText";
import { getDateShortStringFormat } from "../../utils/dateUtils";
import { getHorizontalInputValueTextColor } from "../../utils/colorUtils";
import { getDisplayTextForHorizontalDateInput } from "../../utils/formUtils";

function DateInput({
  value,
  placeholderText,
  show,
  onChangeDate,
  isTouched = false,
  accent = false,
}) {
  const today = new Date(getDateShortStringFormat(new Date()));
  const valueTextColor = getHorizontalInputValueTextColor(
    value,
    isTouched,
    accent,
  );

  const [date, setDate] = useState(value || today);

  function changeHandler(event, selectedDate) {
    setDate(selectedDate);
    onChangeDate(event, selectedDate);
  }

  return (
    <>
      {/* PLACEHOLDER / VALUE TEXT */}
      <CustomText isHighlight style={[styles.text, { color: valueTextColor }]}>
        {getDisplayTextForHorizontalDateInput(
          placeholderText,
          value,
          date,
          isTouched,
        )}
      </CustomText>

      {/* POP UP */}
      {show && (
        <DateTimePicker
          value={date}
          mode={"date"}
          is24Hour={true}
          minimumDate={new Date("1925-01-01")}
          maximumDate={today}
          onChange={changeHandler}
        />
      )}
    </>
  );
}

export default DateInput;

const styles = StyleSheet.create({
  text: {
    marginHorizontal: 12,
  },
});
