import { View, StyleSheet } from "react-native";

import CardTitle from "../UI/CardTitle";
import Radio from "../form/Radio";
import CustomDialogBase from "./CustomDialogBase";
import { getDynamicColors } from "../../utils/colorUtils";

function RadioDialog({
  title,
  options,
  checkedValue,
  onChange,
  onClose,
  accent = false,
}) {
  const colors = getDynamicColors(accent);

  return (
    <CustomDialogBase onClose={onClose} accent={accent}>
      <View>
        <CardTitle
          style={styles.titleContainer}
          textStyle={[styles.title, { color: colors.shade500 }]}
        >
          {title}
        </CardTitle>

        <Radio
          options={options}
          checkedValue={checkedValue}
          onChange={onChange}
          accent={accent}
        />
      </View>
    </CustomDialogBase>
  );
}

export default RadioDialog;

const styles = StyleSheet.create({
  titleContainer: {
    marginBottom: 15,
  },
  title: {
    textAlign: "center",
  },
});
