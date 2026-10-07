import { View, StyleSheet, Image, Pressable } from "react-native";

import CustomText from "../UI/CustomText";
import { getDynamicColors } from "../../utils/colorUtils";

function FoodCategoryButton({
  children,
  source,
  width,
  onPress,
  accent = false,
}) {
  const colors = getDynamicColors(accent);

  return (
    <View style={[styles.container, { width }]}>
      <Pressable
        style={({ pressed }) => pressed && styles.pressed}
        onPress={onPress}
      >
        <View style={[styles.innerContainer, { borderColor: colors.shade100 }]}>
          <Image source={source} style={styles.image} />
          <CustomText accent={accent}>{children}</CustomText>
        </View>
      </Pressable>
    </View>
  );
}

export default FoodCategoryButton;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    height: 100,
    backgroundColor: "black",
    borderRadius: 12,
  },
  innerContainer: {
    paddingHorizontal: 4,
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 12,
    elevation: 5,
  },
  image: {
    height: 50,
    width: 50,
  },
  pressed: {
    opacity: 0.5,
  },
});
