import { useContext } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Title from "../UI/Title";
import IconButton from "../UI/custom-buttons/IconButton";
import OutlinedButton from "../UI/custom-buttons/OutlinedButton";
import ScreenContainer from "../UI/ScreenContainer";
import GoalsCard from "./Cards/GoalsCard";
import ProgressCard from "./Cards/ProgressCard";
import { AuthContext } from "../../contexts/auth-context";

function ProfileContent({ userData, plan, macrosInGramm, currentWeight }) {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);

  function navigateToEditProfileScreen() {
    navigation.navigate("EditProfile", { userData });
  }

  function navigateToSetGoalScreen() {
    navigation.navigate("SetGoal", {
      userData: { ...userData, startingWeight: currentWeight },
    });
  }

  function logoutHandler() {
    authCtx.logout();
  }

  return (
    <ScreenContainer disableSafeAreaView>
      {/* TITLE */}
      <View style={styles.titleContainer}>
        <Title>{userData.username}</Title>
        <IconButton
          icon="pencil-sharp"
          iconSize={30}
          accent
          onPress={navigateToEditProfileScreen}
        />
      </View>

      {/* PROGRESS CARD */}
      {userData?.startingWeight !== userData?.goalWeight && currentWeight && (
        <ProgressCard
          startingWeight={userData?.startingWeight}
          goalWeight={userData?.goalWeight}
          currentWeight={currentWeight}
          plan={plan}
        />
      )}

      {/* GOAL CARD */}
      <GoalsCard
        userData={userData}
        plan={plan}
        macrosInGramm={macrosInGramm}
      />

      {/* UPDATE GOAL BUTTON */}
      <OutlinedButton
        icon="rocket"
        accent
        style={styles.buttons}
        onPress={navigateToSetGoalScreen}
      >
        Update Goal
      </OutlinedButton>

      {/* LOGOUT BUTTON */}
      <OutlinedButton
        icon="exit"
        accent
        style={styles.buttons}
        onPress={logoutHandler}
      >
        LOGOUT
      </OutlinedButton>
    </ScreenContainer>
  );
}

export default ProfileContent;

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttons: {
    marginVertical: 4,
  },
});
