import { View, Pressable, StyleSheet } from "react-native";

import GLOBAL_STYLES from "../../../constants/styleConstants";
import CustomText from "../CustomText";
import { getDynamicColors } from "../../../utils/colorUtils";

function FlatButton({ children, style, onPress, accent = false }) {
  const colors = getDynamicColors(accent);

  return (
    <View style={[styles.outerContrainer, style]}>
      <View style={styles.middleContainer}>
        <Pressable
          android_ripple={{ color: colors.shade50, foreground: true }}
          style={({ pressed }) => pressed && GLOBAL_STYLES.pressed}
          onPress={onPress}
        >
          <View style={[styles.innerContainer]}>
            <CustomText isHighlight accent={accent}>
              {children}
            </CustomText>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

export default FlatButton;

const styles = StyleSheet.create({
  outerContrainer: {
    alignItems: "center",
  },
  middleContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  innerContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
