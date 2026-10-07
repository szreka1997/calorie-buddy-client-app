import { Image, View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import COLORS from "../constants/colorConstants";
import HomeScreen from "../screens/home/HomeScreen";
import FoodDiaryScreen from "../screens/food-diary/FoodDiaryScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { SCREEN_STYLES } from "../constants/styleConstants";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        ...SCREEN_STYLES.screenOptions,
        sceneStyle: { backgroundColor: COLORS.PRIMARY_1000 },
        tabBarActiveTintColor: COLORS.ACCENT_500,
        tabBarInactiveTintColor: COLORS.PRIMARY_100,
        tabBarBackground: () => (
          <>
            <View style={styles.absoluteView} />
            <Image
              source={require("../assets/images/tabbar-background.jpg")}
              resizeMode="cover"
              style={styles.image}
            />
          </>
        ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="FoodDiary"
        component={FoodDiaryScreen}
        options={{
          headerTitle: "Food Diary",
          tabBarLabel: "Food Diary",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default MyTabs;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: "100%",
    opacity: 0.2,
  },
  absoluteView: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: COLORS.PRIMARY_800,
  },
});
