import { JSON_HEADERS, SERVER_BASE_URL } from "../constants/urlConstants";
import {
  MAP_MEAL_DATA_NAME_TO_PAYLOAD,
  MAP_MEAL_RESPONSE_NAME_TO_DATA,
  MAP_MEAL_FOOD_DATA_NAME_TO_PAYLOAD,
  MAP_MEAL_FOOD_RESPONSE_NAME_TO_DATA,
} from "../constants/fetchConstants";
import { parseNumeric } from "../utils/helperFunctions";
import { handleFetchResponseErrorsAndData } from "../utils/errorUtils";
import { createAuthorizationHeader, formatData } from "../utils/fetchUtils";

const mealsUrl = `${SERVER_BASE_URL}meals`;

export function postNewMeal({ token, userId, mealData }) {
  if (!token || !userId || !mealData) {
    throw new Error("Missing required parameters: token, userId or mealData.");
  }

  return module.exports.uploadMealData({
    token,
    id: userId,
    mealData,
    method: "POST",
  });
}

export function updateMeal({ token, mealId, mealData }) {
  if (!token || !mealId || !mealData) {
    throw new Error("Missing required parameters: token, mealId or mealData.");
  }

  return module.exports.uploadMealData({
    token,
    id: mealId,
    mealData,
    method: "PUT",
  });
}

export function getMealsByUserId({ token, userId }) {
  if (!token || !userId) {
    throw new Error("Missing required parameters: token or userId.");
  }

  return module.exports.getMealData({ token, id: userId, path: "user-id" });
}

export async function getMealByMealId({ token, mealId }) {
  if (!token || !mealId) {
    throw new Error("Missing required parameters: token or mealId.");
  }

  const data = await module.exports.getMealData({
    token,
    id: mealId,
    path: "meal-id",
  });

  return data[0];
}

// HELPERS
export async function uploadMealData({ token, id, mealData, method }) {
  mealData = formatData(mealData, MAP_MEAL_DATA_NAME_TO_PAYLOAD);
  mealData.foods = mealData.foods.map((food) =>
    formatData(food, MAP_MEAL_FOOD_DATA_NAME_TO_PAYLOAD, true),
  );

  const response = await fetch(`${mealsUrl}/${id}`, {
    method,
    headers: {
      ...JSON_HEADERS,
      ...createAuthorizationHeader(token),
    },
    body: JSON.stringify({ ...mealData }),
  });

  const data = await handleFetchResponseErrorsAndData(response);

  return data;
}

export async function getMealData({ token, id, path }) {
  const response = await fetch(`${mealsUrl}/${path}/${id}`, {
    headers: {
      ...JSON_HEADERS,
      ...createAuthorizationHeader(token),
    },
  });

  const data = await handleFetchResponseErrorsAndData(response);

  return module.exports.parseAndFormatAllMealResponseData({
    data: path === "meal-id" ? [data] : data,
  });
}

export function parseAndFormatAllMealResponseData({ data }) {
  const response = [];

  data.forEach((item) => {
    const formattedData = formatData(item, MAP_MEAL_RESPONSE_NAME_TO_DATA);
    const parsedIntegers = parseNumeric({
      data: {
        kcal: formattedData.kcal,
      },
    });

    const parsedFoods = formattedData.foods.map((item) => {
      const formattedFood = formatData(
        item,
        MAP_MEAL_FOOD_RESPONSE_NAME_TO_DATA,
      );
      const parsedFood = parseNumeric({
        data: formattedFood,
      });
      return parsedFood;
    });

    response.push({
      ...formattedData,
      ...parsedIntegers,
      foods: [...parsedFoods],
    });
  });

  return response;
}
