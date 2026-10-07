import { JSON_HEADERS, SERVER_BASE_URL } from "../../constants/urlConstants";
import { parseNumeric } from "../../utils/helperFunctions";
import { createAuthorizationHeader } from "../../utils/fetchUtils";
import { handleFetchResponseErrorsAndData } from "../../utils/errorUtils";
import {
  getDateLabelName,
  getDateShortStringFormat,
} from "../../utils/dateUtils";
import * as CalorieDeficitService from "../../services/calorie-deficit-service";

jest.mock("../../utils/helperFunctions", () => ({
  parseNumeric: jest.fn(),
}));

jest.mock("../../utils/dateUtils", () => ({
  getDateLabelName: jest.fn(),
  getDateShortStringFormat: jest.fn(),
}));

jest.mock("../../utils/fetchUtils", () => ({
  createAuthorizationHeader: jest.fn(),
}));

jest.mock("../../utils/errorUtils", () => ({
  handleFetchResponseErrorsAndData: jest.fn(),
}));

describe("Calorie Deficit Service", () => {
  const token = "token";
  const userId = "user-id";
  const authorizationHeader = { Authorization: `Bearer ${token}` };
  const today = "2026-01-01";

  beforeEach(() => {
    global.fetch = jest.fn();
    createAuthorizationHeader.mockReturnValue(authorizationHeader);
    getDateShortStringFormat.mockReturnValue(today);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    delete global.fetch;
  });

  describe("[getCalorieDeficit]", () => {
    const rawData = [
      { calories: "1800", date: "2026-04-09T00:00:00.000Z" },
      { calories: "1650", date: "2026-04-10T00:00:00.000Z" },
    ];
    const parsedAndFormattedData = [
      { calories: 1800, date: "Apr 9" },
      { calories: 1650, date: "Apr 10" },
    ];

    beforeEach(() => {
      global.fetch.mockResolvedValue({ ok: true, json: jest.fn() });
      handleFetchResponseErrorsAndData.mockResolvedValue(rawData);
      jest
        .spyOn(
          CalorieDeficitService,
          "parseAndFormatAllCalorieDeficitResponseData",
        )
        .mockReturnValue(parsedAndFormattedData);
    });

    test.each([
      ["token is missing", undefined, userId],
      ["userId is missing", token, undefined],
    ])("throws when %s", async (_, tokenArg, userIdArg) => {
      await expect(
        CalorieDeficitService.getCalorieDeficit({
          token: tokenArg,
          userId: userIdArg,
        }),
      ).rejects.toThrow("Missing required parameters: token or userId.");
    });

    test("calls endpoint and returns parsed/ formatted calorie deficit data", async () => {
      const result = await CalorieDeficitService.getCalorieDeficit({
        token,
        userId,
      });

      expect(createAuthorizationHeader).toHaveBeenCalledWith(token);
      expect(global.fetch).toHaveBeenCalledWith(
        `${SERVER_BASE_URL}calories-deficits/user-id/${userId}/today/${today}`,
        {
          headers: {
            ...JSON_HEADERS,
            ...authorizationHeader,
          },
        },
      );
      expect(handleFetchResponseErrorsAndData).toHaveBeenCalled();
      expect(
        CalorieDeficitService.parseAndFormatAllCalorieDeficitResponseData,
      ).toHaveBeenCalledWith({ data: rawData });
      expect(result).toEqual(parsedAndFormattedData);
    });
  });

  describe("[parseAndFormatAllCalorieDeficitResponseData]", () => {
    test("parses calories and formats date for each item", () => {
      const data = [
        { calories: "2000", date: "2026-04-08T00:00:00.000Z" },
        { calories: "1750", date: "2026-04-09T00:00:00.000Z" },
      ];

      parseNumeric
        .mockReturnValueOnce({ calories: 2000 })
        .mockReturnValueOnce({ calories: 1750 });
      getDateLabelName
        .mockReturnValueOnce("Apr 8")
        .mockReturnValueOnce("Apr 9");

      const result =
        CalorieDeficitService.parseAndFormatAllCalorieDeficitResponseData({
          data,
        });

      expect(parseNumeric).toHaveBeenNthCalledWith(1, {
        data: { calories: "2000" },
      });
      expect(parseNumeric).toHaveBeenNthCalledWith(2, {
        data: { calories: "1750" },
      });
      expect(getDateLabelName).toHaveBeenNthCalledWith(1, data[0].date);
      expect(getDateLabelName).toHaveBeenNthCalledWith(2, data[1].date);
      expect(result).toEqual([
        { calories: 2000, date: "Apr 8" },
        { calories: 1750, date: "Apr 9" },
      ]);
    });

    test("returns empty array when response data is empty", () => {
      const result =
        CalorieDeficitService.parseAndFormatAllCalorieDeficitResponseData({
          data: [],
        });

      expect(result).toEqual([]);
      expect(parseNumeric).not.toHaveBeenCalled();
      expect(getDateLabelName).not.toHaveBeenCalled();
    });
  });
});
