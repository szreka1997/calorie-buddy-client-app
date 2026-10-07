import { createStringFields } from "./formUtils";

/**
 * Returns the name of the next authentication route.
 *
 * @param {boolean} [isLogin=false] - Whether the current route is the login page.
 * @returns {"Login" | "Signup"} The opposite auth route name.
 *
 * @example
 * getNextAuthRouteName(true); // "Signup"
 * getNextAuthRouteName(false); // "Login"
 */
export function getNextAuthRouteName(isLogin = false) {
  return isLogin ? "Signup" : "Login";
}

/**
 * Returns the configuration for authentication form fields.
 *
 * @param {boolean} [isLogin=false] - Whether the form is for login (`true`) or signup (`false`).
 * @returns {Array<Object>} An array of field configurations with validation rules.
 *
 * @example
 * getAuthFormFieldsConfig(true);  // returns email + password fields (for login)
 * getAuthFormFieldsConfig(false); // returns username, firstName, lastName, email, password fields (for signup)
 */
export function getAuthFormFieldsConfig(isLogin = false) {
  return [
    !isLogin && createStringFields("username", "Username", ""),
    !isLogin && createStringFields("firstName", "First Name", ""),
    !isLogin && createStringFields("lastName", "Last Name", ""),
    {
      name: "email",
      label: "E-mail Address",
      rules: {
        required: isLogin ? "Invalid email format!" : "Email is required!",
        pattern: {
          value:
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          message: "Invalid email format!",
        },
      },
    },
    {
      name: "password",
      label: "Password",
      rules: {
        required: isLogin
          ? "Invalid password format!"
          : "Password is required!",
        minLength: {
          value: 6,
          message: isLogin
            ? "Invalid password format!"
            : "Password must be at least 6 characters!",
        },
      },
    },
  ].filter(Boolean);
}
