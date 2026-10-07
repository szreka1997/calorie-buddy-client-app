import { View, StyleSheet } from "react-native";

import CustomText from "./CustomText";

function HorizontalTextWithNoInput({ label, value, style, accent = false }) {
  return (
    <View style={[styles.container, style]}>
      <CustomText accent={accent} style={styles.boldText}>
        {label}
      </CustomText>
      <CustomText isHighlight accent={accent}>
        {value}
      </CustomText>
    </View>
  );
}

export default HorizontalTextWithNoInput;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
    marginVertical: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  boldText: {
    fontWeight: "bold",
  },
});
