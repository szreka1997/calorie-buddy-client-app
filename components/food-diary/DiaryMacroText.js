import { StyleSheet } from "react-native";

import CustomText from "../UI/CustomText";

function DiaryMacroText({ label, amount, color }) {
  return (
    <CustomText isHighlight style={[styles.text, { color }]}>
      {label} {amount}g
    </CustomText>
  );
}

export default DiaryMacroText;

const styles = StyleSheet.create({
  text: {
    fontSize: 10,
  },
});
