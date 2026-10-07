import { View, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import COLORS from "../../constants/colorConstants";
import CustomText from "../UI/CustomText";
import KcalContainer from "./KcalContainer";
import FoodOrMealImage from "./FoodOrMealImage";
import FoodOrMealItemName from "./FoodOrMealItemName";
import { getPressedStyle } from "../../utils/styleUtils";
import { getDynamicColors } from "../../utils/colorUtils";

function FoodOrMealItem({
  searchText,
  name,
  quantity,
  kcalPer100G,
  consumedCalories,
  imageUri,
  isVerified,
  style,
  onPress,
  isLoggedFood = false,
  isMeal = false,
  accent = false,
}) {
  const colors = getDynamicColors(accent);

  return (
    <View style={[styles.container, style]}>
      <Pressable
        style={({ pressed }) => pressed && getPressedStyle()}
        onPress={onPress}
      >
        <View style={[styles.innerContainer, { borderColor: colors.shade500 }]}>
          {/* LEFT SIDE */}
          <View style={styles.nameContainer}>
            {/* IMAGE */}
            <FoodOrMealImage imageUri={imageUri} accent={!accent} />

            {/* QUANTITY */}
            {!!quantity && (
              <CustomText accent={accent} style={styles.text}>
                {quantity}g
              </CustomText>
            )}

            {/* NAME */}
            <FoodOrMealItemName
              searchText={searchText}
              name={name}
              accent={accent}
            />

            {/* VERIFIED ICON */}
            {isVerified && !quantity && (
              <MaterialIcons
                name="verified-user"
                size={20}
                color={COLORS.GOOD_500}
              />
            )}
          </View>

          {/* KCAL */}
          {(consumedCalories != undefined || kcalPer100G != undefined) && (
            <KcalContainer
              calories={consumedCalories ?? kcalPer100G}
              isLoggedFood={isLoggedFood}
              isMeal={isMeal}
              accent={accent}
              style={styles.kcalContainer}
            />
          )}
        </View>
      </Pressable>
    </View>
  );
}

export default FoodOrMealItem;

const styles = StyleSheet.create({
  container: {
    marginVertical: 2,
  },
  innerContainer: {
    paddingHorizontal: 8,
    height: 65,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 30,
  },
  nameContainer: {
    marginRight: 8,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginLeft: 8,
    fontSize: 12,
  },
  kcalContainer: {
    marginRight: 8,
  },
});
