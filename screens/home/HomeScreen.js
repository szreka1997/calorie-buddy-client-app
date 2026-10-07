import { useIsFocused } from "@react-navigation/native";

import LoadingOverlay from "../../components/UI/LoadingOverlay";
import HomeContent from "../../components/home/HomeContent";
import useFetchHomeData from "../../hooks/home/useFetchHomeData";

function HomeScreen() {
  const isFocused = useIsFocused();

  const { isFetchingData, nutriensInfo, last7DayCalorieDeficit } =
    useFetchHomeData({ isFocused });

  if (isFetchingData) return <LoadingOverlay />;

  return (
    <HomeContent
      nutriensInfo={nutriensInfo}
      last7DayCalorieDeficit={last7DayCalorieDeficit}
    />
  );
}

export default HomeScreen;
