import { createNativeStackNavigator } from "@react-navigation/native-stack";

import COLORS from "../constants/colorConstants";
import NoConnectionScreen from "../screens/NoConnectionScreen";
import { SCREEN_STYLES } from "../constants/styleConstants";

const Stack = createNativeStackNavigator();

function NoConnectionStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...SCREEN_STYLES.screenOptions,
        contentStyle: { backgroundColor: COLORS.PRIMARY_1000 },
      }}
    >
      <Stack.Screen
        name="NoConnection"
        component={NoConnectionScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default NoConnectionStack;
