import { MEAL } from "../constants/commonConstants";
import { JSON_HEADERS, SERVER_BASE_URL } from "../constants/urlConstants";
import {
  MAP_FOOD_HISTORY_DATA_NAME_TO_PAYLOAD,
  MAP_FOOD_HISTORY_RESPONSE_NAME_TO_DATA,
} from "../constants/fetchConstants";
import { parseNumeric } from "../utils/helperFunctions";
import { getDateShortStringFormat } from "../utils/dateUtils";
import { handleFetchResponseErrorsAndData } from "../utils/errorUtils";
import { createAuthorizationHeader, formatData } from "../utils/fetchUtils";

const foodHistoriesUrl = `${SERVER_BASE_URL}food-histories`;

export function postNewFoodHistoryItem({ token, userId, foodHistoryData }) {
  if (!token || !userId || !foodHistoryData) {
    throw new Error(
      "Missing required parameters: token, userId, or foodHistoryData.",
    );
  }

  return module.exports.uploadData({
    token,
    id: userId,
    foodHistoryData,
    method: "POST",
  });
}

export function updateFoodHistoryItem({
  token,
  foodHistoryId,
  foodHistoryData,
}) {
  if (!token || !foodHistoryId || !foodHistoryData) {
    throw new Error(
      "Missing required parameters: token, foodHistoryId or foodHistoryData.",
    );
  }

  return module.exports.uploadData({
    token,
    id: foodHistoryId,
    foodHistoryData,
    method: "PUT",
  });
}

export async function getLast10FoodHistoriesByUserIdAndByMealCategory({
  token,
  userId,
  mealCategory,
}) {
  if (!token || !userId || !mealCategory) {
    throw new Error(
      "Missing required parameters: token, userId or mealCategory.",
    );
  }

  if (!Object.values(MEAL).includes(mealCategory)) {
    throw new Error("Invalid mealCategory!");
  }

  const formattedMealCategory = mealCategory.toLowerCase().replace(/\s+/g, "-");
  return module.exports.getData({
    token,
    userId,
    pathName: "meal-cat",
    pathValue: formattedMealCategory,
  });
}

export async function getFoodHistoriesByUserIdAndByDateOrderByDate({
  token,
  userId,
  date,
}) {
  if (!token || !userId || !date) {
    throw new Error("Missing required parameters: token, userId or date.");
  }

  return module.exports.getData({
    token,
    userId,
    pathName: "date",
    pathValue: getDateShortStringFormat(date),
  });
}

export async function deleteFoodHistoryItem({ token, foodHistoryId }) {
  if (!token || !foodHistoryId) {
    throw new Error("Missing required parameters: token or foodHistoryId.");
  }

  const response = await fetch(`${foodHistoriesUrl}/${foodHistoryId}`, {
    method: "DELETE",
    headers: {
      ...JSON_HEADERS,
      ...createAuthorizationHeader(token),
    },
  });

  const data = await handleFetchResponseErrorsAndData(response);

  return module.exports.parseAndFormatAllFoodHistoryResponseData({
    data: [data.foodHistory],
  })[0];
}

// HELPERS
export async function uploadData({ token, id, foodHistoryData, method }) {
  foodHistoryData = formatData(
    foodHistoryData,
    MAP_FOOD_HISTORY_DATA_NAME_TO_PAYLOAD,
    true,
  );

  const response = await fetch(`${foodHistoriesUrl}/${id}`, {
    method,
    headers: {
      ...JSON_HEADERS,
      ...createAuthorizationHeader(token),
    },
    body: JSON.stringify({ ...foodHistoryData }),
  });

  const data = await handleFetchResponseErrorsAndData(response);

  return module.exports.parseAndFormatAllFoodHistoryResponseData({
    data: [data.foodHistory],
  })[0];
}

export async function getData({ token, userId, pathName, pathValue }) {
  const response = await fetch(
    `${foodHistoriesUrl}/user-id/${userId}/${pathName}/${pathValue}`,
    {
      headers: {
        ...JSON_HEADERS,
        ...createAuthorizationHeader(token),
      },
    },
  );

  const data = await handleFetchResponseErrorsAndData(response);

  return module.exports.parseAndFormatAllFoodHistoryResponseData({ data });
}

export function parseAndFormatAllFoodHistoryResponseData({ data }) {
  const response = [];

  data.forEach((item) => {
    const formattedData = formatData(
      item,
      MAP_FOOD_HISTORY_RESPONSE_NAME_TO_DATA,
    );
    const parsedIntegers = parseNumeric({
      data: {
        quantity: formattedData.quantity,
      },
    });

    response.push({
      ...formattedData,
      ...parsedIntegers,
    });
  });

  return response;
}
