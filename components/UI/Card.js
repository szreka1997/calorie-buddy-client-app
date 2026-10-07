import { View, StyleSheet, ImageBackground } from "react-native";

import { getDynamicColors } from "../../utils/colorUtils";

function Card({ children, style, accent = false, ...rest }) {
  const colors = getDynamicColors(accent);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.shade900, borderColor: colors.shade800 },
        style,
      ]}
      {...rest}
    >
      <ImageBackground
        source={require("../../assets/images/card-background.jpg")}
        style={StyleSheet.absoluteFillObject}
        imageStyle={styles.cardBackgroundImage}
      />
      {children}
    </View>
  );
}

export default Card;

const styles = StyleSheet.create({
  card: {
    marginVertical: 2,
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardBackgroundImage: {
    resizeMode: "cover",
    opacity: 0.3,
  },
});
