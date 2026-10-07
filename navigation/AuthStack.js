import { createNativeStackNavigator } from "@react-navigation/native-stack";

import COLORS from "../constants/colorConstants";
import LoginScreen from "../screens/auth/LoginScreen";
import SignupScreen from "../screens/auth/SignupScreen";
import { SCREEN_STYLES } from "../constants/styleConstants";

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...SCREEN_STYLES.screenOptions,
        contentStyle: { backgroundColor: COLORS.PRIMARY_1000 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

export default AuthStack;
