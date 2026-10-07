import { useCallback, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

function useAppIsReady({ isTryingLogin = false }) {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontIsLoaded] = useFonts({
    skybrush: require("../assets/fonts/SKYBRUSH.ttf"),
  });

  useEffect(() => {
    setAppIsReady(fontIsLoaded && !isTryingLogin);
  }, [fontIsLoaded, isTryingLogin]);

  const onReadyRoot = useCallback(() => {
    if (appIsReady) SplashScreen.hide();
  }, [appIsReady]);

  return { appIsReady, onReadyRoot };
}

export default useAppIsReady;
