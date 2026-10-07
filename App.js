import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import AuthContectProvider from "./contexts/auth-context";
import AlertContextProvider from "./contexts/alert-context";
import RadioContextProvider from "./contexts/radio-context";
import UserContextProvider from "./contexts/user-context";
import DateContextProvider from "./contexts/date-context";
import Root from "./navigation/Root";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AlertContextProvider>
        <RadioContextProvider>
          <UserContextProvider>
            <AuthContectProvider>
              <DateContextProvider>
                <SafeAreaProvider>
                  <GestureHandlerRootView style={{ flex: 1 }}>
                    <Root />
                  </GestureHandlerRootView>
                </SafeAreaProvider>
              </DateContextProvider>
            </AuthContectProvider>
          </UserContextProvider>
        </RadioContextProvider>
      </AlertContextProvider>
    </>
  );
}
