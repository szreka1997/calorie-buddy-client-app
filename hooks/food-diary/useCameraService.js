import { useContext } from "react";
import { useCameraPermissions, PermissionStatus } from "expo-camera";

import { AlertContext } from "../../contexts/alert-context";

function useCameraService() {
  const [permission, requestPermission] = useCameraPermissions();
  const alertCtx = useContext(AlertContext);

  async function verifyPermissions({ accent = false }) {
    if (permission.status !== PermissionStatus.GRANTED) {
      const permissionResponse = await requestPermission();

      if (!permissionResponse.granted) {
        alertCtx.showAlert({
          title: "Insufficient Permissions!",
          message: "You need to grant camera permissions to use this app.",
          accent,
        });
        return false;
      }
    }
    return true;
  }

  return { verifyPermissions };
}

export default useCameraService;
