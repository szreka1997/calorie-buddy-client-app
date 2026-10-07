import { Text } from "react-native";

import { getDynamicColors } from "../../utils/colorUtils";

function CustomText({ children, style, isHighlight = false, accent = false }) {
  const colors = getDynamicColors(accent);
  const textStyle = {
    color: isHighlight ? colors.shade500 : colors.shade50,
    fontWeight: isHighlight && "bold",
  };

  return <Text style={[textStyle, style]}>{children}</Text>;
}

export default CustomText;
