import { useContext, useLayoutEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import { AuthContext } from "../../contexts/auth-context";
import { AlertContext } from "../../contexts/alert-context";
import { prepareWeightChartData } from "../../utils/homeUtils";
import * as WeightService from "../../services/weight-service";

function useWeightData() {
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [lastWeight, setLastWeight] = useState();
  const [last7Weight, setLast7Weight] = useState({
    labels: [],
    data: [],
  });
  const [statInfo, setStatInfo] = useState({
    netChange: 0,
    avaregeLog: 0,
  });

  const isFocused = useIsFocused();
  const authCtx = useContext(AuthContext);
  const alertCtx = useContext(AlertContext);

  useLayoutEffect(() => {
    async function fetchWeights() {
      setIsFetchingData(true);
      try {
        const { token, id: userId } = await authCtx.getTokenAndId();
        const result = await WeightService.getLast7WeightByUserId({
          token,
          userId,
        });

        const { chartData, statInfo } = prepareWeightChartData(result);

        setLastWeight(result.reverse()[0]);
        setLast7Weight({ ...chartData });
        setStatInfo({ ...statInfo });
      } catch (error) {
        alertCtx.showAlert({ accent: true, error });
      } finally {
        setIsFetchingData(false);
      }
    }

    if (isFocused) {
      fetchWeights();
    }
  }, [isFocused]);

  return {
    isFetchingData,
    lastWeight,
    last7Weight,
    statInfo,
  };
}

export default useWeightData;
