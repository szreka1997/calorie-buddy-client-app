import { useContext } from "react";
import { StyleSheet } from "react-native";

import CardTitle from "../UI/CardTitle";
import CustomScrollView from "../UI/CustomScrollView";
import SugarPanel from "../food-diary/SugarPanel";
import CommentCard from "./ComentCard";
import WeightPanel from "./WeightPanel";
import CalorieDeficitPanel from "./CalorieDeficitPanel";
import CaloriesAndMacrosProggressRingCard from "./CaloriesAndMacrosProggressRingCard";
import { UserContext } from "../../contexts/user-context";
import {
  calculateNutriensDeficit,
  calculateSugarDeficit,
} from "../../utils/foodDiaryUtils";

function HomeContent({ nutriensInfo, last7DayCalorieDeficit }) {
  const userCtx = useContext(UserContext);

  return (
    <CustomScrollView disableSafeAreaView>
      {/* TODAY */}
      <CardTitle style={styles.titleContainer} textStyle={styles.titleText}>
        TODAY
      </CardTitle>

      {/* NUTRIENS CHART CARD */}
      <CaloriesAndMacrosProggressRingCard
        consumedKcal={nutriensInfo.kcal}
        consumedProtein={nutriensInfo.protein}
        consumedCarbs={nutriensInfo.carbs}
        consumedFat={nutriensInfo.fat}
        maxKcal={userCtx.userData?.goalCalories || 1}
        maxProtein={userCtx.macrosInGramm?.proteinInGramm || 1}
        maxCarbs={userCtx.macrosInGramm?.carbsInGramm || 1}
        maxFat={userCtx.macrosInGramm?.fatInGramm || 1}
        accent
      />

      {/* SUGAR PANEL */}
      <SugarPanel
        sugar={nutriensInfo.sugar}
        addedSugar={nutriensInfo.addedSugar}
        goalCalories={userCtx.userData?.goalCalories}
      />

      {/* COMMENT CARD */}
      <CommentCard
        kcalDeficit={calculateNutriensDeficit(
          userCtx.userData?.goalCalories,
          nutriensInfo.kcal,
        )}
        proteinDeficit={calculateNutriensDeficit(
          userCtx.macrosInGramm?.proteinInGramm,
          nutriensInfo.protein,
        )}
        carbsDeficit={calculateNutriensDeficit(
          userCtx.macrosInGramm?.carbsInGramm,
          nutriensInfo.carbs,
        )}
        fatDeficit={calculateNutriensDeficit(
          userCtx.macrosInGramm?.fatInGramm,
          nutriensInfo.fat,
        )}
        sugarDeficit={calculateSugarDeficit({
          goalCalories: userCtx.userData?.goalCalories,
          consumedSugar: nutriensInfo.sugar,
        })}
        addedSugarDeficit={calculateSugarDeficit({
          goalCalories: userCtx.userData?.goalCalories,
          consumedSugar: nutriensInfo.addedSugar,
          isAddedSugar: true,
        })}
        accent
      />

      {/* WEIGHT PANEL */}
      <WeightPanel />

      {/* CALORIE DEFICIT PANEL */}
      {last7DayCalorieDeficit.data.length !== 0 && (
        <CalorieDeficitPanel last7DayCalorieDeficit={last7DayCalorieDeficit} />
      )}
    </CustomScrollView>
  );
}

export default HomeContent;

const styles = StyleSheet.create({
  titleContainer: {
    margin: 8,
  },
  titleText: {
    textAlign: "center",
  },
});
