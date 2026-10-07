import COLORS from "../constants/colorConstants";
import { MEAL } from "../constants/commonConstants";
import { getChartConfig } from "./helperFunctions";
import * as FormUtils from "../utils/formUtils";
import * as Validation from "../constants/validationConstants";
import * as ValidationUtils from "../utils/validationUtils";

/**
 * Returns configuration for the "Add Food" form fields.
 *
 * @returns {Array} Array of form field configuration objects
 */
export function getAddFoodFormFieldsConfig() {
  return [
    FormUtils.createStringFields("name", "Name", "Enter name"),
    FormUtils.createNumericField(
      "kcalPer100G",
      "Kcal / 100g",
      "Enter kcal / 100g",
      Validation.MIN_CALORIES_OR_MACROS_PER_100_G,
      Validation.MAX_CALORIES_OR_MACROS_PER_100_G,
      true,
    ),
    FormUtils.createNumericField(
      "recommendedServingSize",
      "Recommended Serving Size",
      "Enter data",
      Validation.MIN_RECOMMENDED_SERVING_SIZE,
      Validation.MAX_RECOMMENDED_SERVING_SIZE,
      true,
    ),
    FormUtils.createNumericField(
      "proteinPer100G",
      "Protein / 100g",
      "Enter protein / 100g",
    ),
    FormUtils.createNumericField(
      "carbsPer100G",
      "Carbs / 100g",
      "Enter carbs / 100g",
    ),
    FormUtils.createNumericField(
      "fatPer100G",
      "Fat / 100g",
      "Enter fat / 100g",
    ),
    FormUtils.createNumericField(
      "sugarPer100G",
      "Sugar / 100g",
      "Enter sugar / 100g",
    ),
    FormUtils.createNumericField(
      "addedSugarPer100G",
      "Added Sugar / 100g",
      "Enter data",
    ),
  ].filter(Boolean);
}

/**
 * Returns configuration for the "Log Food" form fields.
 *
 * @returns {Object} Form field configuration object
 */
export function getLogFoodFormFieldsConfig() {
  return {
    quantityConfig: FormUtils.createNumericField(
      "quantity",
      "Quantity (g)",
      "Enter quantity",
      Validation.MIN_QUANTITY,
      Validation.MAX_QUANTITY,
      true,
    ),
    mealConfig: FormUtils.createRadioFields("mealCategory", "Meal", "", [
      { label: MEAL.BREAKFAST, value: MEAL.BREAKFAST },
      { label: MEAL.LUNCH, value: MEAL.LUNCH },
      { label: MEAL.DINNER, value: MEAL.DINNER },
      { label: MEAL.SNACK, value: MEAL.SNACK },
      {
        label: MEAL.LIQUID_CALORIES,
        value: MEAL.LIQUID_CALORIES,
      },
    ]),
  };
}

/**
 * Creates initial form values for a food form from given data.
 *
 * @param {Object} [data]
 * @returns {Object} Initial form values
 */
export function getInitialFoodFormValues(data) {
  return {
    name: data?.name || "",
    kcalPer100G: data?.kcalPer100G?.toString() || "",
    recommendedServingSize: data?.recommendedServingSize?.toString() || "",
    carbsPer100G: data?.carbsPer100G?.toString() || "",
    proteinPer100G: data?.proteinPer100G?.toString() || "",
    fatPer100G: data?.fatPer100G?.toString() || "",
    sugarPer100G: data?.sugarPer100G?.toString() || "",
    addedSugarPer100G: data?.addedSugarPer100G?.toString() || "",
  };
}

/**
 * Calculates progress ratio based on consumed and max values.
 *
 * @param {number} consumed
 * @param {number} max
 * @param {boolean} [isCalorie=false]
 * @returns {number} Value between 0 and 1
 */
export function calculateProgress(consumed, max, isCalorie = false) {
  const parsedConsumed = ValidationUtils.validateNumberParam(
    consumed,
    "consumed",
    Validation.MIN_CONSUMED,
    !isCalorie ? Validation.MAX_CONSUMED : undefined,
    true,
  );
  const parsedMax = ValidationUtils.validateNumberParam(
    max,
    "max",
    Validation.MIN_CONSUMED,
    Validation.MAX_CONSUMED,
    true,
  );

  if (parsedMax === 0) return 0;
  if (parsedMax <= parsedConsumed) return 1;

  return parsedConsumed / parsedMax;
}

