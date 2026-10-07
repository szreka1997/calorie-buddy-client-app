import { JSON_HEADERS, SERVER_BASE_URL } from "../constants/urlConstants";
import {
  MAP_USER_GOAL_DATA_NAME_TO_PAYLOAD,
  MAP_USER_GOAL_RESPONSE_NAME_TO_DATA,
} from "../constants/fetchConstants";
import { parseNumeric } from "../utils/helperFunctions";
import { handleFetchResponseErrorsAndData } from "../utils/errorUtils";
import { createAuthorizationHeader, formatData } from "../utils/fetchUtils";

const userGoalsUrl = `${SERVER_BASE_URL}user-goals`;

export function postNewGoal({ token, userId, goalData }) {
  return module.exports.uploadGoal({ token, userId, goalData, method: "POST" });
}

export function updateGoal({ token, userId, goalData }) {
  return module.exports.uploadGoal({ token, userId, goalData, method: "PUT" });
}

export async function getGoal({ token, userId }) {
  if (!token || !userId) {
    throw new Error("Missing required parameters: token or userId.");
  }

  const response = await fetch(`${userGoalsUrl}/${userId}`, {
    headers: {
      ...JSON_HEADERS,
      ...createAuthorizationHeader(token),
    },
  });

  const data = await handleFetchResponseErrorsAndData(response);

  return module.exports.parseAndFormatAllGoalResponseData({
    data: [data],
  })[0];
}

// HELPERS
export async function uploadGoal({ token, userId, goalData, method }) {
  if (!token || !userId || !goalData) {
    throw new Error("Missing required parameters: token, userId, or goalData.");
  }

  goalData = formatData(goalData, MAP_USER_GOAL_DATA_NAME_TO_PAYLOAD);

  const response = await fetch(`${userGoalsUrl}/${userId}`, {
    method,
    headers: {
      ...JSON_HEADERS,
      ...createAuthorizationHeader(token),
    },
    body: JSON.stringify(goalData),
  });

  const data = await handleFetchResponseErrorsAndData(response);

  return module.exports.parseAndFormatAllGoalResponseData({
    data: [data.goal],
  })[0];
}

export function parseAndFormatAllGoalResponseData({ data }) {
  const response = [];

  data.forEach((item) => {
    const formattedData = formatData(item, MAP_USER_GOAL_RESPONSE_NAME_TO_DATA);
    const parsedIntegers = parseNumeric({
      data: {
        height: formattedData.height,
        goalCalories: formattedData.goalCalories,
        goalProtein: formattedData.goalProtein,
        goalCarbs: formattedData.goalCarbs,
        goalFat: formattedData.goalFat,
      },
    });

    const decimalData = {
      startingWeight: formattedData.startingWeight,
      goalWeight: formattedData.goalWeight,
    };
    if (formattedData.weeklyRate !== undefined) {
      decimalData.weeklyRate = formattedData.weeklyRate;
    }
    const parsedDecimals = parseNumeric({
      data: decimalData,
      isDecimal: true,
    });

    response.push({
      ...formattedData,
      ...parsedIntegers,
      ...parsedDecimals,
    });
  });

  return response;
}
