import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import OutlinedButton from "../../UI/custom-buttons/OutlinedButton";
import CustomText from "../../UI/CustomText";
import COLORS from "../../../constants/colorConstants";
import useCameraService from "../../../hooks/food-diary/useCameraService";

function BarcodeScanner({ data, scrollViewRef, accent = false }) {
  const [scannedData, setScannedData] = useState(data);

  const navigation = useNavigation();
  const { params } = useRoute();
  const { verifyPermissions } = useCameraService();

  const foodData = params?.foodData && { ...params.foodData };
  const barcodeFromRoute = params?.barcode;

  async function scanBarcode() {
    const hasPermission = await verifyPermissions({ accent });
    if (!hasPermission) return;

    navigation.navigate("Camera", { foodData });
  }

  useEffect(() => {
    if (!barcodeFromRoute) return;

    setScannedData(barcodeFromRoute);

    if (scrollViewRef?.current?.scrollToEnd) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [barcodeFromRoute, scrollViewRef]);

  return (
    <View>
      {/* BUTTON */}
      <OutlinedButton icon="barcode" onPress={scanBarcode} accent={accent}>
        Scan Barcode
      </OutlinedButton>

      {/* SCANNED BARCODE TEXT */}
      {scannedData && (
        <View style={styles.textContainer}>
          <CustomText style={styles.text}>
            Barcode added. ({scannedData})
          </CustomText>
          <Ionicons name="checkmark-circle" size={24} color={COLORS.GOOD_500} />
        </View>
      )}
    </View>
  );
}

export default BarcodeScanner;

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginRight: 8,
  },
});
