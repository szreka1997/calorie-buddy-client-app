import { MAP_USER_DATA_NAME_TO_PAYLOAD } from "../constants/fetchConstants";
import {
  JSON_HEADERS,
  BASE_AUTH_URL,
  BASE_REFRESH_URL,
} from "../constants/urlConstants";
import { formatData } from "../utils/fetchUtils";
import { handleFetchResponseErrorsAndData } from "../utils/errorUtils";

const SIGN_UP_MODE = "signup";
const LOGIN_MODE = "login";

export function signupUser({ email, password, user }) {
  if (!email || !password || !user) {
    throw new Error("Missing required parameters: email, password or user");
  }

  return module.exports.authenticate({
    email,
    password,
    user: formatData(user, MAP_USER_DATA_NAME_TO_PAYLOAD, true),
  });
}

export function loginUser({ email, password }) {
  if (!email || !password) {
    throw new Error("Missing required parameters: email, or password");
  }

  return module.exports.authenticate({ email, password });
}

export async function refreshIdToken({ userId, refreshToken }) {
  if (!userId || !refreshToken) {
    throw new Error("Missing required parameters: userId or refreshToken");
  }

  const response = await fetch(`${BASE_REFRESH_URL}${userId}`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify({ refreshToken }),
  });

  const data = await handleFetchResponseErrorsAndData(response);

  const idToken = data.firebaseTokens.id_token;
  const newRefreshToken = data.firebaseTokens.refresh_token;

  return { token: idToken, refreshToken: newRefreshToken };
}

// HELPERS
export async function authenticate({ email, password, user }) {
  const url = `${BASE_AUTH_URL}${user ? SIGN_UP_MODE : LOGIN_MODE}`;
  const payload = user ? { email, password, user } : { email, password };

  const response = await fetch(url, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });

  const data = await handleFetchResponseErrorsAndData(response);

  const id = data.user.id;
  const token = data.user.firebase_id_token;
  const refreshToken = data.user.firebase_refresh_token;

  return { id, token, refreshToken };
}
