import { JSON_HEADERS, SERVER_BASE_URL } from "../constants/urlConstants";
import { parseNumeric } from "../utils/helperFunctions";
import { createAuthorizationHeader } from "../utils/fetchUtils";
import { handleFetchResponseErrorsAndData } from "../utils/errorUtils";
import { getDateLabelName, getDateShortStringFormat } from "../utils/dateUtils";

const calorieDeficitUrl = `${SERVER_BASE_URL}calories-deficits`;

export async function getCalorieDeficit({ token, userId }) {
  if (!token || !userId) {
    throw new Error("Missing required parameters: token or userId.");
  }

  const url = `${calorieDeficitUrl}/user-id/${userId}/today/${getDateShortStringFormat(new Date())}`;
  const response = await fetch(url, {
    headers: {
      ...JSON_HEADERS,
      ...createAuthorizationHeader(token),
    },
  });

  const data = await handleFetchResponseErrorsAndData(response);

  return module.exports.parseAndFormatAllCalorieDeficitResponseData({ data });
}

// HELPERS
export function parseAndFormatAllCalorieDeficitResponseData({ data }) {
  const response = [];

  data.forEach((item) => {
    const parsedIntegers = parseNumeric({
      data: {
        calories: item.calories,
      },
    });

    const date = getDateLabelName(item.date);

    response.push({
      ...parsedIntegers,
      date,
    });
  });

  return response;
}
