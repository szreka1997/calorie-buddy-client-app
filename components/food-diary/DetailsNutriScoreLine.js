import { View, StyleSheet } from "react-native";
import { MaterialIcons, Octicons } from "@expo/vector-icons";

import CustomText from "../UI/CustomText";
import NutriScore from "./NutriScore";
import {
  getFoodVerificationText,
  getFoodVerificationIcon,
} from "../../utils/foodDiaryUtils";

function DetailsNutriScoreLine({
  nutriScore,
  isVerified,
  isMeal = false,
  accent = false,
}) {
  const verificationText = getFoodVerificationText(isVerified, isMeal);
  const verificationIcon = getFoodVerificationIcon(isVerified, isMeal);
  const iconProps = verificationIcon && {
    name: verificationIcon.name,
    size: 20,
    color: verificationIcon.color,
  };

  return (
    <View style={styles.container}>
      {/* NUTRI SCORE */}
      <NutriScore nutriScore={nutriScore} />

      {/* VERIFIED PANEL */}
      <View style={styles.verifiedContainer}>
        {verificationText && (
          <CustomText isHighlight accent={accent} style={styles.verifiedText}>
            {verificationText}
          </CustomText>
        )}
        {verificationIcon?.type === "MaterialIcons" && (
          <MaterialIcons {...iconProps} />
        )}
        {verificationIcon?.type === "Octicons" && <Octicons {...iconProps} />}
      </View>
    </View>
  );
}

export default DetailsNutriScoreLine;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  verifiedContainer: {
    flexDirection: "row",
  },
  verifiedText: {
    marginRight: 8,
  },
});
