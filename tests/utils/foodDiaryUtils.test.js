import COLORS from "../../constants/colorConstants";
import { MEAL } from "../../constants/commonConstants";
import {
  getAddFoodFormFieldsConfig,
  getLogFoodFormFieldsConfig,
  getInitialFoodFormValues,
  calculateProgress,
  getFeedbackEmoticonName,
  getNumberRepresentationOfNutriScore,
  getStringRepresentationOfNutriScoreFromNumber,
  calculateConsumedAmount,
  validateMealItems,
  getFoodImageSource,
  getFoodVerificationText,
  getFoodVerificationIcon,
  getImagePickerButtonConfigs,
  getNutriScoreConfig,
  calculateMaxHealthySugarAmount,
  getStartingMealCategory,
  getQuantityFromIdAndQuantityList,
  transformSearchItem,
  findMatchStartingIndex,
  getHighlightTextsFromFoodNameAndSearchText,
  filterFoodDataBySearchText,
  getMacrosPieChartData,
  getNutritionInfoFromFoodAndQuantity,
  accumulateMealCategoryMacrosAndSugars,
  calculateNutriensDeficit,
  calculateSugarDeficit,
  getInitialNutriensInfo,
  getInitialMealNutriensInfo,
  getInitialFoodHistory,
  getInitialMealCategoryValues,
  getInitialFoodDiaryNutriensInfo,
} from "../../utils/foodDiaryUtils";

