import { useContext } from "react";
import { StyleSheet, View, Image } from "react-native";

import OutlinedButton from "../UI/custom-buttons/OutlinedButton";
import CustomText from "../UI/CustomText";
import useImagePicker from "../../hooks/food-diary/useImagePicker";
import { AlertContext } from "../../contexts/alert-context";
import { getDynamicColors } from "../../utils/colorUtils";
import { getImagePickerButtonConfigs } from "../../utils/foodDiaryUtils";

function ImagePickerContent({ imageUri, onChange, accent = false }) {
  const colors = getDynamicColors(accent);
  const alertCtx = useContext(AlertContext);
  const {
    showImage,
    importPhotoHandler,
    takePhotoHandler,
    deletePhotoHandler,
  } = useImagePicker({ value: imageUri, onChange, accent });

  function addPhotoPopupHandler() {
    alertCtx.showAlert({
      title: showImage ? "Modify photo" : "Add a photo",
      message: "Please select the image adding mode!",
      isDialog: true,
      accent: !accent,
      buttons: getImagePickerButtonConfigs(
        importPhotoHandler,
        takePhotoHandler,
        deletePhotoHandler,
        () => alertCtx.hideAlert(),
        showImage,
        !accent,
      ),
    });
  }

  const imagePreview = showImage ? (
    <Image style={styles.image} source={{ uri: imageUri }} />
  ) : (
    <CustomText isHighlight style={{ color: colors.shade1000 }}>
      No image taken yet.
    </CustomText>
  );

  return (
    <View>
      {/* IMAGE PREVIEW */}
      <View
        style={[
          styles.imageContainer,
          { backgroundColor: colors.shade200, borderColor: colors.shade500 },
        ]}
      >
        {imagePreview}
      </View>

      {/* ADD A PHOTO BUTTON */}
      <OutlinedButton
        icon="camera"
        accent={accent}
        onPress={addPhotoPopupHandler}
      >
        {showImage ? "Modify photo" : "Add a photo"}
      </OutlinedButton>
    </View>
  );
}

export default ImagePickerContent;

const styles = StyleSheet.create({
  imageContainer: {
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 200,
    borderRadius: 12,
    borderWidth: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
