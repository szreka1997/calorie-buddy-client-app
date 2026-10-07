export const HTTP_ERROR_MESSAGES = {
  400: "Bad Request. Please check the data you entered.",
  401: "You are not authorized. Please log in again.",
  403: "You do not have permission to access this resource.",
  404: "The requested resource was not found.",
  408: "Request timed out. Please try again.",
  429: "Too many requests. Slow down a bit!",
  500: "Something went wrong on our end. Please try later.",
  502: "Bad Gateway. The server is temporarily unavailable.",
  503: "Service Unavailable. Try again shortly.",
  504: "Gateway Timeout. Server is taking too long to respond.",

  DEFAULT: "An unexpected error occurred. Please try again.",
};

export const FIREBASE_HTTP_ERROR_MESSAGES = {
  EMAIL_EXISTS: "The email address is already in use by another account.",
  OPERATION_NOT_ALLOWED: "Password sign-in is disabled for this project.",
  TOO_MANY_ATTEMPTS_TRY_LATER:
    "We have blocked all requests from this device due to unusual activity. Try again later.",
  EMAIL_NOT_FOUND: "No account found with this email.",
  INVALID_PASSWORD:
    "You entered an invalid email or password. Please re-enter.",
  INVALID_EMAIL: "You entered an invalid email or password. Please re-enter.",
  INVALID_LOGIN_CREDENTIALS:
    "You entered an invalid email or password. Please re-enter.",
  USER_DISABLED: "The user account has been disabled by an administrator.",

  DEFAULT: "An unexpected error occurred. Please try again.",
};
