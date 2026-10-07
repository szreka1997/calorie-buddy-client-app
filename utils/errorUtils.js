import {
  HTTP_ERROR_MESSAGES,
  FIREBASE_HTTP_ERROR_MESSAGES,
} from "../constants/alertConstants";

/**
 * Extracts a user-friendly error message.
 *
 * This function normalizes and interprets errors coming from multiple sources
 * (Firebase, HTTP responses, generic JS errors). It attempts to map known
 * error codes/messages to predefined human-readable messages.
 *
 * Priority order:
 * 1. Firebase error message mapping
 * 2. HTTP status code mapping
 * 3. Extracted and normalized error messages from response or error object
 * 4. Default fallback message
 *
 * @param {*} error - The error object, string, or any thrown value.
 * @returns {string} A user-friendly error message.
 */
export function getErrorMessage(error) {
  if (!error) return HTTP_ERROR_MESSAGES.DEFAULT;

  const firebaseMessage =
    typeof error?.message === "string"
      ? FIREBASE_HTTP_ERROR_MESSAGES[error.message]
      : undefined;

  if (firebaseMessage) return firebaseMessage;

  const status =
    error?.status ??
    error?.statusCode ??
    error?.response?.status ??
    error?.response?.data?.status;

  if (status) return HTTP_ERROR_MESSAGES[status] || HTTP_ERROR_MESSAGES.DEFAULT;

  const candidates = [
    error?.response?.data?.error,
    error?.response?.data?.message,
    error?.message,
    error?.error,
    error,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeMessage(candidate);
    if (normalized) return normalized;
  }

  return HTTP_ERROR_MESSAGES.DEFAULT;
}

/**
 * Handles a fetch API response by parsing JSON data and throwing a formatted error if needed.
 *
 * If the response is not OK, the function constructs a normalized
 * error payload and throws an Error with a user-friendly message resolved via `getErrorMessage`.
 *
 * If the response is successful, the parsed JSON data is returned.
 *
 * @param {Response} response - The Fetch API response object.
 * @returns {Promise<any>} The parsed JSON response data.
 *
 * @throws {Error} Throws a formatted error when the HTTP response indicates failure.
 */
export async function handleFetchResponseErrorsAndData(response) {
  const data = await response.json();

  if (!response.ok) {
    const errorPayload = {
      status: response.status,
      message: data?.error ?? data?.message ?? data,
      error: data?.error,
      response: { data, status: response.status },
    };

    throw new Error(getErrorMessage(errorPayload));
  }

  return data;
}

// HELPERS

/**
 * Normalizes different types of values into a clean string message.
 *
 * This utility attempts to extract meaningful text from strings, numbers,
 * booleans, objects, and arrays, commonly used for error handling and logging.
 *
 * Resolution strategy:
 * - Returns undefined for null/undefined/empty strings
 * - Extracts nested `message` or `error` fields from objects
 * - Flattens arrays into comma-separated messages
 * - Falls back to JSON stringification or String conversion
 *
 * @param {*} value - The value to normalize into a readable message.
 * @returns {string|undefined} A normalized string message, or undefined if empty.
 */
export function normalizeMessage(value) {
  if (value === null || value === undefined) return undefined;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  }

  if (typeof value === "object") {
    if (typeof value.message === "string") {
      return normalizeMessage(value.message);
    }

    if (value.message) {
      const nestedMessage = normalizeMessage(value.message);
      if (nestedMessage) return nestedMessage;
    }

    if (typeof value.error === "string") return normalizeMessage(value.error);

    if (value.error) {
      const nestedError = normalizeMessage(value.error);
      if (nestedError) return nestedError;
    }

    if (Array.isArray(value)) {
      const parts = value.map((item) => normalizeMessage(item)).filter(Boolean);

      if (parts.length) return parts.join(", ");
    }

    try {
      const json = JSON.stringify(value);
      return json === "{}" ? undefined : json;
    } catch (error) {
      return String(value);
    }
  }

  return String(value);
}
