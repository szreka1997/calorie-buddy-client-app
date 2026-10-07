import { View, TextInput, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import DeleteTextButton from "./custom-buttons/DeleteTextButton";
import useInput from "../../hooks/UI/useInput";
import { getDynamicColors } from "../../utils/colorUtils";

function SearchInput({
  value,
  placeholder,
  style,
  onChange,
  onBlur = () => {},
  accent = false,
}) {
  const colors = getDynamicColors(accent);
  const inverseColors = getDynamicColors(!accent);

  const {
    borderColor,
    inputTextColor,
    cursorColor,
    selectionColor,
    isFocused,
    focusHandler,
    blurHandler,
    changeTextHandler,
  } = useInput({ colors, accent, onChange, onBlur });

  return (
    <View style={[styles.container, { borderColor }, style]}>
      {/* SEARCH ICON */}
      <View style={styles.iconContainer}>
        <Ionicons
          name="search-sharp"
          size={28}
          color={inverseColors.shade500}
        />
      </View>

      {/* TEXT INPUT */}
      <TextInput
        value={value}
        placeholder={placeholder}
        cursorColor={cursorColor}
        selectionColor={selectionColor}
        placeholderTextColor={colors.shade800}
        allowFontScaling={false}
        style={[styles.textInput, { color: inputTextColor }]}
        onFocus={focusHandler}
        onBlur={blurHandler}
        onChangeText={changeTextHandler}
      />

      {/* DELETE TEXT BUTTON */}
      <DeleteTextButton
        isVisible={!!value && isFocused}
        accent={accent}
        onDelete={changeTextHandler.bind(this, "")}
      />
    </View>
  );
}

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginTop: 4,
    height: 50,
    minWidth: 250,
    borderRadius: 100,
    borderWidth: 2,
  },
  iconContainer: {
    marginLeft: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    paddingVertical: 4,
    paddingHorizontal: 12,
    fontSize: 16,
  },
});
