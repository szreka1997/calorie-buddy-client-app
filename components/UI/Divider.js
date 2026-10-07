import { View, StyleSheet } from "react-native";

function Divider({
  style,
  color = "#ccc",
  length = "100%",
  thickness = 1,
  vertical = false,
}) {
  const containerStyle = { flexDirection: vertical ? "row" : "column" };
  const dividerStyle = {
    backgroundColor: color,
    width: vertical ? thickness : length,
    height: vertical ? length : thickness,
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      <View style={dividerStyle} />
    </View>
  );
}

export default Divider;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
});
