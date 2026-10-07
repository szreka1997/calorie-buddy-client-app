import { useState, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { CameraView } from "expo-camera";

function CameraScreen({ navigation, route }) {
  const [cameraKey, setCameraKey] = useState(0);
  const isFocused = useIsFocused();

  function barcodeScannedHandler({ data }) {
    const isSearchingForFood = route.params?.isSearchingForFood;

    const targetScreen = isSearchingForFood ? "FoodSearch" : "AddAndEditFood";
    const params = isSearchingForFood
      ? { barcode: data }
      : { foodData: route.params?.foodData, barcode: data };

    navigation.popTo(targetScreen, params);
  }

  useFocusEffect(
    useCallback(() => {
      const frame = requestAnimationFrame(() => {
        setCameraKey((k) => k + 1); // Remount camera on focus
      });

      return () => cancelAnimationFrame(frame);
    }, []),
  );

  return (
    <View style={styles.container}>
      {isFocused && (
        <CameraView
          key={cameraKey}
          facing="back"
          style={styles.container}
          onBarcodeScanned={barcodeScannedHandler}
        />
      )}
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
