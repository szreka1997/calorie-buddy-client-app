import { MEAL } from "../../constants/commonConstants";
import { JSON_HEADERS, SERVER_BASE_URL } from "../../constants/urlConstants";
import {
  MAP_FOOD_HISTORY_DATA_NAME_TO_PAYLOAD,
  MAP_FOOD_HISTORY_RESPONSE_NAME_TO_DATA,
} from "../../constants/fetchConstants";
import { parseNumeric } from "../../utils/helperFunctions";
import { getDateShortStringFormat } from "../../utils/dateUtils";
import { handleFetchResponseErrorsAndData } from "../../utils/errorUtils";
import { createAuthorizationHeader, formatData } from "../../utils/fetchUtils";
import * as FoodHistoryService from "../../services/food-history-service";

jest.mock("../../utils/helperFunctions", () => ({
  parseNumeric: jest.fn(),
}));

jest.mock("../../utils/dateUtils", () => ({
  getDateShortStringFormat: jest.fn(),
}));

jest.mock("../../utils/errorUtils", () => ({
  handleFetchResponseErrorsAndData: jest.fn(),
}));

jest.mock("../../utils/fetchUtils", () => ({
  createAuthorizationHeader: jest.fn(),
  formatData: jest.fn(),
}));

describe("Food History Service", () => {
  const token = "token";
  const userId = "user-id";
  const foodId = "food-id";
  const foodHistoryId = "food-history-id";
  const authHeader = { Authorization: "Bearer token" };
  const foodHistoriesUrl = `${SERVER_BASE_URL}food-histories`;

  const date = "2024-10-11";
  const quantity = 200;
  const mealCategory = MEAL.BREAKFAST;
  const formattedMealCategory = "breakfast";

  const foodHistoryPayload = {
    mealCategory,
    quantity,
    date,
  };

  const formattedFoodHistoryPayload = {
    ...foodHistoryPayload,
    meal_category: formattedMealCategory,
  };

  const foodHistoryResponseData = {
    ...formattedFoodHistoryPayload,
    id: foodHistoryId,
    user_id: userId,
    food_id: foodId,
  };

  const parsedFoodHistoryResponseData = {
    ...foodHistoryPayload,
    id: foodHistoryId,
    userId,
    foodId,
  };

  beforeEach(() => {
    global.fetch = jest.fn();

    parseNumeric.mockImplementation(({ data }) => data);
    getDateShortStringFormat.mockReturnValue(date);
    handleFetchResponseErrorsAndData.mockResolvedValue(foodHistoryResponseData);
    createAuthorizationHeader.mockReturnValue(authHeader);
    formatData.mockReturnValue(formattedFoodHistoryPayload);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    delete global.fetch;
  });

  describe("[postNewFoodHistoryItem]", () => {
    let spyUploadData;

    beforeEach(() => {
      spyUploadData = jest
        .spyOn(FoodHistoryService, "uploadData")
        .mockResolvedValue(parsedFoodHistoryResponseData);
    });

    test.each([
      ["token is missing", undefined, userId, foodHistoryPayload],
      ["userId is missing", token, undefined, foodHistoryPayload],
      ["foodHistoryData is missing", token, userId, undefined],
    ])("throws when %s", (_, tokenArg, userIdArg, foodHistoryDataArg) => {
      expect(() =>
        FoodHistoryService.postNewFoodHistoryItem({
          token: tokenArg,
          userId: userIdArg,
          foodHistoryData: foodHistoryDataArg,
        }),
      ).toThrow(
        "Missing required parameters: token, userId, or foodHistoryData.",
      );
    });

    test("calls uploadData with POST payload", async () => {
      const result = await FoodHistoryService.postNewFoodHistoryItem({
        token,
        userId,
        foodHistoryData: foodHistoryPayload,
      });

      expect(spyUploadData).toHaveBeenCalledWith({
        token,
        id: userId,
        foodHistoryData: foodHistoryPayload,
        method: "POST",
      });
      expect(result).toEqual(parsedFoodHistoryResponseData);
    });
  });

  describe("[updateFoodHistoryItem]", () => {
    let spyUploadData;

    beforeEach(() => {
      spyUploadData = jest
        .spyOn(FoodHistoryService, "uploadData")
        .mockResolvedValue(parsedFoodHistoryResponseData);
    });

    test.each([
      ["token is missing", undefined, foodHistoryId, foodHistoryPayload],
      ["foodHistoryId is missing", token, undefined, foodHistoryPayload],
      ["foodHistoryData is missing", token, foodHistoryId, undefined],
    ])(
      "throws when %s",
      (_, tokenArg, foodHistoryIdArg, foodHistoryDataArg) => {
        expect(() =>
          FoodHistoryService.updateFoodHistoryItem({
            token: tokenArg,
            foodHistoryId: foodHistoryIdArg,
            foodHistoryData: foodHistoryDataArg,
          }),
        ).toThrow(
          "Missing required parameters: token, foodHistoryId or foodHistoryData.",
        );
      },
    );

    test("calls uploadData with PUT payload", async () => {
      const result = await FoodHistoryService.updateFoodHistoryItem({
        token,
        foodHistoryId,
        foodHistoryData: foodHistoryPayload,
      });

      expect(spyUploadData).toHaveBeenCalledWith({
        token,
        id: foodHistoryId,
        foodHistoryData: foodHistoryPayload,
        method: "PUT",
      });
      expect(result).toEqual(parsedFoodHistoryResponseData);
    });
  });

  describe("[getLast10FoodHistoriesByUserIdAndByMealCategory]", () => {
    let spyGetData;

    beforeEach(() => {
      spyGetData = jest
        .spyOn(FoodHistoryService, "getData")
        .mockResolvedValue([parsedFoodHistoryResponseData]);
    });

    test.each([
      ["token is missing", undefined, userId, MEAL.BREAKFAST],
      ["userId is missing", token, undefined, MEAL.BREAKFAST],
      ["mealCategory is missing", token, userId, undefined],
    ])("throws when %s", async (_, tokenArg, userIdArg, mealCategoryArg) => {
      await expect(
        FoodHistoryService.getLast10FoodHistoriesByUserIdAndByMealCategory({
          token: tokenArg,
          userId: userIdArg,
          mealCategory: mealCategoryArg,
        }),
      ).rejects.toThrow(
        "Missing required parameters: token, userId or mealCategory.",
      );
    });

    test("throws when mealCategory is invalid", async () => {
      await expect(
        FoodHistoryService.getLast10FoodHistoriesByUserIdAndByMealCategory({
          token,
          userId,
          mealCategory: "INVALID",
        }),
      ).rejects.toThrow("Invalid mealCategory!");
    });

    test("calls getData with normalized meal category", async () => {
      const result =
        await FoodHistoryService.getLast10FoodHistoriesByUserIdAndByMealCategory(
          {
            token,
            userId,
            mealCategory,
          },
        );

      expect(spyGetData).toHaveBeenCalledWith({
        token,
        userId,
        pathName: "meal-cat",
        pathValue: formattedMealCategory,
      });
      expect(result).toEqual([parsedFoodHistoryResponseData]);
    });
  });

  describe("[getFoodHistoriesByUserIdAndByDateOrderByDate]", () => {
    let spyGetData;

    beforeEach(() => {
      spyGetData = jest
        .spyOn(FoodHistoryService, "getData")
        .mockResolvedValue([parsedFoodHistoryResponseData]);
    });

    test.each([
      ["token is missing", undefined, userId, new Date("2024-10-11")],
      ["userId is missing", token, undefined, new Date("2024-10-11")],
      ["date is missing", token, userId, undefined],
    ])("throws when %s", async (_, tokenArg, userIdArg, dateArg) => {
      await expect(
        FoodHistoryService.getFoodHistoriesByUserIdAndByDateOrderByDate({
          token: tokenArg,
          userId: userIdArg,
          date: dateArg,
        }),
      ).rejects.toThrow("Missing required parameters: token, userId or date.");
    });

    test("formats date and calls getData", async () => {
      const localDate = new Date(date);

      const result =
        await FoodHistoryService.getFoodHistoriesByUserIdAndByDateOrderByDate({
          token,
          userId,
          date: localDate,
        });

      expect(getDateShortStringFormat).toHaveBeenCalledWith(localDate);
      expect(spyGetData).toHaveBeenCalledWith({
        token,
        userId,
        pathName: "date",
        pathValue: date,
      });
      expect(result).toEqual([parsedFoodHistoryResponseData]);
    });
  });

  describe("[deleteFoodHistoryItem]", () => {
    beforeEach(() => {
      jest
        .spyOn(FoodHistoryService, "parseAndFormatAllFoodHistoryResponseData")
        .mockReturnValue([parsedFoodHistoryResponseData]);
    });

    test.each([
      ["token is missing", undefined, foodHistoryId],
      ["foodHistoryId is missing", token, undefined],
    ])("throws when %s", async (_, tokenArg, foodHistoryIdArg) => {
      await expect(
        FoodHistoryService.deleteFoodHistoryItem({
          token: tokenArg,
          foodHistoryId: foodHistoryIdArg,
        }),
      ).rejects.toThrow("Missing required parameters: token or foodHistoryId.");
    });

    test("calls delete endpoint and returns parsed item", async () => {
      const result = await FoodHistoryService.deleteFoodHistoryItem({
        token,
        foodHistoryId,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${foodHistoriesUrl}/${foodHistoryId}`,
        {
          method: "DELETE",
          headers: {
            ...JSON_HEADERS,
            ...authHeader,
          },
        },
      );
      expect(handleFetchResponseErrorsAndData).toHaveBeenCalled();
      expect(result).toEqual(parsedFoodHistoryResponseData);
    });
  });

  describe("[uploadData]", () => {
    beforeEach(() => {
      jest
        .spyOn(FoodHistoryService, "parseAndFormatAllFoodHistoryResponseData")
        .mockReturnValue([parsedFoodHistoryResponseData]);
    });

    test("formats payload, uploads data and returns parsed item", async () => {
      const result = await FoodHistoryService.uploadData({
        token,
        id: userId,
        foodHistoryData: foodHistoryPayload,
        method: "POST",
      });

      expect(formatData).toHaveBeenCalledWith(
        foodHistoryPayload,
        MAP_FOOD_HISTORY_DATA_NAME_TO_PAYLOAD,
        true,
      );
      expect(global.fetch).toHaveBeenCalledWith(
        `${foodHistoriesUrl}/${userId}`,
        {
          method: "POST",
          headers: {
            ...JSON_HEADERS,
            ...authHeader,
          },
          body: JSON.stringify({ ...formattedFoodHistoryPayload }),
        },
      );
      expect(handleFetchResponseErrorsAndData).toHaveBeenCalled();
      expect(result).toEqual(parsedFoodHistoryResponseData);
    });
  });

  describe("[getData]", () => {
    beforeEach(() => {
      jest
        .spyOn(FoodHistoryService, "parseAndFormatAllFoodHistoryResponseData")
        .mockReturnValue([parsedFoodHistoryResponseData]);
    });

    test("calls endpoint by path and returns parsed list", async () => {
      const result = await FoodHistoryService.getData({
        token,
        userId,
        pathName: "date",
        pathValue: date,
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${foodHistoriesUrl}/user-id/${userId}/date/${date}`,
        {
          headers: {
            ...JSON_HEADERS,
            ...authHeader,
          },
        },
      );
      expect(handleFetchResponseErrorsAndData).toHaveBeenCalled();
      expect(result).toEqual([parsedFoodHistoryResponseData]);
    });
  });

  describe("[parseAndFormatAllFoodHistoryResponseData]", () => {
    const rawData = [{ quantity: "2" }, { quantity: "3" }];

    test("formats and parses quantity for all items", () => {
      formatData
        .mockReturnValueOnce({ quantity: "2", id: "one" })
        .mockReturnValueOnce({ quantity: "3", id: "two" });
      parseNumeric
        .mockReturnValueOnce({ quantity: 2 })
        .mockReturnValueOnce({ quantity: 3 });

      const result =
        FoodHistoryService.parseAndFormatAllFoodHistoryResponseData({
          data: rawData,
        });

      expect(formatData).toHaveBeenNthCalledWith(
        1,
        rawData[0],
        MAP_FOOD_HISTORY_RESPONSE_NAME_TO_DATA,
      );
      expect(formatData).toHaveBeenNthCalledWith(
        2,
        rawData[1],
        MAP_FOOD_HISTORY_RESPONSE_NAME_TO_DATA,
      );
      expect(parseNumeric).toHaveBeenCalledTimes(2);
      expect(result).toEqual([
        { id: "one", quantity: 2 },
        { id: "two", quantity: 3 },
      ]);
    });
  });
});
