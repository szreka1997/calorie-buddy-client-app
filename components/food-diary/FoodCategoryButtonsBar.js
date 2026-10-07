import { StyleSheet } from "react-native";

import Card from "../UI/Card";

function FoodCategoryButtonsBar({ children, accent = false }) {
  return (
    <Card accent={accent} style={styles.container}>
      {children}
    </Card>
  );
}

export default FoodCategoryButtonsBar;

const styles = StyleSheet.create({
  container: {
    padding: 0,
    height: 130,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderRadius: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
});
