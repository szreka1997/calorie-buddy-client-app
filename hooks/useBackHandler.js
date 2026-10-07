import { useEffect } from "react";
import { BackHandler } from "react-native";

function useBackHandler(onBackPress) {
  useEffect(() => {
    function backAction() {
      onBackPress();
      return true;
    }

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [onBackPress]);
}

export default useBackHandler;
