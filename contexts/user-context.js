import { createContext, useState } from "react";

import useCalorieData from "../hooks/goal/useCalorieData";
import * as UserService from "../services/user-service";
import * as GoalService from "../services/goal-service";
import * as WeightHistoryService from "../services/weight-service";

export const UserContext = createContext({
  userData: {},
  macrosInGramm: {},
  fetchData: async ({ token, userId }) => {},
  deleteData: () => {},
});

function UserContextProvider({ children }) {
  const [userData, setUserData] = useState({});
  const [macrosInGramm, setMacrosInGramm] = useState({});

  const getCalorieData = useCalorieData();

  async function fetchData({ token, userId }) {
    const [responseUser, responseGoal, responseLastWeight] = await Promise.all([
      UserService.getUser({ token, userId }),
      GoalService.getGoal({ token, userId }),
      WeightHistoryService.getLastWeightByUserId({ token, userId }),
    ]);

    const {
      calorieNeeds,
      proteinInGramm,
      carbsInGramm,
      fatInGramm,
      resultPlan,
    } = getCalorieData({
      userData: responseUser,
      goalData: {
        ...responseGoal,
        startingWeight: responseLastWeight.weight,
      },
    });

    setUserData({
      username: responseUser.username,
      sex: responseUser.sex,
      birthday: responseUser.birthday,
      registerDate: responseUser.registerDate,
      calorieNeeds,
      ...responseGoal,
      ...resultPlan,
    });
    setMacrosInGramm({ carbsInGramm, proteinInGramm, fatInGramm });
  }

  function deleteData() {
    setUserData(null);
    setMacrosInGramm(null);
  }

  const value = {
    userData,
    macrosInGramm,
    fetchData,
    deleteData,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserContextProvider;
