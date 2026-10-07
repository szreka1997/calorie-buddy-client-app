import { View, StyleSheet } from "react-native";

import CustomText from "../UI/CustomText";

function NutriScoreText({
  children,
  textColor,
  backgroundColor,
  style,
  isSelected = false,
}) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
        style,
        isSelected && styles.highlightContainer,
      ]}
    >
      <CustomText
        isHighlight
        style={[
          styles.text,
          { color: textColor },
          isSelected && styles.highlightText,
        ]}
      >
        {children}
      </CustomText>
    </View>
  );
}

export default NutriScoreText;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    width: 25,
  },
  highlightContainer: {
    height: 55,
    width: 35,
    borderRadius: 12,
    borderColor: "white",
    borderWidth: 3,
  },
  text: {
    fontSize: 20,
  },
  highlightText: {
    fontSize: 30,
    color: "white",
  },
});
