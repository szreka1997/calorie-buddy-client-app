import { View, StyleSheet, Pressable } from "react-native";

import GLOBAL_STYLES from "../../constants/styleConstants";
import COLORS from "../../constants/colorConstants";
import Card from "../UI/Card";
import useBackHandler from "../../hooks/useBackHandler";

function CustomDialogBase({ children, onClose, accent = false }) {
  function closeHandler() {
    if (onClose) onClose();
  }

  useBackHandler(closeHandler);

  return (
    <View style={styles.outerContainer}>
      <Pressable style={styles.pressable} onPress={closeHandler}>
        <Card
          accent={accent}
          style={[styles.modalContainer, GLOBAL_STYLES.shadow]}
          onStartShouldSetResponder={() => true} // This allows capturing the touch event.
          onResponderRelease={(e) => e.stopPropagation()} // It prevents the Pressable from receiving it.
        >
          {children}
        </Card>
      </Pressable>
    </View>
  );
}

export default CustomDialogBase;

const styles = StyleSheet.create({
  outerContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: COLORS.MODAL_700,
  },
  pressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    padding: 35,
    maxWidth: "95%",
    minWidth: "70%",
    borderRadius: 20,
  },
});
