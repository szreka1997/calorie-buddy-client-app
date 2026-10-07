import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import COLORS from "../constants/colorConstants";
import FoodScreen from "../screens/food-diary/FoodScreen";
import MealScreen from "../screens/food-diary/MealScreen";
import { SCREEN_STYLES } from "../constants/styleConstants";

const TopTab = createMaterialTopTabNavigator();

function FoodTabs({ onTabChanged, routeName = "Food" }) {
  return (
    <TopTab.Navigator
      initialRouteName={routeName}
      screenOptions={{
        ...SCREEN_STYLES.screenOptions,
        tabBarStyle: { backgroundColor: "transparent" },
        sceneStyle: { backgroundColor: "transparent" },
      }}
    >
      <TopTab.Screen
        name="Food"
        component={FoodScreen}
        options={{
          title: "Foods",
          tabBarIndicatorStyle: { backgroundColor: COLORS.PRIMARY_500 },
          tabBarActiveTintColor: COLORS.PRIMARY_500,
          tabBarInactiveTintColor: COLORS.ACCENT_800,
        }}
        listeners={{
          focus: (e) => {
            onTabChanged(false);
          },
        }}
      />
      <TopTab.Screen
        name="Meal"
        component={MealScreen}
        options={{
          title: "Meals",
          tabBarIndicatorStyle: { backgroundColor: COLORS.ACCENT_500 },
          tabBarActiveTintColor: COLORS.ACCENT_500,
          tabBarInactiveTintColor: COLORS.PRIMARY_800,
        }}
        listeners={{
          focus: (e) => {
            onTabChanged(true);
          },
        }}
      />
    </TopTab.Navigator>
  );
}

export default FoodTabs;
