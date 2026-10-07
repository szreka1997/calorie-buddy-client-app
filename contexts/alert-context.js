import { createContext, useState } from "react";

import CustomAlert from "../components/dialogs/CustomAlert";
import { getErrorMessage } from "../utils/errorUtils";

export const AlertContext = createContext({
  showAlert: ({
    message,
    error,
    title = "",
    isDialog = false,
    accent = false,
    buttons = [],
  }) => {},
  hideAlert: () => {},
});

function AlertContextProvider({ children }) {
  const [alert, setAlert] = useState();

  function hideAlert() {
    setAlert(null);
  }

  function showAlert({
    message,
    error,
    title = "Error!",
    isDialog = false,
    accent = false,
    buttons = [
      {
        title: "OK",
        accent: !accent,
        onPress: hideAlert,
      },
    ],
  }) {
    const localMessage = !message && error ? getErrorMessage(error) : message;

    setAlert({
      title,
      message: localMessage,
      accent,
      buttons,
      onClose: isDialog && hideAlert,
    });
  }

  const value = { showAlert, hideAlert };

  return (
    <AlertContext.Provider value={value}>
      {children}
      {alert && <CustomAlert {...alert} />}
    </AlertContext.Provider>
  );
}

export default AlertContextProvider;
