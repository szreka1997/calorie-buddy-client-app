import { StyleSheet, ImageBackground, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function ScreenContainer({ children, style, disableSafeAreaView = false }) {
  const childrenWithStyle = (
    <View style={[styles.innerContainer, style]}>{children}</View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/background.jpg")}
        style={StyleSheet.absoluteFillObject}
        imageStyle={styles.imageBackground}
      />
      {disableSafeAreaView ? (
        childrenWithStyle
      ) : (
        <SafeAreaView edges={["bottom"]} style={styles.container}>
          {childrenWithStyle}
        </SafeAreaView>
      )}
    </View>
  );
}

export default ScreenContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  imageBackground: {
    resizeMode: "cover",
    opacity: 0.5,
  },
});
