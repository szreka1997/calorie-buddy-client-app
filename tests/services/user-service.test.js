import { JSON_HEADERS, SERVER_BASE_URL } from "../../constants/urlConstants";
import {
  MAP_USER_DATA_NAME_TO_PAYLOAD,
  MAP_USER_RESPONSE_NAME_TO_DATA,
} from "../../constants/fetchConstants";
import { handleFetchResponseErrorsAndData } from "../../utils/errorUtils";
import { createAuthorizationHeader, formatData } from "../../utils/fetchUtils";
import * as UserService from "../../services/user-service";

jest.mock("../../utils/errorUtils", () => ({
  handleFetchResponseErrorsAndData: jest.fn(),
}));

jest.mock("../../utils/fetchUtils", () => ({
  createAuthorizationHeader: jest.fn(),
  formatData: jest.fn(),
}));

describe("User Service", () => {
  const token = "token";
  const userId = "user-id";
  const usersUrl = `${SERVER_BASE_URL}users`;
  const authHeader = { Authorization: "Bearer token" };

  const email = "jane@doe.com";
  const firstName = "Jane";
  const lastName = "Doe";
  const username = "janedoe";
  const sex = "female";
  const birthday = "1997-01-01";
  const registerDate = "2026-01-01";
  const refreshToken = "firebase-refresh-token";

  const userPayload = {
    firstName,
    lastName,
    username,
    sex,
    birthday,
    registerDate,
  };

  const formattedUserPayload = {
    first_name: firstName,
    last_name: lastName,
    username,
    sex,
    birthday,
    register_date: registerDate,
  };

  const userResponseData = {
    id: userId,
    email_address: email,
    first_name: firstName,
    last_name: lastName,
    username,
    sex,
    birthday,
    register_date: registerDate,
    firebase_id_token: token,
    firebase_refresh_token: refreshToken,
  };

  const parsedUserResponseData = {
    id: userId,
    email,
    ...userPayload,
    token,
    refreshToken,
  };

  beforeEach(() => {
    global.fetch = jest.fn();

    createAuthorizationHeader.mockReturnValue(authHeader);
    handleFetchResponseErrorsAndData.mockResolvedValue({
      user: userResponseData,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    delete global.fetch;
  });

  describe("[updateUserData]", () => {
    test.each([
      ["token is missing", undefined, userId, userPayload],
      ["userId is missing", token, undefined, userPayload],
      ["userData is missing", token, userId, undefined],
    ])("throws when %s", async (_, tokenArg, userIdArg, userDataArg) => {
      await expect(
        UserService.updateUserData({
          token: tokenArg,
          userId: userIdArg,
          userData: userDataArg,
        }),
      ).rejects.toThrow(
        "Missing required parameters: token, userId, or userData.",
      );
    });

    test("formats payload, sends PATCH request and returns mapped user", async () => {
      formatData
        .mockReturnValueOnce(formattedUserPayload)
        .mockReturnValueOnce(parsedUserResponseData);

      const result = await UserService.updateUserData({
        token,
        userId,
        userData: userPayload,
      });

      expect(formatData).toHaveBeenNthCalledWith(
        1,
        userPayload,
        MAP_USER_DATA_NAME_TO_PAYLOAD,
        true,
      );
      expect(global.fetch).toHaveBeenCalledWith(`${usersUrl}/${userId}`, {
        method: "PATCH",
        headers: {
          ...JSON_HEADERS,
          ...authHeader,
        },
        body: JSON.stringify(formattedUserPayload),
      });
      expect(handleFetchResponseErrorsAndData).toHaveBeenCalled();
      expect(formatData).toHaveBeenNthCalledWith(
        2,
        userResponseData,
        MAP_USER_RESPONSE_NAME_TO_DATA,
      );
      expect(result).toEqual(parsedUserResponseData);
    });
  });

  describe("[getUser]", () => {
    test.each([
      ["token is missing", undefined, userId],
      ["userId is missing", token, undefined],
    ])("throws when %s", async (_, tokenArg, userIdArg) => {
      await expect(
        UserService.getUser({
          token: tokenArg,
          userId: userIdArg,
        }),
      ).rejects.toThrow("Missing required parameters: token, or userId");
    });

    test("calls user endpoint and returns mapped user", async () => {
      handleFetchResponseErrorsAndData.mockResolvedValue(userResponseData);
      formatData.mockReturnValue(parsedUserResponseData);

      const result = await UserService.getUser({ token, userId });

      expect(global.fetch).toHaveBeenCalledWith(`${usersUrl}/${userId}`, {
        headers: {
          ...JSON_HEADERS,
          ...authHeader,
        },
      });
      expect(handleFetchResponseErrorsAndData).toHaveBeenCalled();
      expect(formatData).toHaveBeenCalledWith(
        userResponseData,
        MAP_USER_RESPONSE_NAME_TO_DATA,
      );
      expect(result).toEqual(parsedUserResponseData);
    });
  });
});
