import { Platform, StyleSheet } from "react-native";

import COLORS from "./colorConstants";

const GLOBAL_STYLES = StyleSheet.create({
  shadow: {
    elevation: 10,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowOffset: { width: 1, height: 1 },
    shadowRadius: 5,
  },
  pressed: {
    opacity: Platform.OS === "ios" ? 0.5 : 1,
  },
});

export const SCREEN_STYLES = {
  screenOptions: {
    headerStyle: { backgroundColor: COLORS.PRIMARY_800 },
    headerTintColor: COLORS.ACCENT_500,
    headerTitleAlign: "center",
    headerTitleStyle: { fontFamily: "skybrush", fontSize: 50 },
  },
};

export default GLOBAL_STYLES;
