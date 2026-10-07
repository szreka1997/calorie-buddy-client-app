import { useState, useContext } from "react";
import * as ImagePicker from "expo-image-picker";

import useCameraService from "./useCameraService";
import { AlertContext } from "../../contexts/alert-context";

function useImagePicker({ value, onChange, accent = false }) {
  const [showImage, setShowImage] = useState(!!value);

  const { verifyPermissions } = useCameraService();
  const alertCtx = useContext(AlertContext);

  async function importPhotoHandler() {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [16, 16],
      quality: 0.5,
    });

    if (!result.canceled) {
      setShowImage(true);
      onChange(result.assets[0].uri);
    }
    alertCtx.hideAlert();
  }

  async function takePhotoHandler() {
    const hasPermission = await verifyPermissions({ accent });
    if (!hasPermission) return;

    const image = await ImagePicker.launchCameraAsync({
      cameraType: ImagePicker.CameraType.back,
      allowsEditing: true,
      aspect: [16, 16],
      quality: 0.5,
    });
    const imageUri = image.assets[0].uri;

    setShowImage(!!imageUri);
    onChange(imageUri);
    alertCtx.hideAlert();
  }

  function deletePhotoHandler() {
    setShowImage(false);
    onChange(null);
    alertCtx.hideAlert();
  }

  return {
    showImage,
    importPhotoHandler,
    takePhotoHandler,
    deletePhotoHandler,
  };
}

export default useImagePicker;
