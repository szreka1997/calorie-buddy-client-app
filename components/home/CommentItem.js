import { StyleSheet, View } from "react-native";

import COLORS from "../../constants/colorConstants";
import Divider from "../UI/Divider";
import CustomText from "../UI/CustomText";
import CommentIcon from "./CommentIcon";
import { getDynamicColors } from "../../utils/colorUtils";
import { getCommentTextStyle } from "../../utils/styleUtils";

function CommentItem({ item, isLast = false, accent = false }) {
  const dynamicColors = getDynamicColors(accent);
  const commentTextStyle = getCommentTextStyle({ item, accent });

  return (
    <View>
      {/* ITEM */}
      <View style={styles.container}>
        {/* ICON */}
        <CommentIcon risks={item?.risks} good={item?.good} />

        {/* COMMENT */}
        <View style={styles.commentContainer}>
          {/* TITLE */}
          <CustomText style={commentTextStyle}>{item.message}</CustomText>

          {/* RISKS */}
          {item?.risks && (
            <CustomText isHighlight style={commentTextStyle}>
              Long Term Risks:{" "}
              <CustomText isHighlight style={{ color: COLORS.ERROR_500 }}>
                {item.risks}
              </CustomText>
            </CustomText>
          )}
        </View>
      </View>

      {/* DIVIDER */}
      {!isLast && (
        <Divider color={dynamicColors.shade500} style={styles.divider} />
      )}
    </View>
  );
}

export default CommentItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentContainer: {
    flex: 1,
    marginLeft: 8,
  },
  divider: {
    marginVertical: 8,
  },
});
