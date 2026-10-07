import { createNativeStackNavigator } from "@react-navigation/native-stack";

import COLORS from "../constants/colorConstants";
import SetGoalScreen from "../screens/profile/SetGoalScreen";
import { SCREEN_STYLES } from "../constants/styleConstants";

const Stack = createNativeStackNavigator();

function StartingSetGoalStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...SCREEN_STYLES.screenOptions,
        contentStyle: { backgroundColor: COLORS.PRIMARY_1000 },
      }}
    >
      <Stack.Screen
        name="SetGoal"
        component={SetGoalScreen}
        initialParams={{ userData: null }}
      />
    </Stack.Navigator>
  );
}

export default StartingSetGoalStack;