/**
 * Determines feedback emoticon based on consumed vs max values.
 *
 * @param {number} consumed
 * @param {number} max
 * @param {boolean} [isCaloreis=false]
 * @param {boolean} [isProtein=false]
 * @returns {string} Emoticon name
 */
export function getFeedbackEmoticonName(
  consumed,
  max,
  isCaloreis = false,
  isProtein = false,
) {
  const parsedConsumed = ValidationUtils.validateNumberParam(
    consumed,
    "consumed",
    Validation.MIN_CONSUMED,
    !isCaloreis ? Validation.MAX_CONSUMED : undefined,
    true,
  );
  const parsedMax = ValidationUtils.validateNumberParam(
    max,
    "max",
    Validation.MIN_CONSUMED,
    Validation.MAX_CONSUMED,
    true,
  );

  if (isCaloreis) {
    return Math.abs(parsedConsumed - parsedMax) <= 100
      ? "smile-beam"
      : "sad-cry";
  }
  if (isProtein) return parsedConsumed >= parsedMax ? "smile-beam" : "sad-cry";

  return parsedConsumed < parsedMax ? "smile-beam" : "sad-cry";
}

/**
 * Converts Nutri-Score letter (A–E) to numeric value.
 *
 * @param {string} scoreText
 * @returns {number} Value from 1 (E) to 5 (A)
 */
export function getNumberRepresentationOfNutriScore(scoreText) {
  ValidationUtils.validateRequiredParam(scoreText, "scoreText");

  switch (scoreText) {
    case "A":
      return 5;
    case "B":
      return 4;
    case "C":
      return 3;
    case "D":
      return 2;
    case "E":
      return 1;
    default:
      throw new Error(
        "Invalid parameter: scoreText! It has to be one of A – E!",
      );
  }
}

/**
 * Converts numeric Nutri-Score (1–5) to letter grade (A–E).
 *
 * @param {number} scoreNumber
 * @returns {string} Nutri-Score letter
 */
export function getStringRepresentationOfNutriScoreFromNumber(scoreNumber) {
  const parsedScoreNumber = ValidationUtils.validateNumberParam(
    scoreNumber,
    "scoreNumber",
    1,
    5,
  );

  if (parsedScoreNumber >= 4.5) return "A";
  if (parsedScoreNumber >= 3.5) return "B";
  if (parsedScoreNumber >= 2.5) return "C";
  if (parsedScoreNumber >= 1.5) return "D";

  return "E";
}

/**
 * Calculates consumed nutrient amount based on per 100g value and quantity.
 *
 * @param {number} valuePer100G
 * @param {number} quantity
 * @param {boolean} [shouldRoundUp=false]
 * @returns {number} Calculated amount
 */
export function calculateConsumedAmount(
  valuePer100G,
  quantity,
  shouldRoundUp = false,
) {
  const parsedValuePer100G = ValidationUtils.validateNumberParam(
    valuePer100G,
    "valuePer100G",
    Validation.MIN_CALORIES_OR_MACROS_PER_100_G,
    Validation.MAX_CALORIES_OR_MACROS_PER_100_G,
  );
  const parsedQuantity = ValidationUtils.validateNumberParam(
    quantity,
    "quantity",
    Validation.MIN_QUANTITY,
    Validation.MAX_QUANTITY,
  );

  const subtotal = (parsedValuePer100G / 100) * parsedQuantity;
  return shouldRoundUp ? Math.ceil(subtotal) : subtotal;
}

/**
 * Validates that a meal contains at least 2 food items.
 *
 * @param {Array} foodIdAndQuantityList
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateMealItems(foodIdAndQuantityList) {
  if (!foodIdAndQuantityList || foodIdAndQuantityList.length < 2) {
    return {
      valid: false,
      error: "You have to add at least 2 meal items!",
    };
  }
  return { valid: true };
}

/**
 * Returns an image source for a food item.
 *
 * @param {string} imageUri
 * @param {boolean} [accent=false]
 * @returns {object} Image source (uri or local asset)
 */
export function getFoodImageSource(imageUri, accent = false) {
  if (imageUri) return { uri: imageUri };
  return accent
    ? require("../assets/images/no-image-accent.png")
    : require("../assets/images/no-image.png");
}

