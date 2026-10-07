import { useLayoutEffect } from "react";

import LoadingOverlay from "../../components/UI/LoadingOverlay";
import ProfileAndGoalContent from "../../components/Goal/ProfileAndGoalContent";
import useSetGoal from "../../hooks/goal/useSetGoal";

function SetGoalScreen({ navigation, route }) {
  const userData = route.params?.userData;
  const { isFetchingData, setGoal } = useSetGoal({ isFirstGoalSet: !userData });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: userData ? "Update Goal" : "Set Goal",
    });
  }, [navigation]);

  if (isFetchingData) return <LoadingOverlay />;

  return <ProfileAndGoalContent data={userData} onSubmit={setGoal} />;
}

export default SetGoalScreen;
