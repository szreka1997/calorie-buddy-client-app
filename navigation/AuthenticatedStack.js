import { createNativeStackNavigator } from "@react-navigation/native-stack";

import COLORS from "../constants/colorConstants";
import MyTabs from "./MyTabs";
import SetGoalScreen from "../screens/profile/SetGoalScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import FoodSearchScreen from "../screens/food-diary/FoodSearchScreen";
import AddAndEditFoodScreen from "../screens/food-diary/AddAndEditFoodScreen";
import FoodDetailsScreen from "../screens/food-diary/FoodDetailsScreen";
import CreateAndEditMealScreen from "../screens/food-diary/CreateAndEditMealScreen";
import MealDetailsScreen from "../screens/food-diary/MealDetailsScreen";
import AddWeightScreen from "../screens/home/AddWeightScreen";
import CameraScreen from "../screens/food-diary/CameraScreen";
import { SCREEN_STYLES } from "../constants/styleConstants";

const Stack = createNativeStackNavigator();

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        ...SCREEN_STYLES.screenOptions,
        contentStyle: { backgroundColor: COLORS.PRIMARY_1000 },
      }}
      initialRouteName="Tabs"
    >
      <Stack.Screen
        name="Tabs"
        component={MyTabs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen name="SetGoal" component={SetGoalScreen} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: "Edit Profile",
        }}
      />
      <Stack.Screen
        name="FoodSearch"
        component={FoodSearchScreen}
        options={{
          title: "Search",
        }}
      />
      <Stack.Screen
        name="AddAndEditFood"
        component={AddAndEditFoodScreen}
        options={{
          title: "Add Food",
        }}
      />
      <Stack.Screen
        name="FoodDetails"
        component={FoodDetailsScreen}
        options={{
          title: "Food Details",
        }}
      />
      <Stack.Screen
        name="CreateAndEditMeal"
        component={CreateAndEditMealScreen}
        options={{
          title: "Create Meal",
        }}
      />
      <Stack.Screen
        name="MealDetails"
        component={MealDetailsScreen}
        options={{
          title: "Meal Details",
        }}
      />
      <Stack.Screen
        name="AddWeight"
        component={AddWeightScreen}
        options={{
          title: "Add Weight",
        }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

export default AuthenticatedStack;