describe("Food Diary Utils", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe("[getAddFoodFormFieldsConfig]", () => {
    test("returns an array of form field configurations", () => {
      const result = getAddFoodFormFieldsConfig();

      expect(Array.isArray(result)).toBeTruthy();
      expect(result).toHaveLength(8);
    });

    test("first field is the name string field", () => {
      const result = getAddFoodFormFieldsConfig();

      expect(result[0].name).toEqual("name");
      expect(result[0].label).toEqual("Name");
    });

    test("contains kcalPer100G numeric field with validation rules", () => {
      const result = getAddFoodFormFieldsConfig();
      const kcalField = result.find((f) => f.name === "kcalPer100G");

      expect(kcalField).toBeDefined();
      expect(kcalField.label).toEqual("Kcal / 100g");
      expect(kcalField.rules).toBeDefined();
    });

    test("contains all expected field names", () => {
      const result = getAddFoodFormFieldsConfig();
      const names = result.map((f) => f.name);

      expect(names).toEqual([
        "name",
        "kcalPer100G",
        "recommendedServingSize",
        "proteinPer100G",
        "carbsPer100G",
        "fatPer100G",
        "sugarPer100G",
        "addedSugarPer100G",
      ]);
    });
  });

  describe("[getLogFoodFormFieldsConfig]", () => {
    test("returns object with quantityConfig and mealConfig", () => {
      const result = getLogFoodFormFieldsConfig();

      expect(result.quantityConfig).toBeDefined();
      expect(result.mealConfig).toBeDefined();
    });

    test("quantityConfig has correct field name and label", () => {
      const result = getLogFoodFormFieldsConfig();

      expect(result.quantityConfig.name).toEqual("quantity");
      expect(result.quantityConfig.label).toEqual("Quantity (g)");
    });

    test("mealConfig contains all meal category options", () => {
      const result = getLogFoodFormFieldsConfig();
      const options = result.mealConfig.radioConfig.options;

      expect(options).toHaveLength(5);
      expect(options.map((o) => o.value)).toEqual([
        MEAL.BREAKFAST,
        MEAL.LUNCH,
        MEAL.DINNER,
        MEAL.SNACK,
        MEAL.LIQUID_CALORIES,
      ]);
    });
  });

  describe("[getInitialFoodFormValues]", () => {
    test("returns empty strings when no data is provided", () => {
      const result = getInitialFoodFormValues();

      expect(result).toEqual({
        name: "",
        kcalPer100G: "",
        recommendedServingSize: "",
        carbsPer100G: "",
        proteinPer100G: "",
        fatPer100G: "",
        sugarPer100G: "",
        addedSugarPer100G: "",
      });
    });

    test("populates values from provided data", () => {
      const data = {
        name: "Apple",
        kcalPer100G: 52,
        recommendedServingSize: 150,
        carbsPer100G: 14,
        proteinPer100G: 0.3,
        fatPer100G: 0.2,
        sugarPer100G: 10,
        addedSugarPer100G: 0,
      };

      const result = getInitialFoodFormValues(data);

      expect(result).toEqual({
        name: "Apple",
        kcalPer100G: "52",
        recommendedServingSize: "150",
        carbsPer100G: "14",
        proteinPer100G: "0.3",
        fatPer100G: "0.2",
        sugarPer100G: "10",
        addedSugarPer100G: "0",
      });
    });

    test("handles partial data with missing fields", () => {
      const data = { name: "Banana", kcalPer100G: 89 };

      const result = getInitialFoodFormValues(data);

      expect(result.name).toEqual("Banana");
      expect(result.kcalPer100G).toEqual("89");
      expect(result.proteinPer100G).toEqual("");
      expect(result.fatPer100G).toEqual("");
    });
  });

  describe("[calculateProgress]", () => {
    test("returns ratio of consumed to max", () => {
      expect(calculateProgress(50, 100)).toEqual(0.5);
    });

    test("returns 0 when max is 0", () => {
      expect(calculateProgress(0, 0)).toEqual(0);
    });

    test("returns 1 when consumed equals max", () => {
      expect(calculateProgress(100, 100)).toEqual(1);
    });

    test("returns 1 when consumed exceeds max", () => {
      expect(calculateProgress(150, 100)).toEqual(1);
    });

    test("handles calorie mode allowing higher consumed values", () => {
      const result = calculateProgress(10000000, 2000, true);

      expect(result).toEqual(1);
    });
  });

  describe("[getFeedbackEmoticonName]", () => {
    test("returns smile-beam when calorie consumed is within 50 of max", () => {
      expect(getFeedbackEmoticonName(1980, 2000, true)).toEqual("smile-beam");
      expect(getFeedbackEmoticonName(2020, 2000, true)).toEqual("smile-beam");
    });

    test("returns sad-cry when calorie consumed is far from max", () => {
      expect(getFeedbackEmoticonName(1500, 2000, true)).toEqual("sad-cry");
    });

    test("returns smile-beam for protein when consumed meets or exceeds max", () => {
      expect(getFeedbackEmoticonName(100, 100, false, true)).toEqual(
        "smile-beam",
      );
      expect(getFeedbackEmoticonName(120, 100, false, true)).toEqual(
        "smile-beam",
      );
    });

    test("returns sad-cry for protein when consumed is below max", () => {
      expect(getFeedbackEmoticonName(50, 100, false, true)).toEqual("sad-cry");
    });

    test("returns smile-beam for generic macro when consumed is below max", () => {
      expect(getFeedbackEmoticonName(50, 100)).toEqual("smile-beam");
    });

    test("returns sad-cry for generic macro when consumed meets or exceeds max", () => {
      expect(getFeedbackEmoticonName(100, 100)).toEqual("sad-cry");
      expect(getFeedbackEmoticonName(120, 100)).toEqual("sad-cry");
    });
  });

  describe("[getNumberRepresentationOfNutriScore]", () => {
    test.each([
      ["A", 5],
      ["B", 4],
      ["C", 3],
      ["D", 2],
      ["E", 1],
    ])("converts %s to %s", (name, value) => {
      expect(getNumberRepresentationOfNutriScore(name)).toEqual(value);
    });

    test("throws error for invalid score text", () => {
      expect(() => getNumberRepresentationOfNutriScore("F")).toThrow(
        "Invalid parameter: scoreText! It has to be one of A – E!",
      );
    });

    test("throws error when scoreText is missing", () => {
      expect(() => getNumberRepresentationOfNutriScore(null)).toThrow(
        "Missing required parameter: scoreText!",
      );
    });
  });

  describe("[getStringRepresentationOfNutriScoreFromNumber]", () => {
    test.each([
      ["A", 5],
      ["A", 4.5],
      ["B", 4],
      ["B", 3.5],
      ["C", 3],
      ["C", 2.5],
      ["D", 2],
      ["D", 1.5],
      ["E", 1],
    ])("returns %s for score >= %s", (name, value) => {
      expect(getStringRepresentationOfNutriScoreFromNumber(value)).toEqual(
        name,
      );
    });

    test("throws error when scoreNumber is out of range", () => {
      expect(() => getStringRepresentationOfNutriScoreFromNumber(6)).toThrow(
        "Invalid parameter! scoreNumber must be less than or equal to 5!",
      );
    });
  });

  describe("[calculateConsumedAmount]", () => {
    test("calculates consumed amount from per-100g value and quantity", () => {
      expect(calculateConsumedAmount(50, 200)).toEqual(100);
    });

    test("rounds up when shouldRoundUp is true", () => {
      expect(calculateConsumedAmount(33, 150, true)).toEqual(50);
    });

    test("does not round when shouldRoundUp is false", () => {
      expect(calculateConsumedAmount(33, 150, false)).toEqual(49.5);
    });

    test("returns 0 when valuePer100G is 0", () => {
      expect(calculateConsumedAmount(0, 200)).toEqual(0);
    });

    test("returns correct amount when quantity is 1", () => {
      expect(calculateConsumedAmount(200, 1)).toEqual(2);
    });

    test("throws when quantity is 0", () => {
      expect(() => calculateConsumedAmount(50, 0)).toThrow(
        "Invalid parameter! quantity must be greater than or equal to 1!",
      );
    });
  });

  describe("[validateMealItems]", () => {
    test("returns valid false when list is null", () => {
      expect(validateMealItems(null)).toEqual({
        valid: false,
        error: "You have to add at least 2 meal items!",
      });
    });

    test("returns valid false when list is undefined", () => {
      expect(validateMealItems(undefined)).toEqual({
        valid: false,
        error: "You have to add at least 2 meal items!",
      });
    });

    test("returns valid false when list has fewer than 2 items", () => {
      expect(validateMealItems([{ foodId: 1 }])).toEqual({
        valid: false,
        error: "You have to add at least 2 meal items!",
      });
    });

    test("returns valid true when list has 2 or more items", () => {
      expect(validateMealItems([{ foodId: 1 }, { foodId: 2 }])).toEqual({
        valid: true,
      });
    });
  });

  describe("[getFoodImageSource]", () => {
    test("returns uri object when imageUri is provided", () => {
      expect(getFoodImageSource("https://example.com/img.png")).toEqual({
        uri: "https://example.com/img.png",
      });
    });

    test("returns default image when imageUri is falsy and accent is false", () => {
      const result = getFoodImageSource(null);

      expect(result).toBeDefined();
    });

    test("returns accent image when imageUri is falsy and accent is true", () => {
      const result = getFoodImageSource(null, true);

      expect(result).toBeDefined();
    });
  });

  describe("[getFoodVerificationText]", () => {
    test("returns VERIFIED when isVerified is true", () => {
      expect(getFoodVerificationText(true)).toEqual("VERIFIED");
    });

    test("returns NOT VERIFIED when isVerified is false", () => {
      expect(getFoodVerificationText()).toEqual("NOT VERIFIED");
    });

    test("returns null when isMeal is true", () => {
      expect(getFoodVerificationText(true, true)).toBeNull();
    });

    test("returns null when isMeal is true regardless of isVerified", () => {
      expect(getFoodVerificationText(false, true)).toBeNull();
    });
  });

  describe("[getFoodVerificationIcon]", () => {
    test("returns verified icon when isVerified is true", () => {
      expect(getFoodVerificationIcon(true)).toEqual({
        type: "MaterialIcons",
        name: "verified-user",
        color: COLORS.GOOD_500,
      });
    });

    test("returns unverified icon when isVerified is false", () => {
      expect(getFoodVerificationIcon()).toEqual({
        type: "Octicons",
        name: "shield-x",
        color: COLORS.ERROR_500,
      });
    });

    test("returns null when isMeal is true", () => {
      expect(getFoodVerificationIcon(true, true)).toBeNull();
      expect(getFoodVerificationIcon(false, true)).toBeNull();
    });
  });

  describe("[getImagePickerButtonConfigs]", () => {
    test("returns 3 buttons when showImage is falsy", () => {
      const result = getImagePickerButtonConfigs();

      expect(result).toHaveLength(3);
      expect(result.map((b) => b.title)).toEqual([
        "Import Photo",
        "Take a Photo",
        "Cancel",
      ]);
    });

    test("returns 4 buttons including Delete Photo when showImage is truthy", () => {
      const result = getImagePickerButtonConfigs(
        jest.fn(),
        jest.fn(),
        jest.fn(),
        jest.fn(),
        true,
      );

      expect(result).toHaveLength(4);
      expect(result.map((b) => b.title)).toEqual([
        "Import Photo",
        "Take a Photo",
        "Delete Photo",
        "Cancel",
      ]);
    });

    test("sets accent flag on base options and inverts on cancel", () => {
      const result = getImagePickerButtonConfigs(
        jest.fn(),
        jest.fn(),
        jest.fn(),
        jest.fn(),
        undefined,
        true,
      );

      expect(result[0].accent).toEqual(true);
      expect(result[1].accent).toEqual(true);
      expect(result[2].accent).toEqual(false); // cancel has inverted accent
    });

    test("calls correct handlers on press", () => {
      const importHandler = jest.fn();
      const takeHandler = jest.fn();
      const deleteHandler = jest.fn();
      const cancelHandler = jest.fn();

      const result = getImagePickerButtonConfigs(
        importHandler,
        takeHandler,
        deleteHandler,
        cancelHandler,
        true,
      );

      result[0].onPress();
      result[1].onPress();
      result[2].onPress();
      result[3].onPress();

      expect(importHandler).toHaveBeenCalled();
      expect(takeHandler).toHaveBeenCalled();
      expect(deleteHandler).toHaveBeenCalled();
      expect(cancelHandler).toHaveBeenCalled();
    });

    test("uses default no-op handlers when no arguments are provided", () => {
      const result = getImagePickerButtonConfigs();

      result.forEach((button) => {
        expect(() => button.onPress()).not.toThrow();
      });
    });

    test("uses default no-op delete handler when showImage is true and no handlers are provided", () => {
      const result = getImagePickerButtonConfigs(
        undefined,
        undefined,
        undefined,
        undefined,
        true,
      );

      expect(result).toHaveLength(4);
      result.forEach((button) => {
        expect(() => button.onPress()).not.toThrow();
      });
    });
  });

  describe("[getNutriScoreConfig]", () => {
    test("returns config for all 5 nutri scores with correct selection", () => {
      const result = getNutriScoreConfig("B");

      expect(result).toHaveLength(5);
      expect(result[1].isSelected).toEqual(true);
      expect(result[0].isSelected).toEqual(false);
    });

    test("each config has label, backgroundColor, textColor, and isSelected", () => {
      const result = getNutriScoreConfig("A");

      result.forEach((item) => {
        expect(item).toHaveProperty("label");
        expect(item).toHaveProperty("backgroundColor");
        expect(item).toHaveProperty("textColor");
        expect(item).toHaveProperty("isSelected");
      });
    });

    test("uses correct colors for each score", () => {
      const result = getNutriScoreConfig("C");

      expect(result[0].backgroundColor).toEqual(COLORS.NUTRI_SCORE_A_500);
      expect(result[0].textColor).toEqual(COLORS.NUTRI_SCORE_A_100);
      expect(result[2].backgroundColor).toEqual(COLORS.NUTRI_SCORE_C_500);
    });

    test("throws error for invalid nutri score", () => {
      expect(() => getNutriScoreConfig("F")).toThrow(
        "Invalid parameter: selectedNutriScore! It has to be one of A – E!",
      );
    });

    test("throws error when selectedNutriScore is missing", () => {
      expect(() => getNutriScoreConfig()).toThrow(
        "Missing required parameter: selectedNutriScore!",
      );
    });
  });

  describe("[calculateMaxHealthySugarAmount]", () => {
    test("calculates max sugar as 10% of calories divided by 4", () => {
      // 2000 * 0.1 / 4 = 50
      expect(calculateMaxHealthySugarAmount(2000)).toEqual(50);
    });

    test("calculates max added sugar as 5% of calories divided by 4", () => {
      // 2000 * 0.05 / 4 = 25
      expect(calculateMaxHealthySugarAmount(2000, true)).toEqual(25);
    });

    test("rounds up the result", () => {
      // 1500 * 0.1 / 4 = 37.5 -> 38
      expect(calculateMaxHealthySugarAmount(1500)).toEqual(38);
    });

    test("throws error when goalCalories is below minimum", () => {
      expect(() => calculateMaxHealthySugarAmount(100)).toThrow(
        "Invalid parameter! goalCalories must be greater than or equal to 500!",
      );
    });
  });

  describe("[getStartingMealCategory]", () => {
    test("returns Dinner before 5 AM", () => {
      jest.useFakeTimers().setSystemTime(new Date("2025-01-01T03:00:00"));

      expect(getStartingMealCategory()).toEqual(MEAL.DINNER);
    });

    test("returns Breakfast between 5 AM and 11 AM", () => {
      jest.useFakeTimers().setSystemTime(new Date("2025-01-01T08:00:00"));

      expect(getStartingMealCategory()).toEqual(MEAL.BREAKFAST);
    });

    test("returns Lunch between 11 AM and 4 PM", () => {
      jest.useFakeTimers().setSystemTime(new Date("2025-01-01T13:00:00"));

      expect(getStartingMealCategory()).toEqual(MEAL.LUNCH);
    });

    test("returns Dinner after 4 PM", () => {
      jest.useFakeTimers().setSystemTime(new Date("2025-01-01T18:00:00"));

      expect(getStartingMealCategory()).toEqual(MEAL.DINNER);
    });
  });

  describe("[getQuantityFromIdAndQuantityList]", () => {
    const list = [
      { foodId: 1, quantity: 150 },
      { foodId: 2, quantity: 200 },
      { foodId: 3, quantity: 75 },
    ];

    test("returns quantity as string for matching food ID", () => {
      expect(getQuantityFromIdAndQuantityList(list, 2)).toEqual("200");
    });

    test("returns null when food ID is not found", () => {
      expect(getQuantityFromIdAndQuantityList(list, 99)).toBeNull();
    });

    test("returns null when list is null", () => {
      expect(getQuantityFromIdAndQuantityList(null, 1)).toBeNull();
    });

    test("returns null when list is undefined", () => {
      expect(getQuantityFromIdAndQuantityList(undefined, 1)).toBeNull();
    });
  });

  describe("[transformSearchItem]", () => {
    test("lowercases the input", () => {
      expect(transformSearchItem("APPLE")).toEqual("apple");
    });

    test("replaces Hungarian accented characters", () => {
      expect(transformSearchItem("áéíóöőúüű")).toEqual("aeiooouuu");
    });

    test("handles mixed case and accented characters", () => {
      expect(transformSearchItem("Túró Rudi")).toEqual("turo rudi");
    });

    test("leaves non-accented characters unchanged", () => {
      expect(transformSearchItem("banana")).toEqual("banana");
    });
  });

  describe("[findMatchStartingIndex]", () => {
    test("returns starting index of match", () => {
      expect(
        findMatchStartingIndex({ text: "hello world", searchText: "world" }),
      ).toEqual(6);
    });

    test("returns null when no match is found", () => {
      expect(
        findMatchStartingIndex({ text: "hello world", searchText: "xyz" }),
      ).toBeNull();
    });

    test("returns null when text is empty", () => {
      expect(
        findMatchStartingIndex({ text: "", searchText: "test" }),
      ).toBeNull();
    });

    test("returns null when searchText is empty", () => {
      expect(
        findMatchStartingIndex({ text: "hello", searchText: "" }),
      ).toBeNull();
    });

    test("returns null when text is null", () => {
      expect(
        findMatchStartingIndex({ text: null, searchText: "test" }),
      ).toBeNull();
    });
  });

  describe("[getHighlightTextsFromFoodNameAndSearchText]", () => {
    test("splits name into pre, highlight, and post parts", () => {
      const result = getHighlightTextsFromFoodNameAndSearchText({
        name: "Green Apple",
        searchText: "apple",
      });

      expect(result).toEqual({
        preHighlightText: "Green ",
        highlightText: "Apple",
        postHightlightText: "",
      });
    });

    test("handles accent-insensitive matching", () => {
      const result = getHighlightTextsFromFoodNameAndSearchText({
        name: "Túró Rudi",
        searchText: "turo",
      });

      expect(result).toEqual({
        preHighlightText: "",
        highlightText: "Túró",
        postHightlightText: " Rudi",
      });
    });

    test("returns null when name is null", () => {
      expect(
        getHighlightTextsFromFoodNameAndSearchText({
          name: null,
          searchText: "test",
        }),
      ).toBeNull();
    });

    test("returns null when searchText is null", () => {
      expect(
        getHighlightTextsFromFoodNameAndSearchText({
          name: "Apple",
          searchText: null,
        }),
      ).toBeNull();
    });

    test("returns null when no match is found", () => {
      expect(
        getHighlightTextsFromFoodNameAndSearchText({
          name: "Apple",
          searchText: "xyz",
        }),
      ).toBeNull();
    });
  });

  describe("[filterFoodDataBySearchText]", () => {
    const foodList = [
      { name: "Apple" },
      { name: "Banana" },
      { name: "Túró Rudi" },
      { name: "Apricot" },
    ];

    test("filters items matching search text", () => {
      const result = filterFoodDataBySearchText(foodList, "ap");

      expect(result).toHaveLength(2);
      expect(result.map((f) => f.name)).toEqual(["Apple", "Apricot"]);
    });

    test("handles accent-insensitive search", () => {
      const result = filterFoodDataBySearchText(foodList, "turo");

      expect(result).toHaveLength(1);
      expect(result[0].name).toEqual("Túró Rudi");
    });

    test("returns empty array when no match", () => {
      const result = filterFoodDataBySearchText(foodList, "xyz");

      expect(result).toHaveLength(0);
    });

    test("returns all items when search text matches all", () => {
      const result = filterFoodDataBySearchText(
        [{ name: "aa" }, { name: "ab" }],
        "a",
      );

      expect(result).toHaveLength(2);
    });
  });

  describe("[getMacrosPieChartData]", () => {
    test("returns data array with correct populations and colors", () => {
      const result = getMacrosPieChartData({
        protein: 30,
        carbs: 50,
        fat: 20,
      });

      expect(result.data).toEqual([
        { population: 50, color: COLORS.CARBS_500 },
        { population: 30, color: COLORS.PROTEIN_500 },
        { population: 20, color: COLORS.FAT_500 },
      ]);
    });

    test("returns chartConfig object", () => {
      const result = getMacrosPieChartData({
        protein: 30,
        carbs: 50,
        fat: 20,
      });

      expect(result.chartConfig).toBeDefined();
      expect(result.chartConfig.backgroundGradientFromOpacity).toEqual(0);
      expect(result.chartConfig.backgroundGradientToOpacity).toEqual(0);
    });
  });

  describe("[getNutritionInfoFromFoodAndQuantity]", () => {
    const food = {
      kcalPer100G: 200,
      proteinPer100G: 10,
      carbsPer100G: 30,
      fatPer100G: 8,
      sugarPer100G: 5,
      addedSugarPer100G: 2.4,
    };

    test("calculates nutrition values for given quantity", () => {
      const result = getNutritionInfoFromFoodAndQuantity({
        food,
        quantity: 200,
      });

      expect(result.kcal).toEqual(400); // kcal always rounds up
      expect(result.protein).toEqual(20);
      expect(result.carbs).toEqual(60);
      expect(result.fat).toEqual(16);
      expect(result.sugar).toEqual(10);
      expect(result.addedSugar).toEqual(4.8);
    });

    test("rounds up all values when shouldRoundUp is true", () => {
      const result = getNutritionInfoFromFoodAndQuantity({
        food: { ...food, proteinPer100G: 7 },
        quantity: 150,
        shouldRoundUp: true,
      });

      // 7 / 100 * 150 = 10.5 -> 11
      expect(result.protein).toEqual(11);
    });
  });

  describe("[accumulateMealCategoryMacrosAndSugars]", () => {
    test("accumulates values into the correct meal category", () => {
      const nutriensInfo = {
        kcal: { Breakfast: 0, Lunch: 0 },
        protein: { Breakfast: 0, Lunch: 0 },
        carbs: { Breakfast: 0, Lunch: 0 },
        fat: { Breakfast: 0, Lunch: 0 },
        sugar: 0,
        addedSugar: 0,
      };

      const food = {
        kcal: 200,
        protein: 10,
        carbs: 30,
        fat: 8,
        sugar: 5,
        addedSugar: 2,
      };

      accumulateMealCategoryMacrosAndSugars({
        nutriensInfo,
        category: "Breakfast",
        food,
      });

      expect(nutriensInfo.kcal.Breakfast).toEqual(200);
      expect(nutriensInfo.protein.Breakfast).toEqual(10);
      expect(nutriensInfo.carbs.Breakfast).toEqual(30);
      expect(nutriensInfo.fat.Breakfast).toEqual(8);
      expect(nutriensInfo.sugar).toEqual(5);
      expect(nutriensInfo.addedSugar).toEqual(2);
    });

    test("accumulates multiple foods into the same category", () => {
      const nutriensInfo = {
        kcal: { Lunch: 100 },
        protein: { Lunch: 5 },
        carbs: { Lunch: 15 },
        fat: { Lunch: 3 },
        sugar: 10,
        addedSugar: 3,
      };

      const food = {
        kcal: 150,
        protein: 8,
        carbs: 20,
        fat: 5,
        sugar: 4,
        addedSugar: 1,
      };

      accumulateMealCategoryMacrosAndSugars({
        nutriensInfo,
        category: "Lunch",
        food,
      });

      expect(nutriensInfo.kcal.Lunch).toEqual(250);
      expect(nutriensInfo.protein.Lunch).toEqual(13);
      expect(nutriensInfo.sugar).toEqual(14);
      expect(nutriensInfo.addedSugar).toEqual(4);
    });
  });

  describe("[calculateNutriensDeficit]", () => {
    test("calculates deficit between max and consumed", () => {
      expect(calculateNutriensDeficit(100, 60)).toEqual(40);
    });

    test("returns negative value when consumed exceeds max", () => {
      expect(calculateNutriensDeficit(100, 120)).toEqual(-20);
    });

    test("returns 0 when max equals consumed", () => {
      expect(calculateNutriensDeficit(100, 100)).toEqual(0);
    });

    test("handles string inputs by parsing to integers", () => {
      expect(calculateNutriensDeficit("200", "150")).toEqual(50);
    });
  });

  describe("[calculateSugarDeficit]", () => {
    test("calculates sugar deficit based on goal calories", () => {
      // maxSugar = ceil(2000 * 0.1 / 4) = 50; deficit = 50 - 30 = 20
      expect(
        calculateSugarDeficit({ goalCalories: 2000, consumedSugar: 30 }),
      ).toEqual(20);
    });

    test("calculates added sugar deficit", () => {
      // maxAddedSugar = ceil(2000 * 0.05 / 4) = 25; deficit = 25 - 10 = 15
      expect(
        calculateSugarDeficit({
          goalCalories: 2000,
          consumedSugar: 10,
          isAddedSugar: true,
        }),
      ).toEqual(15);
    });

    test("returns negative value when sugar exceeds max", () => {
      expect(
        calculateSugarDeficit({ goalCalories: 2000, consumedSugar: 60 }),
      ).toEqual(-10);
    });
  });

  describe("[getInitialNutriensInfo]", () => {
    test("returns object with all nutrient values set to 0", () => {
      expect(getInitialNutriensInfo()).toEqual({
        kcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        addedSugar: 0,
      });
    });
  });

  describe("[getInitialMealNutriensInfo]", () => {
    test("returns nutrient info with additional nutriScore and quantity", () => {
      const result = getInitialMealNutriensInfo();

      expect(result).toEqual({
        kcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        addedSugar: 0,
        nutriScore: 0,
        quantity: 0,
      });
    });
  });

  describe("[getInitialFoodHistory]", () => {
    test("returns empty arrays for all meal categories", () => {
      expect(getInitialFoodHistory()).toEqual({
        [MEAL.BREAKFAST]: [],
        [MEAL.LUNCH]: [],
        [MEAL.DINNER]: [],
        [MEAL.SNACK]: [],
        [MEAL.LIQUID_CALORIES]: [],
      });
    });
  });

  describe("[getInitialMealCategoryValues]", () => {
    test("returns 0 for all meal categories", () => {
      expect(getInitialMealCategoryValues()).toEqual({
        [MEAL.BREAKFAST]: 0,
        [MEAL.LUNCH]: 0,
        [MEAL.DINNER]: 0,
        [MEAL.SNACK]: 0,
        [MEAL.LIQUID_CALORIES]: 0,
      });
    });
  });

  describe("[getInitialFoodDiaryNutriensInfo]", () => {
    test("returns nutrition info with meal category breakdowns for macros", () => {
      const initialNutriens = {
        [MEAL.BREAKFAST]: 0,
        [MEAL.LUNCH]: 0,
        [MEAL.DINNER]: 0,
        [MEAL.SNACK]: 0,
        [MEAL.LIQUID_CALORIES]: 0,
      };

      const result = getInitialFoodDiaryNutriensInfo();

      expect(result.sugar).toEqual(0);
      expect(result.addedSugar).toEqual(0);
      expect(result.kcal).toEqual(initialNutriens);
      expect(result.protein).toEqual(initialNutriens);
      expect(result.carbs).toEqual(initialNutriens);
      expect(result.fat).toEqual(initialNutriens);
    });
  });
});
