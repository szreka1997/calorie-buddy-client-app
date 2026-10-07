import Navigator from "./Navigator";
import useAppIsReady from "../hooks/useAppIsReady";
import useSilentLogin from "../hooks/auth/useSilentLogin";

function Root() {
  const { isTryingLogin } = useSilentLogin();
  const { appIsReady, onReadyRoot } = useAppIsReady({ isTryingLogin });

  if (!appIsReady) {
    return null;
  }

  return <Navigator isTryingLogin={isTryingLogin} onReady={onReadyRoot} />;
}

export default Root;