/**
 * Returns verification label for a food item.
 *
 * @param {boolean} [isVerified=false]
 * @param {boolean} [isMeal=false]
 * @returns {string|null} Verification text or null for meals
 */
export function getFoodVerificationText(isVerified = false, isMeal = false) {
  if (isMeal) return null;
  return isVerified ? "VERIFIED" : "NOT VERIFIED";
}

/**
 * Returns icon configuration for food verification status.
 *
 * @param {boolean} [isVerified=false]
 * @param {boolean} [isMeal=false]
 * @returns {{type: string, name: string, color: string}|null}
 */
export function getFoodVerificationIcon(isVerified = false, isMeal = false) {
  if (isMeal) return null;
  if (isVerified) {
    return {
      type: "MaterialIcons",
      name: "verified-user",
      color: COLORS.GOOD_500,
    };
  }
  return { type: "Octicons", name: "shield-x", color: COLORS.ERROR_500 };
}

/**
 * Returns configuration for image picker action buttons.
 *
 * @param {Function} importPhotoHandler
 * @param {Function} takePhotoHandler
 * @param {Function} deletePhotoHandler
 * @param {Function} cancelHandler
 * @param {boolean} [showImage]
 * @param {boolean} [accent=false]
 * @returns {Array} Button configuration array
 */
export function getImagePickerButtonConfigs(
  importPhotoHandler = () => {},
  takePhotoHandler = () => {},
  deletePhotoHandler = () => {},
  cancelHandler = () => {},
  showImage = undefined,
  accent = false,
) {
  const baseOptions = [
    {
      title: "Import Photo",
      accent,
      icon: "image",
      onPress: importPhotoHandler,
    },
    {
      title: "Take a Photo",
      accent,
      icon: "camera",
      onPress: takePhotoHandler,
    },
  ];

  const cancelOption = {
    title: "Cancel",
    accent: !accent,
    icon: "close",
    onPress: cancelHandler,
  };

  return showImage
    ? [
        ...baseOptions,
        {
          title: "Delete Photo",
          accent,
          icon: "trash",
          onPress: deletePhotoHandler,
        },
        cancelOption,
      ]
    : [...baseOptions, cancelOption];
}

/**
 * Generates configuration for Nutri-Score selection options.
 *
 * @param {string} selectedNutriScore
 * @returns {Array} Nutri-Score config objects
 */
export function getNutriScoreConfig(selectedNutriScore) {
  ValidationUtils.validateRequiredParam(
    selectedNutriScore,
    "selectedNutriScore",
  );

  const nutriScores = ["A", "B", "C", "D", "E"];

  if (!nutriScores.includes(selectedNutriScore))
    throw new Error(
      "Invalid parameter: selectedNutriScore! It has to be one of A – E!",
    );

  const nutriScoreConfig = nutriScores.map((nutriScore) => ({
    label: nutriScore,
    backgroundColor: COLORS[`NUTRI_SCORE_${nutriScore}_500`],
    textColor: COLORS[`NUTRI_SCORE_${nutriScore}_100`],
    isSelected: selectedNutriScore === nutriScore,
  }));

  return [...nutriScoreConfig];
}

/**
 * Calculates maximum healthy sugar intake based on calorie goal.
 *
 * @param {number} goalCalories
 * @param {boolean} [isAddedSugar=false]
 * @returns {number} Max sugar amount in grams
 */
export function calculateMaxHealthySugarAmount(
  goalCalories,
  isAddedSugar = false,
) {
  const parsedGoalCalories = ValidationUtils.validateNumberParam(
    goalCalories,
    "goalCalories",
    Validation.MIN_GOAL_CALORIES,
    Validation.MAX_GOAL_CALORIES,
  );
  const percentage = isAddedSugar ? 0.05 : 0.1;

  return Math.ceil((parsedGoalCalories * percentage) / 4);
}

/**
 * Determines default meal category based on current time.
 *
 * @returns {string} Meal category
 */
export function getStartingMealCategory() {
  const dateTimeNow = new Date();
  const hourNow = dateTimeNow.getHours();
  const startingMeal =
    hourNow < 5
      ? MEAL.DINNER
      : hourNow < 11
        ? MEAL.BREAKFAST
        : hourNow < 16
          ? MEAL.LUNCH
          : MEAL.DINNER;

  return startingMeal;
}

