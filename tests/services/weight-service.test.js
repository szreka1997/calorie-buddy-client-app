import { JSON_HEADERS, SERVER_BASE_URL } from "../../constants/urlConstants";
import { MAP_WEIGHT_HISTORY_RESPONSE_NAME_TO_DATA } from "../../constants/fetchConstants";
import { parseNumeric } from "../../utils/helperFunctions";
import { handleFetchResponseErrorsAndData } from "../../utils/errorUtils";
import { createAuthorizationHeader, formatData } from "../../utils/fetchUtils";
import * as WeightService from "../../services/weight-service";

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

describe("Weight Service", () => {
  const token = "token";
  const userId = "user-id";
  const weightId = "weight-id";
  const authHeader = { Authorization: "Bearer token" };
  const weightHistoriesUrl = `${SERVER_BASE_URL}weight-histories`;

  const weight = 72.5;
  const date = "2026-04-12";

  const weightResponseData = {
    id: weightId,
    user_id: userId,
    date,
    weight: "72.5",
  };

  const parsedWeightResponseData = {
    id: weightId,
    userId,
    date,
    weight,
  };

  beforeEach(() => {
    global.fetch = jest.fn();

    parseNumeric.mockImplementation(({ data }) => data);
    handleFetchResponseErrorsAndData.mockResolvedValue(weightResponseData);
    createAuthorizationHeader.mockReturnValue(authHeader);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    delete global.fetch;
  });

  describe("[postNewWeight]", () => {
    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date(date));
      jest
        .spyOn(WeightService, "parseAndFormatAllWeightHistoryResponseData")
        .mockReturnValue([parsedWeightResponseData]);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test.each([
      ["token is missing", undefined, userId, weight],
      ["userId is missing", token, undefined, weight],
      ["weight is missing", token, userId, undefined],
    ])("throws when %s", async (_, tokenArg, userIdArg, weightArg) => {
      await expect(
        WeightService.postNewWeight({
          token: tokenArg,
          userId: userIdArg,
          weight: weightArg,
        }),
      ).rejects.toThrow(
        "Missing required parameters: token, userId, or weight.",
      );
    });

    test("creates new weight entry with POST when today's weight is missing", async () => {
      jest.spyOn(WeightService, "getTodaysWeightByUserId").mockResolvedValue();

      handleFetchResponseErrorsAndData.mockResolvedValue({
        weightEntry: weightResponseData,
      });

      const result = await WeightService.postNewWeight({
        token,
        userId,
        weight,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${weightHistoriesUrl}/${userId}`,
        {
          method: "POST",
          headers: {
            ...JSON_HEADERS,
            ...authHeader,
          },
          body: JSON.stringify({ date, weight }),
        },
      );
      expect(result).toEqual(parsedWeightResponseData);
    });

    test("updates today's weight entry with PUT when record exists", async () => {
      jest
        .spyOn(WeightService, "getTodaysWeightByUserId")
        .mockResolvedValue({ id: weightId });

      handleFetchResponseErrorsAndData.mockResolvedValue({
        weightEntry: weightResponseData,
      });

      const result = await WeightService.postNewWeight({
        token,
        userId,
        weight,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${weightHistoriesUrl}/${weightId}`,
        {
          method: "PUT",
          headers: {
            ...JSON_HEADERS,
            ...authHeader,
          },
          body: JSON.stringify({ date, weight }),
        },
      );
      expect(result).toEqual(parsedWeightResponseData);
    });
  });

  describe("[getWeightByUserId] / [getLast7WeightByUserId] / [getLastWeightByUserId] / [getTodaysWeightByUserId]", () => {
    let spyGetData;

    beforeEach(() => {
      spyGetData = jest.spyOn(WeightService, "getData").mockResolvedValue([]);
    });

    test("getWeightByUserId delegates to getData with multiple rows", async () => {
      await WeightService.getWeightByUserId({ token, userId });
      expect(spyGetData).toHaveBeenCalledWith({
        token,
        userId,
        hasMultipeRows: true,
      });
    });

    test("getLast7WeightByUserId delegates to getData with last7 path", async () => {
      await WeightService.getLast7WeightByUserId({ token, userId });
      expect(spyGetData).toHaveBeenCalledWith({
        token,
        userId,
        path: "last7/",
        hasMultipeRows: true,
      });
    });

    test("getLastWeightByUserId delegates to getData with last path", async () => {
      await WeightService.getLastWeightByUserId({ token, userId });
      expect(spyGetData).toHaveBeenCalledWith({ token, userId, path: "last/" });
    });

    test("getTodaysWeightByUserId delegates to getData with correct path", async () => {
      await WeightService.getTodaysWeightByUserId({ token, userId });
      expect(spyGetData).toHaveBeenCalledWith({
        token,
        userId,
        path: "user-id/",
        isByDate: true,
      });
    });
  });

  describe("[getData]", () => {
    const today = "2026-01-01";

    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date(today));
      jest
        .spyOn(WeightService, "parseAndFormatAllWeightHistoryResponseData")
        .mockReturnValue([parsedWeightResponseData]);
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    test.each([
      ["token is missing", undefined, userId],
      ["userId is missing", token, undefined],
    ])("throws when %s", async (_, tokenArg, userIdArg) => {
      await expect(
        WeightService.getData({ token: tokenArg, userId: userIdArg }),
      ).rejects.toThrow("Missing required parameters: token or userId.");
    });

    test("returns empty object when response has no keys", async () => {
      handleFetchResponseErrorsAndData.mockResolvedValue();

      const result = await WeightService.getData({ token, userId });

      expect(result).toBeUndefined();
    });

    test("returns parsed array when hasMultipeRows is true", async () => {
      handleFetchResponseErrorsAndData.mockResolvedValue([weightResponseData]);

      const result = await WeightService.getData({
        token,
        userId,
        hasMultipeRows: true,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${weightHistoriesUrl}/${userId}`,
        {
          headers: {
            ...JSON_HEADERS,
            ...authHeader,
          },
        },
      );
      expect(result).toEqual([parsedWeightResponseData]);
    });

    test("returns first parsed item when hasMultipeRows is false", async () => {
      handleFetchResponseErrorsAndData.mockResolvedValue(weightResponseData);

      const result = await WeightService.getData({
        token,
        userId,
        path: "last/",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${weightHistoriesUrl}/last/${userId}`,
        {
          headers: {
            ...JSON_HEADERS,
            ...authHeader,
          },
        },
      );
      expect(result).toEqual(parsedWeightResponseData);
    });

    test("returns weight by date when 'isByDate' is true", async () => {
      handleFetchResponseErrorsAndData.mockResolvedValue(weightResponseData);

      const result = await WeightService.getData({
        token,
        userId,
        path: "user-id/",
        isByDate: true,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${weightHistoriesUrl}/user-id/${userId}/date/${today}`,
        {
          headers: {
            ...JSON_HEADERS,
            ...authHeader,
          },
        },
      );
      expect(result).toEqual(parsedWeightResponseData);
    });
  });

  describe("[parseAndFormatAllWeightHistoryResponseData]", () => {
    const formattedWeight = {
      id: weightId,
      userId,
      date,
      weight: "72.5",
    };

    test("formats and parses weight fields", () => {
      formatData.mockReturnValue(formattedWeight);
      parseNumeric.mockReturnValue({ weight: 72.5 });

      const result = WeightService.parseAndFormatAllWeightHistoryResponseData({
        data: [weightResponseData],
      });

      expect(formatData).toHaveBeenCalledWith(
        weightResponseData,
        MAP_WEIGHT_HISTORY_RESPONSE_NAME_TO_DATA,
      );
      expect(parseNumeric).toHaveBeenCalledWith({
        data: {
          weight: "72.5",
        },
        isDecimal: true,
      });
      expect(result).toEqual([parsedWeightResponseData]);
    });
  });
});
