import { StyleSheet, View } from "react-native";

import NutriScoreText from "./NutriScoreText";
import { getNutriScoreConfig } from "../../utils/foodDiaryUtils";

function NutriScore({ nutriScore }) {
  const nutriScoreConfigList = getNutriScoreConfig(nutriScore);

  return (
    <View style={styles.container}>
      {nutriScoreConfigList.map((item, index) => {
        return (
          <NutriScoreText
            key={index}
            backgroundColor={item.backgroundColor}
            textColor={item.textColor}
            isSelected={item.isSelected}
            style={
              item.label === "A"
                ? styles.containerLeft
                : item.label === "E" && styles.containerRight
            }
          >
            {item.label}
          </NutriScoreText>
        );
      })}
    </View>
  );
}

export default NutriScore;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerRight: {
    borderTopEndRadius: 12,
    borderEndEndRadius: 12,
  },
  containerLeft: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
});
