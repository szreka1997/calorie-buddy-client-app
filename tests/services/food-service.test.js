import { JSON_HEADERS, SERVER_BASE_URL } from "../../constants/urlConstants";
import {
  MAP_FOOD_DATA_NAME_TO_PAYLOAD,
  MAP_FOOD_RESPONSE_NAME_TO_DATA,
} from "../../constants/fetchConstants";
import { parseNumeric } from "../../utils/helperFunctions";
import { handleFetchResponseErrorsAndData } from "../../utils/errorUtils";
import { createAuthorizationHeader, formatData } from "../../utils/fetchUtils";
import * as FoodService from "../../services/food-service";

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

describe("Food Service", () => {
  const token = "token";
  const userId = "user-id";
  const foodId = "food-id";
  const authHeader = { Authorization: "Bearer token" };
  const foodsUrl = `${SERVER_BASE_URL}foods`;

  const name = "Apple";
  const kcalPer100G = 53;
  const proteinPer100G = 0.3;
  const carbsPer100G = 14;
  const fatPer100G = 0.2;
  const sugarPer100G = 10;
  const addedSugarPer100G = 0;
  const recommendedServingSize = 100;

  const foodPayload = {
    name,
    kcalPer100G,
    proteinPer100G,
    carbsPer100G,
    fatPer100G,
    sugarPer100G,
    addedSugarPer100G,
    recommendedServingSize,
  };

  const formattedFoodPayload = {
    name,
    kcal_per_100_g: kcalPer100G,
    protein_per_100_g: proteinPer100G,
    carbs_per_100_g: carbsPer100G,
    fat_per_100_g: fatPer100G,
    sugar_per_100_g: sugarPer100G,
    added_sugar_per_100_g: addedSugarPer100G,
    recommended_serving_size: recommendedServingSize,
  };

  const foodResponseData = {
    ...formattedFoodPayload,
    id: foodId,
    user_id: userId,
  };

  const parsedFoodResponseData = {
    ...foodPayload,
    id: foodId,
    userId,
  };

  beforeEach(() => {
    global.fetch = jest.fn();

    parseNumeric.mockImplementation(({ data }) => data);
    handleFetchResponseErrorsAndData.mockResolvedValue(foodResponseData);
    createAuthorizationHeader.mockReturnValue(authHeader);
    formatData.mockReturnValue(formattedFoodPayload);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    delete global.fetch;
  });

  describe("[postNewFood]", () => {
    let spyUploadFoodData;

    beforeEach(() => {
      spyUploadFoodData = jest
        .spyOn(FoodService, "uploadFoodData")
        .mockResolvedValue(parsedFoodResponseData);
    });

    test.each([
      ["token is missing", undefined, userId, foodPayload],
      ["userId is missing", token, undefined, foodPayload],
      ["foodData is missing", token, userId, undefined],
    ])("throws when %s", (_, tokenArg, userIdArg, foodDataArg) => {
      expect(() =>
        FoodService.postNewFood({
          token: tokenArg,
          userId: userIdArg,
          foodData: foodDataArg,
        }),
      ).toThrow("Missing required parameters: token, userId, or foodData.");
    });

    test("calls uploadFoodData with POST payload", async () => {
      const result = await FoodService.postNewFood({
        token,
        userId,
        foodData: foodPayload,
      });

      expect(spyUploadFoodData).toHaveBeenCalledWith({
        token,
        id: userId,
        foodData: foodPayload,
        method: "POST",
      });
      expect(result).toEqual(parsedFoodResponseData);
    });
  });

  describe("[updateNewFood]", () => {
    let spyUploadFoodData;

    beforeEach(() => {
      spyUploadFoodData = jest
        .spyOn(FoodService, "uploadFoodData")
        .mockResolvedValue(parsedFoodResponseData);
    });

    test.each([
      ["token is missing", undefined, foodId, foodPayload],
      ["foodId is missing", token, undefined, foodPayload],
      ["foodData is missing", token, foodId, undefined],
    ])("throws when %s", (_, tokenArg, foodIdArg, foodDataArg) => {
      expect(() =>
        FoodService.updateNewFood({
          token: tokenArg,
          foodId: foodIdArg,
          foodData: foodDataArg,
        }),
      ).toThrow("Missing required parameters: token, foodId or foodData.");
    });

    test("calls uploadFoodData with PUT payload", async () => {
      const result = await FoodService.updateNewFood({
        token,
        foodId,
        foodData: foodPayload,
      });

      expect(spyUploadFoodData).toHaveBeenCalledWith({
        token,
        id: foodId,
        foodData: foodPayload,
        method: "PUT",
      });
      expect(result).toEqual(parsedFoodResponseData);
    });
  });

  describe("[getFoods]", () => {
    beforeEach(() => {
      jest
        .spyOn(FoodService, "parseAndFormatAllFoodResponseData")
        .mockReturnValue([parsedFoodResponseData]);
    });

    test("calls foods endpoint and returns parsed data", async () => {
      const result = await FoodService.getFoods();

      expect(global.fetch).toHaveBeenCalledWith(foodsUrl, {
        headers: JSON_HEADERS,
      });
      expect(handleFetchResponseErrorsAndData).toHaveBeenCalled();
      expect(result).toEqual([parsedFoodResponseData]);
    });
  });

  describe("[getFoodById]", () => {
    beforeEach(() => {
      jest
        .spyOn(FoodService, "parseAndFormatAllFoodResponseData")
        .mockReturnValue([parsedFoodResponseData]);
    });

    test("throws when foodId is missing", async () => {
      await expect(
        FoodService.getFoodById({ foodId: undefined }),
      ).rejects.toThrow("Missing required parameter: foodId.");
    });

    test("calls food by id endpoint and returns parsed item", async () => {
      const result = await FoodService.getFoodById({ foodId });

      expect(global.fetch).toHaveBeenCalledWith(`${foodsUrl}/${foodId}`, {
        headers: JSON_HEADERS,
      });
      expect(handleFetchResponseErrorsAndData).toHaveBeenCalled();
      expect(result).toEqual(parsedFoodResponseData);
    });
  });

  describe("[uploadFoodData]", () => {
    beforeEach(() => {
      jest
        .spyOn(FoodService, "parseAndFormatAllFoodResponseData")
        .mockReturnValue([parsedFoodResponseData]);
    });

    test("formats payload, uploads and returns parsed food", async () => {
      const result = await FoodService.uploadFoodData({
        token,
        id: userId,
        foodData: foodPayload,
        method: "POST",
      });

      expect(formatData).toHaveBeenCalledWith(
        foodPayload,
        MAP_FOOD_DATA_NAME_TO_PAYLOAD,
      );
      expect(global.fetch).toHaveBeenCalledWith(`${foodsUrl}/${userId}`, {
        method: "POST",
        headers: {
          ...JSON_HEADERS,
          ...authHeader,
        },
        body: JSON.stringify({ ...formattedFoodPayload }),
      });
      expect(handleFetchResponseErrorsAndData).toHaveBeenCalled();
      expect(result).toEqual(parsedFoodResponseData);
    });
  });

  describe("[parseAndFormatAllFoodResponseData]", () => {
    const rawFoodData = [{ ...foodResponseData, is_verified: "Valid" }];
    const formattedFoodResponseData = {
      id: foodId,
      userId,
      name,
      kcalPer100G: "53",
      proteinPer100G: "0.3",
      carbsPer100G: "14",
      fatPer100G: "0.2",
      sugarPer100G: "10",
      addedSugarPer100G: "0",
      recommendedServingSize: "100",
    };

    test("formats food data, parses numeric fields and maps isVerified", () => {
      formatData.mockReturnValue({
        ...formattedFoodResponseData,
        isVerified: "Valid",
      });
      parseNumeric
        .mockReturnValueOnce({
          kcalPer100G,
          recommendedServingSize,
        })
        .mockReturnValueOnce({
          proteinPer100G,
          carbsPer100G,
          fatPer100G,
          sugarPer100G,
          addedSugarPer100G,
        });

      const result = FoodService.parseAndFormatAllFoodResponseData({
        data: rawFoodData,
      });

      expect(formatData).toHaveBeenCalledWith(
        rawFoodData[0],
        MAP_FOOD_RESPONSE_NAME_TO_DATA,
      );
      expect(parseNumeric).toHaveBeenNthCalledWith(1, {
        data: {
          kcalPer100G: "53",
          recommendedServingSize: "100",
        },
      });
      expect(parseNumeric).toHaveBeenNthCalledWith(2, {
        data: {
          proteinPer100G: "0.3",
          carbsPer100G: "14",
          fatPer100G: "0.2",
          sugarPer100G: "10",
          addedSugarPer100G: "0",
        },
        isDecimal: true,
      });
      expect(result).toEqual([
        {
          ...parsedFoodResponseData,
          isVerified: true,
        },
      ]);
    });

    test("maps isVerified to false when value is not 'Valid'", () => {
      formatData.mockReturnValue({
        ...formattedFoodResponseData,
        isVerified: "Not valid",
      });

      parseNumeric
        .mockReturnValueOnce({ kcalPer100G, recommendedServingSize })
        .mockReturnValueOnce({
          proteinPer100G,
          carbsPer100G,
          fatPer100G,
          sugarPer100G,
          addedSugarPer100G,
        });

      const result = FoodService.parseAndFormatAllFoodResponseData({
        data: rawFoodData,
      });

      expect(result[0].isVerified).toEqual(false);
    });
  });
});
