import { useContext, useLayoutEffect, useState } from "react";

import { AuthContext } from "../../contexts/auth-context";
import { AlertContext } from "../../contexts/alert-context";
import * as WeightService from "../../services/weight-service";

function useFetchProfileData({ isFocused }) {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [currentWeight, setCurrentWeight] = useState();

  const authCtx = useContext(AuthContext);
  const alertCtx = useContext(AlertContext);

  useLayoutEffect(() => {
    if (isFetchingData) return;

    async function getWeights() {
      setIsFetchingData(true);
      try {
        const { token, id: userId } = await authCtx.getTokenAndId();
        const result = await WeightService.getLastWeightByUserId({
          token,
          userId,
        });

        setCurrentWeight(result.weight);
      } catch (error) {
        alertCtx.showAlert({ accent: true, error });
      } finally {
        setIsFetchingData(false);
      }
    }

    if (isFocused) {
      getWeights();
    }
  }, [isFocused]);

  return { isFetchingData, currentWeight };
}

export default useFetchProfileData;
