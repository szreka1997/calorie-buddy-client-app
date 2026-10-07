import { StyleSheet, View } from "react-native";

import Card from "../UI/Card";
import CardTitle from "../UI/CardTitle";
import CustomText from "../UI/CustomText";
import IconButton from "../UI/custom-buttons/IconButton";
import CustomLineChart from "../UI/CustomLineChart";
import StatPanel from "./StatPanel";

function StatCard({
  title,
  last7Name,
  last7Data,
  statLegend,
  onPress,
  accent = false,
  ...statPanelProps
}) {
  return (
    <Card>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <CardTitle accent={accent}>{title}</CardTitle>
        {onPress && (
          <IconButton
            icon="add"
            iconSize={20}
            borderWidth={1}
            accent={!accent}
            style={styles.icon}
            onPress={onPress}
            shouldAndroidRipple
          />
        )}
      </View>

      {/* LAST 7 LOG */}
      <CustomText accent={accent} isHighlight style={styles.last7LogText}>
        Last 7 {last7Name}
      </CustomText>

      {/* LINE CHART */}
      {last7Data.data.length !== 0 && (
        <CustomLineChart
          rawData={last7Data}
          legend={statLegend}
          accent={accent}
        />
      )}

      {/* STAT PANEL */}
      <StatPanel accent={accent} {...statPanelProps} />
    </Card>
  );
}

export default StatCard;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    height: 30,
    width: 30,
  },
  last7LogText: {
    fontSize: 12,
    fontStyle: "italic",
  },
});
