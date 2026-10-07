import { JSON_HEADERS, SERVER_BASE_URL } from "../../constants/urlConstants";
import {
  MAP_USER_GOAL_DATA_NAME_TO_PAYLOAD,
  MAP_USER_GOAL_RESPONSE_NAME_TO_DATA,
} from "../../constants/fetchConstants";
import { parseNumeric } from "../../utils/helperFunctions";
import { handleFetchResponseErrorsAndData } from "../../utils/errorUtils";
import { createAuthorizationHeader, formatData } from "../../utils/fetchUtils";
import * as GoalService from "../../services/goal-service";

jest.mock("../../utils/helperFunctions", () => ({
  parseNumeric: jest.fn(),
}));

jest.mock("../../utils/errorUtils", () => ({
  handleFetchResponseErrorsAndData: jest.fn(),
}));

jest.mock("../../utils/fetchUtils", () => ({
  createAuthorizationHeader: jest.fn(),
  formatData: jest.fn(),
}));

describe("Goal Service", () => {
  const token = "token";
  const userId = "user-id";
  const authHeader = { Authorization: "Bearer token" };
  const userGoalsUrl = `${SERVER_BASE_URL}user-goals`;

  const goalPayload = {
    height: 175,
    startingWeight: 80.5,
    goalWeight: 75.5,
    goalCalories: 2200,
    goalProtein: 140,
    goalCarbs: 220,
    goalFat: 70,
    weeklyRate: 0.5,
  };

  const formattedGoalPayload = {
    height: 175,
    starting_weight: 80.5,
    goal_weight: 75.5,
    goal_calories: 2200,
    goal_protein: 140,
    goal_carbs: 220,
    goal_fat: 70,
    weekly_rate: 0.5,
  };

  const goalResponseData = {
    user_id: userId,
    ...formattedGoalPayload,
  };

  const parsedGoalResponseData = {
    userId,
    ...goalPayload,
  };

  beforeEach(() => {
    global.fetch = jest.fn();

    parseNumeric.mockImplementation(({ data }) => data);
    handleFetchResponseErrorsAndData.mockResolvedValue(goalResponseData);
    createAuthorizationHeader.mockReturnValue(authHeader);
    formatData.mockReturnValue(formattedGoalPayload);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    delete global.fetch;
  });

  describe("[postNewGoal]", () => {
    let spyUploadGoal;

    beforeEach(() => {
      spyUploadGoal = jest
        .spyOn(GoalService, "uploadGoal")
        .mockResolvedValue(parsedGoalResponseData);
    });

    test("calls uploadGoal with POST payload", async () => {
      const result = await GoalService.postNewGoal({
        token,
        userId,
        goalData: goalPayload,
      });

      expect(spyUploadGoal).toHaveBeenCalledWith({
        token,
        userId,
        goalData: goalPayload,
        method: "POST",
      });
      expect(result).toEqual(parsedGoalResponseData);
    });
  });

  describe("[updateGoal]", () => {
    let spyUploadGoal;

    beforeEach(() => {
      spyUploadGoal = jest
        .spyOn(GoalService, "uploadGoal")
        .mockResolvedValue(parsedGoalResponseData);
    });

    test("calls uploadGoal with PUT payload", async () => {
      const result = await GoalService.updateGoal({
        token,
        userId,
        goalData: goalPayload,
      });

      expect(spyUploadGoal).toHaveBeenCalledWith({
        token,
        userId,
        goalData: goalPayload,
        method: "PUT",
      });
      expect(result).toEqual(parsedGoalResponseData);
    });
  });

  describe("[getGoal]", () => {
    beforeEach(() => {
      jest
        .spyOn(GoalService, "parseAndFormatAllGoalResponseData")
        .mockReturnValue([parsedGoalResponseData]);
    });

    test.each([
      ["token is missing", undefined, userId],
      ["userId is missing", token, undefined],
    ])("throws when %s", async (_, tokenArg, userIdArg) => {
      await expect(
        GoalService.getGoal({ token: tokenArg, userId: userIdArg }),
      ).rejects.toThrow("Missing required parameters: token or userId.");
    });

    test("calls user-goals endpoint and returns parsed goal", async () => {
      const result = await GoalService.getGoal({ token, userId });

      expect(global.fetch).toHaveBeenCalledWith(`${userGoalsUrl}/${userId}`, {
        headers: {
          ...JSON_HEADERS,
          ...authHeader,
        },
      });
      expect(handleFetchResponseErrorsAndData).toHaveBeenCalled();
      expect(result).toEqual(parsedGoalResponseData);
    });
  });

  describe("[uploadGoal]", () => {
    beforeEach(() => {
      jest
        .spyOn(GoalService, "parseAndFormatAllGoalResponseData")
        .mockReturnValue([parsedGoalResponseData]);
    });

    test.each([
      ["token is missing", undefined, userId, goalPayload],
      ["userId is missing", token, undefined, goalPayload],
      ["goalData is missing", token, userId, undefined],
    ])("throws when %s", async (_, tokenArg, userIdArg, goalDataArg) => {
      await expect(
        GoalService.uploadGoal({
          token: tokenArg,
          userId: userIdArg,
          goalData: goalDataArg,
          method: "POST",
        }),
      ).rejects.toThrow(
        "Missing required parameters: token, userId, or goalData.",
      );
    });

    test("formats payload, uploads and returns parsed goal", async () => {
      handleFetchResponseErrorsAndData.mockResolvedValue({
        goal: goalResponseData,
      });

      const result = await GoalService.uploadGoal({
        token,
        userId,
        goalData: goalPayload,
        method: "POST",
      });

      expect(formatData).toHaveBeenCalledWith(
        goalPayload,
        MAP_USER_GOAL_DATA_NAME_TO_PAYLOAD,
      );
      expect(global.fetch).toHaveBeenCalledWith(`${userGoalsUrl}/${userId}`, {
        method: "POST",
        headers: {
          ...JSON_HEADERS,
          ...authHeader,
        },
        body: JSON.stringify(formattedGoalPayload),
      });
      expect(handleFetchResponseErrorsAndData).toHaveBeenCalled();
      expect(result).toEqual(parsedGoalResponseData);
    });
  });

  describe("[parseAndFormatAllGoalResponseData]", () => {
    const rawGoalData = [{ ...goalResponseData }];
    const formattedGoalResponseData = {
      userId,
      height: "175",
      startingWeight: "80.5",
      goalWeight: "75.5",
      weeklyRate: "0.5",
      goalCalories: "2200",
      goalProtein: "140",
      goalCarbs: "220",
      goalFat: "70",
    };

    test("formats goal data and parses numeric fields", () => {
      formatData.mockReturnValue(formattedGoalResponseData);
      parseNumeric
        .mockReturnValueOnce({
          height: 175,
          goalCalories: 2200,
          goalProtein: 140,
          goalCarbs: 220,
          goalFat: 70,
        })
        .mockReturnValueOnce({
          startingWeight: 80.5,
          goalWeight: 75.5,
          weeklyRate: 0.5,
        });

      const result = GoalService.parseAndFormatAllGoalResponseData({
        data: rawGoalData,
      });

      expect(formatData).toHaveBeenCalledWith(
        rawGoalData[0],
        MAP_USER_GOAL_RESPONSE_NAME_TO_DATA,
      );
      expect(parseNumeric).toHaveBeenNthCalledWith(1, {
        data: {
          height: "175",
          goalCalories: "2200",
          goalProtein: "140",
          goalCarbs: "220",
          goalFat: "70",
        },
      });
      expect(parseNumeric).toHaveBeenNthCalledWith(2, {
        data: {
          startingWeight: "80.5",
          goalWeight: "75.5",
          weeklyRate: "0.5",
        },
        isDecimal: true,
      });
      expect(result).toEqual([parsedGoalResponseData]);
    });

    test("omits weeklyRate from decimal parse when undefined", () => {
      formatData.mockReturnValue({
        ...formattedGoalResponseData,
        weeklyRate: undefined,
      });
      parseNumeric.mockReturnValueOnce({}).mockReturnValueOnce({
        startingWeight: 80.5,
        goalWeight: 75.5,
      });

      GoalService.parseAndFormatAllGoalResponseData({
        data: [{ ...goalResponseData, weeklyRate: undefined }],
      });

      expect(parseNumeric).toHaveBeenNthCalledWith(2, {
        data: {
          startingWeight: "80.5",
          goalWeight: "75.5",
        },
        isDecimal: true,
      });
    });
  });
});
