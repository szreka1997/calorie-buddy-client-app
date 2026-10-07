import { StyleSheet, View } from "react-native";

import CustomText from "./CustomText";
import { getDynamicColors } from "../../utils/colorUtils";

function CardTitle({ children, textStyle, style, accent = false }) {
  const colors = getDynamicColors(accent);

  return (
    <View style={[styles.constainer, style]}>
      <CustomText
        isHighlight
        style={[styles.text, { color: colors.shade100 }, textStyle]}
      >
        {children}
      </CustomText>
    </View>
  );
}

export default CardTitle;

const styles = StyleSheet.create({
  constainer: {
    marginBottom: 4,
  },
  text: {
    fontSize: 18,
  },
});
