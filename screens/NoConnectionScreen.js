import { StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import COLORS from "../constants/colorConstants";
import CustomText from "../components/UI/CustomText";
import ScreenContainer from "../components/UI/ScreenContainer";

function NoConnectionScreen() {
  return (
    <ScreenContainer style={styles.container}>
      <Feather name="wifi-off" color={COLORS.ACCENT_500} size={100} />
      <CustomText isHighlight style={styles.text}>
        Connection lost. Make sure you're connected to Wi-Fi or mobile data.
      </CustomText>
    </ScreenContainer>
  );
}

export default NoConnectionScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 30,
    marginHorizontal: 18,
    fontSize: 16,
    textAlign: "center",
  },
});
