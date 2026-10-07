import { useLayoutEffect, useState, useContext } from "react";
import { useNetInfo } from "@react-native-community/netinfo";

import { AuthContext } from "../../contexts/auth-context";
import { AlertContext } from "../../contexts/alert-context";

function useSilentLogin() {
  const [isTryingLogin, setIsTryingLogin] = useState(false);

  const authCtx = useContext(AuthContext);
  const alertCtx = useContext(AlertContext);
  const netinfo = useNetInfo();

  useLayoutEffect(() => {
    async function fetchToken() {
      if (isTryingLogin) return;
      setIsTryingLogin(true);
      try {
        await authCtx.getTokenAndId();
      } catch (error) {
        alertCtx.showAlert({ error });
      } finally {
        setIsTryingLogin(false);
      }
    }

    if (netinfo.isConnected) {
      fetchToken();
    }
  }, [netinfo]);

  return { isTryingLogin };
}

export default useSilentLogin;
