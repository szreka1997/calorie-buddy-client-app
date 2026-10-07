import { SERVER_BASE_URL, JSON_HEADERS } from "../constants/urlConstants";
import {
  MAP_USER_DATA_NAME_TO_PAYLOAD,
  MAP_USER_RESPONSE_NAME_TO_DATA,
} from "../constants/fetchConstants";
import { handleFetchResponseErrorsAndData } from "../utils/errorUtils";
import { createAuthorizationHeader, formatData } from "../utils/fetchUtils";

const usersUrl = `${SERVER_BASE_URL}users`;

export async function updateUserData({ token, userId, userData }) {
  if (!token || !userId || !userData) {
    throw new Error("Missing required parameters: token, userId, or userData.");
  }

  userData = formatData(userData, MAP_USER_DATA_NAME_TO_PAYLOAD, true);

  const response = await fetch(`${usersUrl}/${userId}`, {
    method: "PATCH",
    headers: {
      ...JSON_HEADERS,
      ...createAuthorizationHeader(token),
    },
    body: JSON.stringify(userData),
  });

  const data = await handleFetchResponseErrorsAndData(response);

  return formatData(data.user, MAP_USER_RESPONSE_NAME_TO_DATA);
}

export async function getUser({ token, userId }) {
  if (!token || !userId) {
    throw new Error("Missing required parameters: token, or userId");
  }

  const response = await fetch(`${usersUrl}/${userId}`, {
    headers: {
      ...JSON_HEADERS,
      ...createAuthorizationHeader(token),
    },
  });

  const data = await handleFetchResponseErrorsAndData(response);

  return formatData(data, MAP_USER_RESPONSE_NAME_TO_DATA);
}