/**
 * Retrieves quantity (as string) for a given food ID from a list.
 *
 * @param {Array} foodIdAndQuantityList
 * @param {string|number} id
 * @returns {string|null}
 */
export function getQuantityFromIdAndQuantityList(foodIdAndQuantityList, id) {
  if (foodIdAndQuantityList) {
    for (let item of foodIdAndQuantityList) {
      if (item.foodId === id) return item.quantity?.toString();
    }
  }
  return null;
}

/**
 * Normalizes a search string by lowercasing and replacing accented characters.
 *
 * @param {string} searchItem
 * @returns {string}
 */
export function transformSearchItem(searchItem) {
  const map = {
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ö: "o",
    ő: "o",
    ú: "u",
    ü: "u",
    ű: "u",
  };

  const text = searchItem.toLowerCase();
  return text.replace(/[áéíóöőúüű]/g, (char) => map[char]);
}

/**
 * Finds the starting index of a search string within text.
 *
 * @param {{ text: string, searchText: string }} params
 * @returns {number|null}
 */
export function findMatchStartingIndex({ text, searchText }) {
  if (!text || !searchText) return null;

  const startIndex = text.indexOf(searchText);

  return startIndex !== -1 ? startIndex : null;
}

/**
 * Splits a food name into parts for highlighting a search match.
 *
 * @param {{ name: string, searchText: string }} params
 * @returns {{ preHighlightText: string, highlightText: string, postHightlightText: string }|null}
 */
export function getHighlightTextsFromFoodNameAndSearchText({
  name,
  searchText,
}) {
  if (!name || !searchText) return null;

  const transformedName = transformSearchItem(name);
  const transformedSearchText = transformSearchItem(searchText);
  const startIndex = findMatchStartingIndex({
    text: transformedName,
    searchText: transformedSearchText,
  });

  if (startIndex === null || startIndex === undefined) return null;

  const preHighlightText = name.slice(0, startIndex);
  const highlightText = name.slice(startIndex, startIndex + searchText.length);
  const postHightlightText = name.slice(
    startIndex + searchText.length,
    name.length,
  );

  return {
    preHighlightText,
    highlightText,
    postHightlightText,
  };
}

/**
 * Filters food items by search text (case- and accent-insensitive).
 *
 * @param {Array} list
 * @param {string} value
 * @returns {Array}
 */
export function filterFoodDataBySearchText(list, value) {
  const inputText = transformSearchItem(value);

  const resultList = list.filter((item) => {
    const foodText = transformSearchItem(item.name);
    return foodText.includes(inputText);
  });

  return resultList;
}

/**
 * Prepares data and config for a macros pie chart.
 *
 * @param {{ protein: number, carbs: number, fat: number }} params
 * @returns {{ data: Array, chartConfig: Object }}
 */
export function getMacrosPieChartData({ protein, carbs, fat }) {
  const data = [
    {
      population: carbs,
      color: COLORS.CARBS_500,
    },
    {
      population: protein,
      color: COLORS.PROTEIN_500,
    },
    {
      population: fat,
      color: COLORS.FAT_500,
    },
  ];
  const chartConfig = getChartConfig({ color: COLORS.PRIMARY_900 });

  return { data, chartConfig };
}

/**
 * Calculates nutrition values for a food item based on quantity.
 *
 * @param {{ food: Object, quantity: number, shouldRoundUp?: boolean }} params
 * @returns {{
 *   kcal: number,
 *   protein: number,
 *   carbs: number,
 *   fat: number,
 *   sugar: number,
 *   addedSugar: number
 * }}
 */
export function getNutritionInfoFromFoodAndQuantity({
  food,
  quantity,
  shouldRoundUp = false,
}) {
  const nutriensInfo = {};

  nutriensInfo.kcal = Math.round(
    calculateConsumedAmount(food.kcalPer100G, quantity),
  );
  nutriensInfo.protein = calculateConsumedAmount(
    food.proteinPer100G,
    quantity,
    shouldRoundUp,
  );
  nutriensInfo.carbs = calculateConsumedAmount(
    food.carbsPer100G,
    quantity,
    shouldRoundUp,
  );
  nutriensInfo.fat = calculateConsumedAmount(
    food.fatPer100G,
    quantity,
    shouldRoundUp,
  );
  nutriensInfo.sugar = calculateConsumedAmount(
    food.sugarPer100G,
    quantity,
    shouldRoundUp,
  );
  nutriensInfo.addedSugar = calculateConsumedAmount(
    food.addedSugarPer100G,
    quantity,
    shouldRoundUp,
  );

  return { ...nutriensInfo };
}

