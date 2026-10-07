import {
  getNextAuthRouteName,
  getAuthFormFieldsConfig,
} from "../../utils/authUtils";

describe("Auth Utils", () => {
  describe("[getNextAuthRouteName]", () => {
    test("returns 'Login' when no argument is provided", () => {
      expect(getNextAuthRouteName()).toEqual("Login");
    });

    test("returns 'Signup' when isLogin is true", () => {
      expect(getNextAuthRouteName(true)).toEqual("Signup");
    });
  });

  describe("[getAuthFormFieldsConfig]", () => {
    test("returns login form fields with login-specific validation messages", () => {
      const fields = getAuthFormFieldsConfig(true);

      expect(fields).toHaveLength(2);

      const [emailField, passwordField] = fields;

      expect(emailField).toMatchObject({
        name: "email",
        label: "E-mail Address",
        rules: {
          required: "Invalid email format!",
          pattern: {
            message: "Invalid email format!",
            value:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          },
        },
      });

      expect(passwordField).toMatchObject({
        name: "password",
        label: "Password",
        rules: {
          required: "Invalid password format!",
          minLength: {
            value: 6,
            message: "Invalid password format!",
          },
        },
      });
    });

    test("returns signup form fields including name fields with default validation messages", () => {
      const fields = getAuthFormFieldsConfig();

      expect(fields).toHaveLength(5);

      const [
        usernameField,
        firstNameField,
        lastNameField,
        emailField,
        passwordField,
      ] = fields;

      function expectStringField(field, name, label) {
        expect(field).toEqual({
          name,
          label,
          placeholderText: "",
          rules: {
            required: `${label} is required!`,
            minLength: {
              value: 3,
              message: `${label} must be at least 3 character long!`,
            },
            maxLength: {
              value: 50,
              message: `${label} must be maximum 50 character long!`,
            },
          },
        });
      }

      expectStringField(usernameField, "username", "Username");
      expectStringField(firstNameField, "firstName", "First Name");
      expectStringField(lastNameField, "lastName", "Last Name");

      expect(emailField).toMatchObject({
        name: "email",
        label: "E-mail Address",
        rules: {
          required: "Email is required!",
          pattern: {
            message: "Invalid email format!",
            value:
              /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          },
        },
      });

      expect(passwordField).toMatchObject({
        name: "password",
        label: "Password",
        rules: {
          required: "Password is required!",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters!",
          },
        },
      });
    });
  });
});
