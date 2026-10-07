import { StyleSheet, View } from "react-native";

import CustomText from "./CustomText";

function Title({ children, textStyle, style, accent = false }) {
  return (
    <View style={[styles.container, style]}>
      <CustomText isHighlight accent={accent} style={[styles.title, textStyle]}>
        {children}
      </CustomText>
    </View>
  );
}

export default Title;

const styles = StyleSheet.create({
  container: {
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
});