/**
 * Accumulates macro and sugar values into a meal category breakdown.
 *
 * @param {{
 *   nutriensInfo: Object,
 *   category: string,
 *   food: Object
 * }} params
 * @returns {void}
 */
export function accumulateMealCategoryMacrosAndSugars({
  nutriensInfo,
  category,
  food,
}) {
  const add = (current, value) =>
    parseFloat(parseFloat(current) + parseFloat(value));

  nutriensInfo.kcal[category] = add(nutriensInfo.kcal[category], food.kcal);
  nutriensInfo.protein[category] = add(
    nutriensInfo.protein[category],
    food.protein,
  );
  nutriensInfo.carbs[category] = add(nutriensInfo.carbs[category], food.carbs);
  nutriensInfo.fat[category] = add(nutriensInfo.fat[category], food.fat);

  nutriensInfo.sugar = add(nutriensInfo.sugar, food.sugar);
  nutriensInfo.addedSugar = add(nutriensInfo.addedSugar, food.addedSugar);
}

/**
 * Calculates nutrient deficit between max and consumed values.
 *
 * @param {number} max
 * @param {number} consumed
 * @returns {number}
 */
export function calculateNutriensDeficit(max, consumed) {
  return parseInt(max) - parseInt(consumed);
}

/**
 * Calculates sugar deficit based on calorie goal and consumed sugar.
 *
 * @param {{ goalCalories: number, consumedSugar: number, isAddedSugar?: boolean }} params
 * @returns {number}
 */
export function calculateSugarDeficit({
  goalCalories,
  consumedSugar,
  isAddedSugar = false,
}) {
  const maxSugar = calculateMaxHealthySugarAmount(goalCalories, isAddedSugar);
  return maxSugar - parseInt(consumedSugar);
}

/**
 * Returns initial empty nutrition values.
 *
 * @returns {{
 *   kcal: number,
 *   protein: number,
 *   carbs: number,
 *   fat: number,
 *   sugar: number,
 *   addedSugar: number
 * }}
 */
export function getInitialNutriensInfo() {
  return {
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sugar: 0,
    addedSugar: 0,
  };
}

/**
 * Returns initial nutrition state for a meal.
 *
 * @returns {{
 *   kcal: number,
 *   protein: number,
 *   carbs: number,
 *   fat: number,
 *   sugar: number,
 *   addedSugar: number,
 *   nutriScore: number,
 *   quantity: number
 * }}
 */
export function getInitialMealNutriensInfo() {
  return {
    ...getInitialNutriensInfo(),
    nutriScore: 0,
    quantity: 0,
  };
}

/**
 * Returns initial empty food history grouped by meal categories.
 *
 * @returns {Object}
 */
export function getInitialFoodHistory() {
  return {
    [MEAL.BREAKFAST]: [],
    [MEAL.LUNCH]: [],
    [MEAL.DINNER]: [],
    [MEAL.SNACK]: [],
    [MEAL.LIQUID_CALORIES]: [],
  };
}

/**
 * Returns initial numeric values for each meal category.
 *
 * @returns {Object}
 */
export function getInitialMealCategoryValues() {
  return {
    [MEAL.BREAKFAST]: 0,
    [MEAL.LUNCH]: 0,
    [MEAL.DINNER]: 0,
    [MEAL.SNACK]: 0,
    [MEAL.LIQUID_CALORIES]: 0,
  };
}

/**
 * Returns initial nutrition state for a food diary, grouped by meal category.
 *
 * @returns {Object}
 */
export function getInitialFoodDiaryNutriensInfo() {
  return {
    ...getInitialNutriensInfo(),
    kcal: { ...getInitialMealCategoryValues() },
    protein: { ...getInitialMealCategoryValues() },
    carbs: { ...getInitialMealCategoryValues() },
    fat: { ...getInitialMealCategoryValues() },
  };
}
