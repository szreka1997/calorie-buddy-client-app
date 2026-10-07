import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import COLORS from "../../constants/colorConstants";
import CustomText from "../UI/CustomText";

function GoalPanel({ children, title, highlightText, icon }) {
  return (
    <View style={styles.container}>
      {/* TITLE */}
      <View style={styles.titleContainer}>
        <Ionicons name={icon} size={22} color={COLORS.PRIMARY_500} />
        <CustomText isHighlight style={styles.title}>
          {title}
        </CustomText>
      </View>

      {/* SUBTITLE */}
      <CustomText isHighlight style={styles.highlightText}>
        {highlightText}
      </CustomText>

      {/* CHILDREN */}
      <View style={styles.contentContainer}>{children}</View>
    </View>
  );
}

export default GoalPanel;

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    marginLeft: 4,
  },
  highlightText: {
    marginLeft: 24,
    fontSize: 24,
  },
  contentContainer: {
    marginLeft: 24,
  },
});
