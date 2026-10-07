import { JSON_HEADERS, SERVER_BASE_URL } from "../constants/urlConstants";
import { MAP_WEIGHT_HISTORY_RESPONSE_NAME_TO_DATA } from "../constants/fetchConstants";
import { parseNumeric } from "../utils/helperFunctions";
import { getDateShortStringFormat } from "../utils/dateUtils";
import { handleFetchResponseErrorsAndData } from "../utils/errorUtils";
import { createAuthorizationHeader, formatData } from "../utils/fetchUtils";

const weigthHistoiesUrl = `${SERVER_BASE_URL}weight-histories`;

export async function postNewWeight({ token, userId, weight }) {
  if (!token || !userId || !weight) {
    throw new Error("Missing required parameters: token, userId, or weight.");
  }

  const todaysWeight = await module.exports.getTodaysWeightByUserId({
    token,
    userId,
  });
  const body = JSON.stringify({
    date: getDateShortStringFormat(new Date()),
    weight,
  });

  let response;
  if (Object.keys(todaysWeight || {}).length === 0) {
    response = await fetch(`${weigthHistoiesUrl}/${userId}`, {
      method: "POST",
      headers: {
        ...JSON_HEADERS,
        ...createAuthorizationHeader(token),
      },
      body,
    });
  } else {
    response = await fetch(`${weigthHistoiesUrl}/${todaysWeight.id}`, {
      method: "PUT",
      headers: {
        ...JSON_HEADERS,
        ...createAuthorizationHeader(token),
      },
      body,
    });
  }

  const data = await handleFetchResponseErrorsAndData(response);

  return module.exports.parseAndFormatAllWeightHistoryResponseData({
    data: [data.weightEntry],
  })[0];
}

export function getWeightByUserId({ token, userId }) {
  return module.exports.getData({ token, userId, hasMultipeRows: true });
}

export function getLast7WeightByUserId({ token, userId }) {
  return module.exports.getData({
    token,
    userId,
    path: "last7/",
    hasMultipeRows: true,
  });
}

export function getLastWeightByUserId({ token, userId }) {
  return module.exports.getData({ token, userId, path: "last/" });
}

export function getTodaysWeightByUserId({ token, userId }) {
  return module.exports.getData({
    token,
    userId,
    path: "user-id/",
    isByDate: true,
  });
}

// HELPERS
export async function getData({
  token,
  userId,
  path = "",
  isByDate = false,
  hasMultipeRows = false,
}) {
  if (!token || !userId) {
    throw new Error("Missing required parameters: token or userId.");
  }

  const url = `${weigthHistoiesUrl}/${path}${userId}${isByDate ? `/date/${getDateShortStringFormat(new Date())}` : ""}`;
  const response = await fetch(url, {
    headers: {
      ...JSON_HEADERS,
      ...createAuthorizationHeader(token),
    },
  });

  const data = await handleFetchResponseErrorsAndData(response);

  if (Object.keys(data || {}).length === 0) return data;
  return hasMultipeRows
    ? module.exports.parseAndFormatAllWeightHistoryResponseData({ data })
    : module.exports.parseAndFormatAllWeightHistoryResponseData({
        data: [data],
      })[0];
}

export function parseAndFormatAllWeightHistoryResponseData({ data }) {
  const response = [];

  data.forEach((item) => {
    const formattedData = formatData(
      item,
      MAP_WEIGHT_HISTORY_RESPONSE_NAME_TO_DATA,
    );
    const parsedDecimals = parseNumeric({
      data: {
        weight: formattedData.weight,
      },
      isDecimal: true,
    });

    response.push({
      ...formattedData,
      ...parsedDecimals,
    });
  });

  return response;
}
