import { JSON_HEADERS, SERVER_BASE_URL } from "../constants/urlConstants";
import {
  MAP_FOOD_DATA_NAME_TO_PAYLOAD,
  MAP_FOOD_RESPONSE_NAME_TO_DATA,
} from "../constants/fetchConstants";
import { parseNumeric } from "../utils/helperFunctions";
import { handleFetchResponseErrorsAndData } from "../utils/errorUtils";
import { createAuthorizationHeader, formatData } from "../utils/fetchUtils";

const foodsUrl = `${SERVER_BASE_URL}foods`;

export function postNewFood({ token, userId, foodData }) {
  if (!token || !userId || !foodData) {
    throw new Error("Missing required parameters: token, userId, or foodData.");
  }

  return module.exports.uploadFoodData({
    token,
    id: userId,
    foodData,
    method: "POST",
  });
}

export function updateNewFood({ token, foodId, foodData }) {
  if (!token || !foodId || !foodData) {
    throw new Error("Missing required parameters: token, foodId or foodData.");
  }

  return module.exports.uploadFoodData({
    token,
    id: foodId,
    foodData,
    method: "PUT",
  });
}

export async function getFoods() {
  const response = await fetch(foodsUrl, {
    headers: JSON_HEADERS,
  });

  const data = await handleFetchResponseErrorsAndData(response);

  return module.exports.parseAndFormatAllFoodResponseData({ data });
}

export async function getFoodById({ foodId }) {
  if (!foodId) {
    throw new Error("Missing required parameter: foodId.");
  }

  const response = await fetch(`${foodsUrl}/${foodId}`, {
    headers: JSON_HEADERS,
  });

  const data = await handleFetchResponseErrorsAndData(response);

  return module.exports.parseAndFormatAllFoodResponseData({ data: [data] })[0];
}

// HELPERS
export async function uploadFoodData({ token, id, foodData, method }) {
  foodData = formatData(foodData, MAP_FOOD_DATA_NAME_TO_PAYLOAD);

  const response = await fetch(`${foodsUrl}/${id}`, {
    method,
    headers: {
      ...JSON_HEADERS,
      ...createAuthorizationHeader(token),
    },
    body: JSON.stringify({ ...foodData }),
  });

  const data = await handleFetchResponseErrorsAndData(response);

  return module.exports.parseAndFormatAllFoodResponseData({
    data: [data.food],
  })[0];
}

export function parseAndFormatAllFoodResponseData({ data }) {
  const response = [];

  data.forEach((item) => {
    const formattedData = formatData(item, MAP_FOOD_RESPONSE_NAME_TO_DATA);
    const parsedIntegers = parseNumeric({
      data: {
        kcalPer100G: formattedData.kcalPer100G,
        recommendedServingSize: formattedData.recommendedServingSize,
      },
    });
    const parsedDecimals = parseNumeric({
      data: {
        proteinPer100G: formattedData.proteinPer100G,
        carbsPer100G: formattedData.carbsPer100G,
        fatPer100G: formattedData.fatPer100G,
        sugarPer100G: formattedData.sugarPer100G,
        addedSugarPer100G: formattedData.addedSugarPer100G,
      },
      isDecimal: true,
    });

    response.push({
      ...formattedData,
      ...parsedIntegers,
      ...parsedDecimals,
      isVerified: formattedData.isVerified === "Valid",
    });
  });

  return response;
}
