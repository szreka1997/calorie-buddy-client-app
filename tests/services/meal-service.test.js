import { JSON_HEADERS, SERVER_BASE_URL } from "../../constants/urlConstants";
import {
  MAP_MEAL_DATA_NAME_TO_PAYLOAD,
  MAP_MEAL_RESPONSE_NAME_TO_DATA,
  MAP_MEAL_FOOD_DATA_NAME_TO_PAYLOAD,
  MAP_MEAL_FOOD_RESPONSE_NAME_TO_DATA,
} from "../../constants/fetchConstants";
import { parseNumeric } from "../../utils/helperFunctions";
import { handleFetchResponseErrorsAndData } from "../../utils/errorUtils";
import { createAuthorizationHeader, formatData } from "../../utils/fetchUtils";
import * as MealService from "../../services/meal-service";

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

describe("Meal Service", () => {
  const token = "token";
  const userId = "user-id";
  const mealId = "meal-id";
  const authHeader = { Authorization: "Bearer token" };
  const mealsUrl = `${SERVER_BASE_URL}meals`;

  const name = "Chicken salad";
  const kcal = 450;
  const nutriScore = "A";
  const imageUri = "meal-image-uri";
  const imageDeleteUri = "meal-image-delete-uri";
  const food = { foodId: 1, quantity: 150 };
  const mealPayload = {
    name,
    kcal,
    nutriScore,
    imageUri,
    imageDeleteUri,
    foods: [food],
  };

  const formattedMealPayload = {
    name,
    kcal,
    nutri_score: nutriScore,
    image_uri: imageUri,
    image_delete_uri: imageDeleteUri,
    foods: [food],
  };

  const mealResponseData = {
    id: mealId,
    user_id: userId,
    name,
    kcal: "450",
    nutri_score: nutriScore,
    image_uri: imageUri,
    image_delete_uri: imageDeleteUri,
    foods: [
      {
        food_id: "1",
        quantity: "150",
      },
    ],
  };

  const parsedMealResponseData = {
    id: mealId,
    userId,
    ...mealPayload,
  };

  beforeEach(() => {
    global.fetch = jest.fn();

    parseNumeric.mockImplementation(({ data }) => data);
    handleFetchResponseErrorsAndData.mockResolvedValue(mealResponseData);
    createAuthorizationHeader.mockReturnValue(authHeader);
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
    delete global.fetch;
  });

  describe("[postNewMeal]", () => {
    let spyUploadMealData;

    beforeEach(() => {
      spyUploadMealData = jest
        .spyOn(MealService, "uploadMealData")
        .mockResolvedValue(parsedMealResponseData);
    });

    test.each([
      ["token is missing", undefined, userId, mealPayload],
      ["userId is missing", token, undefined, mealPayload],
      ["mealData is missing", token, userId, undefined],
    ])("throws when %s", (_, tokenArg, userIdArg, mealDataArg) => {
      expect(() =>
        MealService.postNewMeal({
          token: tokenArg,
          userId: userIdArg,
          mealData: mealDataArg,
        }),
      ).toThrow("Missing required parameters: token, userId or mealData.");
    });

    test("calls uploadMealData with POST payload", async () => {
      const result = await MealService.postNewMeal({
        token,
        userId,
        mealData: mealPayload,
      });

      expect(spyUploadMealData).toHaveBeenCalledWith({
        token,
        id: userId,
        mealData: mealPayload,
        method: "POST",
      });
      expect(result).toEqual(parsedMealResponseData);
    });
  });

  describe("[updateMeal]", () => {
    let spyUploadMealData;

    beforeEach(() => {
      spyUploadMealData = jest
        .spyOn(MealService, "uploadMealData")
        .mockResolvedValue(parsedMealResponseData);
    });

    test.each([
      ["token is missing", undefined, mealId, mealPayload],
      ["mealId is missing", token, undefined, mealPayload],
      ["mealData is missing", token, mealId, undefined],
    ])("throws when %s", (_, tokenArg, mealIdArg, mealDataArg) => {
      expect(() =>
        MealService.updateMeal({
          token: tokenArg,
          mealId: mealIdArg,
          mealData: mealDataArg,
        }),
      ).toThrow("Missing required parameters: token, mealId or mealData.");
    });

    test("calls uploadMealData with PUT payload", async () => {
      const result = await MealService.updateMeal({
        token,
        mealId,
        mealData: mealPayload,
      });

      expect(spyUploadMealData).toHaveBeenCalledWith({
        token,
        id: mealId,
        mealData: mealPayload,
        method: "PUT",
      });
      expect(result).toEqual(parsedMealResponseData);
    });
  });

  describe("[getMealsByUserId]", () => {
    let spyGetMealData;

    beforeEach(() => {
      spyGetMealData = jest
        .spyOn(MealService, "getMealData")
        .mockResolvedValue([parsedMealResponseData]);
    });

    test.each([
      ["token is missing", undefined, userId],
      ["userId is missing", token, undefined],
    ])("throws when %s", (_, tokenArg, userIdArg) => {
      expect(() =>
        MealService.getMealsByUserId({
          token: tokenArg,
          userId: userIdArg,
        }),
      ).toThrow("Missing required parameters: token or userId.");
    });

    test("calls getMealData with user-id path", async () => {
      const result = await MealService.getMealsByUserId({ token, userId });

      expect(spyGetMealData).toHaveBeenCalledWith({
        token,
        id: userId,
        path: "user-id",
      });
      expect(result).toEqual([parsedMealResponseData]);
    });
  });

  describe("[getMealByMealId]", () => {
    let spyGetMealData;

    beforeEach(() => {
      spyGetMealData = jest
        .spyOn(MealService, "getMealData")
        .mockResolvedValue([parsedMealResponseData]);
    });

    test.each([
      ["token is missing", undefined, mealId],
      ["mealId is missing", token, undefined],
    ])("throws when %s", async (_, tokenArg, mealIdArg) => {
      await expect(
        MealService.getMealByMealId({
          token: tokenArg,
          mealId: mealIdArg,
        }),
      ).rejects.toThrow("Missing required parameters: token or mealId.");
    });

    test("calls getMealData with meal-id path and returns first item", async () => {
      const result = await MealService.getMealByMealId({ token, mealId });

      expect(spyGetMealData).toHaveBeenCalledWith({
        token,
        id: mealId,
        path: "meal-id",
      });
      expect(result).toEqual(parsedMealResponseData);
    });
  });

  describe("[uploadMealData]", () => {
    test("formats meal and foods payload, uploads and returns data", async () => {
      formatData
        .mockReturnValueOnce({ ...formattedMealPayload })
        .mockReturnValueOnce({ ...formattedMealPayload.foods[0] });

      const result = await MealService.uploadMealData({
        token,
        id: userId,
        mealData: mealPayload,
        method: "POST",
      });

      expect(formatData).toHaveBeenNthCalledWith(
        1,
        mealPayload,
        MAP_MEAL_DATA_NAME_TO_PAYLOAD,
      );
      expect(formatData).toHaveBeenNthCalledWith(
        2,
        formattedMealPayload.foods[0],
        MAP_MEAL_FOOD_DATA_NAME_TO_PAYLOAD,
        true,
      );
      expect(global.fetch).toHaveBeenCalledWith(`${mealsUrl}/${userId}`, {
        method: "POST",
        headers: {
          ...JSON_HEADERS,
          ...authHeader,
        },
        body: JSON.stringify({ ...formattedMealPayload }),
      });
      expect(handleFetchResponseErrorsAndData).toHaveBeenCalled();
      expect(result).toEqual(mealResponseData);
    });
  });

  describe("[getMealData]", () => {
    beforeEach(() => {
      jest
        .spyOn(MealService, "parseAndFormatAllMealResponseData")
        .mockReturnValue([parsedMealResponseData]);
    });

    test("calls user-id endpoint and parses response array", async () => {
      handleFetchResponseErrorsAndData.mockResolvedValue([mealResponseData]);

      const result = await MealService.getMealData({
        token,
        id: userId,
        path: "user-id",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${mealsUrl}/user-id/${userId}`,
        {
          headers: {
            ...JSON_HEADERS,
            ...authHeader,
          },
        },
      );
      expect(result).toEqual([parsedMealResponseData]);
    });

    test("calls meal-id endpoint and wraps response object", async () => {
      const result = await MealService.getMealData({
        token,
        id: mealId,
        path: "meal-id",
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${mealsUrl}/meal-id/${mealId}`,
        {
          headers: {
            ...JSON_HEADERS,
            ...authHeader,
          },
        },
      );
      expect(result).toEqual([parsedMealResponseData]);
    });
  });

  describe("[parseAndFormatAllMealResponseData]", () => {
    test("formats and parses meal with nested foods", () => {
      const formattedMeal = {
        id: mealId,
        userId,
        name,
        kcal: "450",
        nutriScore,
        imageUri,
        imageDeleteUri,
        foods: [mealResponseData.foods[0]],
      };
      const formattedFood = {
        foodId: "1",
        quantity: "150",
      };

      formatData
        .mockReturnValueOnce(formattedMeal)
        .mockReturnValueOnce(formattedFood);
      parseNumeric.mockReturnValueOnce({ kcal }).mockReturnValueOnce({
        foodId: 1,
        quantity: 150,
      });

      const result = MealService.parseAndFormatAllMealResponseData({
        data: [mealResponseData],
      });

      expect(formatData).toHaveBeenNthCalledWith(
        1,
        mealResponseData,
        MAP_MEAL_RESPONSE_NAME_TO_DATA,
      );
      expect(formatData).toHaveBeenNthCalledWith(
        2,
        mealResponseData.foods[0],
        MAP_MEAL_FOOD_RESPONSE_NAME_TO_DATA,
      );
      expect(parseNumeric).toHaveBeenNthCalledWith(1, {
        data: {
          kcal: "450",
        },
      });
      expect(parseNumeric).toHaveBeenNthCalledWith(2, {
        data: formattedFood,
      });
      expect(result).toEqual([parsedMealResponseData]);
    });
  });
});
