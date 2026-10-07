import { MAP_USER_DATA_NAME_TO_PAYLOAD } from "../../constants/fetchConstants";
import {
  JSON_HEADERS,
  BASE_AUTH_URL,
  BASE_REFRESH_URL,
} from "../../constants/urlConstants";
import { formatData } from "../../utils/fetchUtils";
import { handleFetchResponseErrorsAndData } from "../../utils/errorUtils";
import * as AuthService from "../../services/auth-service";

jest.mock("../../utils/fetchUtils", () => ({
  formatData: jest.fn(),
}));

jest.mock("../../utils/errorUtils", () => ({
  handleFetchResponseErrorsAndData: jest.fn(),
}));

describe("Auth Service", () => {
  const id = "id";
  const email = "test@example.com";
  const password = "password123";
  const token = "token";
  const refreshToken = "refresh-token";

  const userPayload = {
    firstName: "John",
    lastName: "Doe",
    username: "jdoe",
  };
  const formattedUser = {
    first_name: "John",
    last_name: "Doe",
    username: "jdoe",
  };
  const fetchResponse = {
    user: {
      id,
      firebase_id_token: token,
      firebase_refresh_token: refreshToken,
    },
  };

  beforeEach(() => {
    global.fetch = jest.fn();
    global.fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(fetchResponse),
    });

    formatData.mockReturnValue(formattedUser);
    handleFetchResponseErrorsAndData.mockResolvedValue(fetchResponse);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    delete global.fetch;
  });

  describe("[signupUser]", () => {
    let spyAuthenticate;

    beforeEach(() => {
      spyAuthenticate = jest
        .spyOn(AuthService, "authenticate")
        .mockResolvedValue({ id, token, refreshToken });
    });

    test.each([
      ["email is missing", undefined, password, userPayload],
      ["password is missing", email, undefined, userPayload],
      ["user is missing", email, password, undefined],
    ])("throws when %s", (_, emailArg, passwordArg, userArg) => {
      expect(() =>
        AuthService.signupUser({
          email: emailArg,
          password: passwordArg,
          user: userArg,
        }),
      ).toThrow("Missing required parameters: email, password or user");
    });

    test("formats user data and calls authenticate with formatted user", async () => {
      const result = await AuthService.signupUser({
        email,
        password,
        user: userPayload,
      });

      expect(formatData).toHaveBeenCalledWith(
        userPayload,
        MAP_USER_DATA_NAME_TO_PAYLOAD,
        true,
      );
      expect(spyAuthenticate).toHaveBeenCalledWith({
        email,
        password,
        user: formattedUser,
      });
      expect(result).toEqual({ id, token, refreshToken });
    });
  });

  describe("[loginUser]", () => {
    let spyAuthenticate;

    beforeEach(() => {
      spyAuthenticate = jest
        .spyOn(AuthService, "authenticate")
        .mockResolvedValue({ id, token, refreshToken });
    });

    test.each([
      ["email is missing", undefined, password],
      ["password is missing", email, undefined],
    ])("throws when %s", (_, emailArg, passwordArg) => {
      expect(() =>
        AuthService.loginUser({ email: emailArg, password: passwordArg }),
      ).toThrow("Missing required parameters: email, or password");
    });

    test("calls authenticate with email and password", async () => {
      const result = await AuthService.loginUser({ email, password });

      expect(spyAuthenticate).toHaveBeenCalledWith({ email, password });
      expect(result).toEqual({ id, token, refreshToken });
    });
  });

  describe("[refreshIdToken]", () => {
    const refreshResponse = {
      firebaseTokens: {
        id_token: token,
        refresh_token: refreshToken,
      },
    };

    beforeEach(() => {
      handleFetchResponseErrorsAndData.mockResolvedValue(refreshResponse);
    });

    test.each([
      ["userId is missing", undefined, refreshToken],
      ["refreshToken is missing", id, undefined],
    ])("throws when %s", async (_, userIdArg, refreshTokenArg) => {
      await expect(
        AuthService.refreshIdToken({
          userId: userIdArg,
          refreshToken: refreshTokenArg,
        }),
      ).rejects.toThrow("Missing required parameters: userId or refreshToken");
    });

    test("calls refresh endpoint and returns token data", async () => {
      const result = await AuthService.refreshIdToken({
        userId: id,
        refreshToken,
      });

      expect(global.fetch).toHaveBeenCalledWith(`${BASE_REFRESH_URL}${id}`, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({ refreshToken }),
      });
      expect(handleFetchResponseErrorsAndData).toHaveBeenCalled();
      expect(result).toEqual({ token, refreshToken });
    });
  });

  describe("[authenticate]", () => {
    test("calls login endpoint and returns mapped auth data when user is not provided", async () => {
      const result = await AuthService.authenticate({ email, password });

      expect(global.fetch).toHaveBeenCalledWith(`${BASE_AUTH_URL}login`, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({ email, password }),
      });
      expect(handleFetchResponseErrorsAndData).toHaveBeenCalled();
      expect(result).toEqual({ id, token, refreshToken });
    });

    test("calls signup endpoint with user payload and returns mapped auth data", async () => {
      const result = await AuthService.authenticate({
        email,
        password,
        user: formattedUser,
      });

      expect(global.fetch).toHaveBeenCalledWith(`${BASE_AUTH_URL}signup`, {
        method: "POST",
        headers: JSON_HEADERS,
        body: JSON.stringify({ email, password, user: formattedUser }),
      });
      expect(handleFetchResponseErrorsAndData).toHaveBeenCalled();
      expect(result).toEqual({ id, token, refreshToken });
    });
  });
});
