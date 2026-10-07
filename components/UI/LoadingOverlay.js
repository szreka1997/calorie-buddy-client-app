import { ActivityIndicator, StyleSheet } from "react-native";

import COLORS from "../../constants/colorConstants";
import CustomText from "./CustomText";
import ScreenContainer from "./ScreenContainer";

function LoadingOverlay({ message = "Fetching data..." }) {
  return (
    <ScreenContainer disableSafeAreaView style={styles.container}>
      <CustomText isHighlight accent style={styles.message}>
        {message}
      </CustomText>
      <ActivityIndicator size="large" color={COLORS.ACCENT_500} />
    </ScreenContainer>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    marginBottom: 12,
    fontSize: 16,
  },
});
