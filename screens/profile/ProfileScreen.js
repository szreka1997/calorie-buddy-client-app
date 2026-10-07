import { useContext } from "react";
import { useIsFocused } from "@react-navigation/native";

import LoadingOverlay from "../../components/UI/LoadingOverlay";
import ProfileContent from "../../components/Goal/ProfileContent";
import useFetchProfileData from "../../hooks/goal/useFetchProfileData";
import { UserContext } from "../../contexts/user-context";

function ProfileScreen() {
  const isFocused = useIsFocused();
  const userCtx = useContext(UserContext);

  const userData = userCtx.userData;
  const macrosInGramm = userCtx.macrosInGramm;
  const plan = {
    goalDate: userData.goalDate,
    weeklyRate: userData.weeklyRate,
    plan: userData.plan,
  };

  const { isFetchingData, currentWeight } = useFetchProfileData({ isFocused });

  if (isFetchingData) return <LoadingOverlay />;

  return (
    <ProfileContent
      userData={userData}
      plan={plan}
      macrosInGramm={macrosInGramm}
      currentWeight={currentWeight}
    />
  );
}

export default ProfileScreen;
