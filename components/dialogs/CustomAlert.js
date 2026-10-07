import { View, StyleSheet } from "react-native";

import FlatButton from "../UI/custom-buttons/FlatButton";
import OutlinedButton from "../UI/custom-buttons/OutlinedButton";
import CardTitle from "../UI/CardTitle";
import CustomText from "../UI/CustomText";
import CustomDialogBase from "./CustomDialogBase";
import { getAlertButtonLayout } from "../../utils/styleUtils";
import { getDynamicColors } from "../../utils/colorUtils";

function CustomAlert({ title, message, buttons, onClose, accent = false }) {
  const colors = getDynamicColors(accent);
  const buttonLayout = getAlertButtonLayout(buttons.length);

  function renderOutlinedButton({ item, index }) {
    return (
      <OutlinedButton
        key={index}
        icon={item.icon}
        accent={item.accent}
        style={{ marginVertical: 8 }}
        onPress={item.onPress}
      >
        {item.title}
      </OutlinedButton>
    );
  }

  function renderFlatButton({ item, index }) {
    return (
      <FlatButton
        key={index}
        accent={item.accent}
        style={{ marginVertical: 0 }}
        onPress={item.onPress}
      >
        {item.title}
      </FlatButton>
    );
  }

  return (
    <CustomDialogBase onClose={onClose} accent={accent}>
      {/* TEXTS */}
      <View>
        <CardTitle
          style={styles.textContainer}
          textStyle={[styles.text, { color: colors.shade500 }]}
        >
          {title}
        </CardTitle>
        <CustomText accent={accent} style={[styles.textContainer, styles.text]}>
          {message}
        </CustomText>
      </View>

      {/* BUTTONS */}
      <View style={buttonLayout}>
        {buttons.map((item, index) =>
          buttons.length > 2
            ? renderOutlinedButton({ item, index })
            : renderFlatButton({ item, index }),
        )}
      </View>
    </CustomDialogBase>
  );
}

export default CustomAlert;

const styles = StyleSheet.create({
  textContainer: {
    marginBottom: 15,
  },
  text: {
    textAlign: "center",
  },
});
