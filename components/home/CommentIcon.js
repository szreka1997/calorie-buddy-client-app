import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

import COLORS from "../../constants/colorConstants";

function CommentIcon({ risks, good }) {
  if (risks) {
    return (
      <MaterialIcons name="error-outline" size={24} color={COLORS.ERROR_500} />
    );
  }
  if (good) {
    return <Feather name="check-circle" size={24} color={COLORS.GOOD_500} />;
  }

  return <AntDesign name="warning" size={24} color="yellow" />;
}

export default CommentIcon;
