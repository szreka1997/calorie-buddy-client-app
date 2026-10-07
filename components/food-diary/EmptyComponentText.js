import { StyleSheet, Text, View } from "react-native";

import { getDynamicColors } from "../../utils/colorUtils";

function EmptyComponentText({ message, accent = false }) {
  const colors = getDynamicColors(accent);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.shade700 }]}>{message}</Text>
    </View>
  );
}

export default EmptyComponentText;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    alignItems: "center",
  },
  text: {
    textAlign: "center",
  },
});
