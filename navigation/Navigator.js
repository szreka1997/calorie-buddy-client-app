import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { useNetInfo } from "@react-native-community/netinfo";

import NoConnectionStack from "./NoConnectionStack";
import AuthStack from "./AuthStack";
import StartingSetGoalStack from "./StartingSetGoalStack";
import AuthenticatedStack from "./AuthenticatedStack";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { AuthContext } from "../contexts/auth-context";

function NavigatorSwitch() {
  const authCtx = useContext(AuthContext);
  const netinfo = useNetInfo();

  if (!netinfo.isConnected) return <NoConnectionStack />;
  if (!authCtx.isAuthenticated) return <AuthStack />;
  if (authCtx.isFirstLogin) return <StartingSetGoalStack />;
  return <AuthenticatedStack />;
}

function Navigator({ isTryingLogin, onReady }) {
  const authCtx = useContext(AuthContext);

  if (isTryingLogin) {
    return <LoadingOverlay />;
  }

  return (
    <NavigationContainer
      key={authCtx.isFirstLogin ? "first-login" : "authenticated"}
      onReady={onReady}
    >
      <NavigatorSwitch />
    </NavigationContainer>
  );
}

export default Navigator;
