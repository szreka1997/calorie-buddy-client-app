import { StyleSheet, View } from "react-native";

import IconButton from "../UI/custom-buttons/IconButton";

function CollapsibleButton({ onPress, isOpen = false }) {
  return (
    <View style={styles.container}>
      <IconButton
        icon={!isOpen ? "caret-forward" : "caret-down"}
        iconSize={20}
        accent
        onPress={onPress}
        style={styles.icon}
      />
    </View>
  );
}

export default CollapsibleButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  icon: {
    height: 30,
    width: 30,
  },
});
