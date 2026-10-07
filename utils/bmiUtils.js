import {
  SEX,
  GOALS,
  MACROS,
  ACTIVITY_LEVEL,
} from "../constants/commonConstants";
import * as DateUtils from "./dateUtils";
import * as Validation from "../constants/validationConstants";
import * as ValidationUtils from "./validationUtils";

/**
 * Calculates the optimal weight (midpoint of healthy weight range) and the full
 * healthy weight range for a given height in centimeters.
 *
 * @param {number|string} height - The person's height in centimeters.
 * Must be a number between 140 and 250.
 * @returns {{ optimalWeight: number, optimalWeightRange: { min: number, max: number } }}
 * An object containing:
 *   - `optimalWeight`: the midpoint of the healthy weight range
 *   - `optimalWeightRange`: the minimum and maximum healthy weights
 *
 * @throws {Error} If height is missing, not a number, or out of the valid range (140-250 cm).
 */
export function getOptimalWeightRange(height) {
  const parsedHeight = ValidationUtils.validateNumberParam(
    height,
    "Height",
    Validation.MIN_HEIGHT,
    Validation.MAX_HEIGHT,
    true,
  );

  return {
    optimalWeight: getOptimalWeight(parsedHeight),
    optimalWeightRange: getHealthyWeightRange(parsedHeight),
  };
}

/**
 * Calculates the Body Mass Index (BMI) given height (cm) and weight (kg).
 *
 * @param {number|string} height - The person's height in centimeters.
 * Must be between 140 and 250.
 * @param {number|string} weight - The person's weight in kilograms.
 * Must be between 35 and 300.
 * @returns {number} The BMI value, rounded to 1 decimal place.
 *
 * @throws {Error} If height or weight is missing, not a number, or out of range.
 */
export function getBMI(height, weight) {
  const parsedHeight = ValidationUtils.validateNumberParam(
    height,
    "Height",
    Validation.MIN_HEIGHT,
    Validation.MAX_HEIGHT,
    true,
  );
  const parsedWeight = ValidationUtils.validateNumberParam(
    weight,
    "Weight",
    Validation.MIN_WEIGHT,
    Validation.MAX_WEIGHT,
  );

  const heightMSquare = (parsedHeight / 100) ** 2;
  return parseFloat((parsedWeight / heightMSquare).toFixed(1));
}

/**
 * Calculates the Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation.
 *
 * @param {SEX} sex - The biological sex of the individual.
 * @param {string|Date} birthday - The birthday of the individual, used to calculate age.
 * @param {number} height - Height in centimeters.
 * @param {number} weight - Weight in kilograms.
 * @returns {number} The calculated BMR (rounded to the nearest integer).
 *
 * @throws {Error} If any parameter is missing or invalid.
 *
 * Formula: (https://reference.medscape.com/calculator/846/mifflin-st-jeor-equation)
 *   Male:   BMR = (10 × weight in kg) + (6.25 × height in cm) – (5 × age in years) + 5
 *   Female: BMR = (10 × weight in kg) + (6.25 × height in cm) – (5 × age in years) – 161
 */
export function getBMR(sex, birthday, height, weight) {
  ValidationUtils.validateRequiredParam(sex, "sex");
  const parsedBirthday = ValidationUtils.validateDateParam(
    birthday,
    "birthday",
  );
  const parsedHeight = ValidationUtils.validateNumberParam(
    height,
    "Height",
    Validation.MIN_HEIGHT,
    Validation.MAX_HEIGHT,
    true,
  );
  const parsedWeight = ValidationUtils.validateNumberParam(
    weight,
    "Weight",
    Validation.MIN_WEIGHT,
    Validation.MAX_WEIGHT,
  );
  const age = DateUtils.getAge(parsedBirthday);

  const maleBMR = Math.round(
    10 * parsedWeight + 6.25 * parsedHeight - 5 * age + 5,
  );
  const femaleBMR = Math.round(
    10 * parsedWeight + 6.25 * parsedHeight - 5 * age - 161,
  );

  return sex === SEX.MALE ? maleBMR : femaleBMR;
}

/**
 * Calculates the daily calorie needs based on Basal Metabolic Rate (BMR) and activity level.
 * Uses multipliers according to standard physical activity categories.
 *
 * Reference: https://mohap.gov.ae/en/awareness-centre/daily-calorie-requirements-calculator
 *
 * @param {string} activityLevel - The activity level (must match one of the ACTIVITY_LEVEL titles).
 * @param {number} bmr - The Basal Metabolic Rate (between 500 and 4500).
 * @returns {number} Estimated daily calorie needs (rounded to the nearest integer).
 *
 * @throws {Error} If activityLevel is missing or invalid.
 * @throws {Error} If bmr is missing or outside the allowed range (500 - 4500).
 *
 * Multipliers:
 *  - Not Very Active → 1.2
 *  - Lightly Active → 1.375
 *  - Active → 1.55
 *  - Very Active → 1.725
 *  - Extra Active → 1.9
 */
export function getCalorieNeeds(activityLevel, bmr) {
  ValidationUtils.validateRequiredParam(activityLevel, "activityLevel");
  const parsedBMR = ValidationUtils.validateNumberParam(
    bmr,
    "bmr",
    Validation.MIN_BMR,
    Validation.MAX_BMR,
    true,
  );

  switch (activityLevel) {
    case ACTIVITY_LEVEL.NOT_VERY_ACTIVE.title:
      return Math.round(parsedBMR * 1.2);
    case ACTIVITY_LEVEL.LIGHTLY_ACTIVE.title:
      return Math.round(parsedBMR * 1.375);
    case ACTIVITY_LEVEL.ACTIVE.title:
      return Math.round(parsedBMR * 1.55);
    case ACTIVITY_LEVEL.VERY_ACTIVE.title:
      return Math.round(parsedBMR * 1.725);
    case ACTIVITY_LEVEL.EXTRA_ACTIVE.title:
      return Math.round(parsedBMR * 1.9);
    default:
      throw new Error("Invalid parameter: activityLevel!");
  }
}

/**
 * Generates a weight loss or gain plan based on current weight, goal weight,
 * calorie target, and daily calorie needs.
 *
 * Reference: https://onefitness.com.au/the-real-facts-about-burning-body-fat/
 *
 * - 1 kg of body fat is roughly equivalent to 7700 kcal.
 * - If goal weight < starting weight → "LOOSE" plan.
 * - If goal weight > starting weight → "GAIN" plan.
 * - If goal weight == starting weight → "MAINTAIN".
 *
 * @param {number} startingWeight - The initial weight in kg.
 * @param {number} goalWeight - The target weight in kg.
 * @param {number} goalCalories - The daily calorie intake goal.
 * @param {number} calorieNeeds - The estimated daily calorie needs.
 *
 * @returns {Object} A plan object:
 *  - If maintaining: `{ plan: GOALS.MAINTAIN }`
 *  - If losing or gaining: `{ plan, weeklyRate, goalDate }`
 *
 * @throws {Error} If parameters are invalid or outside allowed ranges.
 */
export function getLossOrGainPlan(
  startingWeight,
  goalWeight,
  goalCalories,
  calorieNeeds,
) {
  const parsedStartingWeight = ValidationUtils.validateNumberParam(
    startingWeight,
    "startingWeight",
    Validation.MIN_WEIGHT,
    Validation.MAX_WEIGHT,
  );
  const parsedGoalWeight = ValidationUtils.validateNumberParam(
    goalWeight,
    "goalWeight",
    Validation.MIN_WEIGHT,
    Validation.MAX_WEIGHT,
  );
  const parsedGoalCalories = ValidationUtils.validateNumberParam(
    goalCalories,
    "goalCalories",
    Validation.MIN_GOAL_CALORIES,
    Validation.MAX_GOAL_CALORIES,
    true,
  );
  const parsedCalorieNeeds = ValidationUtils.validateNumberParam(
    calorieNeeds,
    "calorieNeeds",
    Validation.MIN_CALORIE_NEEDS,
    Validation.MAX_CALORIE_NEEDS,
    true,
  );

  const cond1 =
    parsedStartingWeight === parsedGoalWeight &&
    parsedGoalCalories !== parsedCalorieNeeds;
  const cond2 =
    parsedStartingWeight < parsedGoalWeight &&
    parsedGoalCalories <= parsedCalorieNeeds;
  const cond3 =
    parsedStartingWeight > parsedGoalWeight &&
    parsedGoalCalories >= parsedCalorieNeeds;

  if (cond1 || cond2 || cond3) {
    throw new Error(
      "Invalid parameter(s): The goal in weight does not correlate with the goal with calories!",
    );
  }

  const needToLooseKGs = parsedStartingWeight - parsedGoalWeight;
  const needToBurnCalories = needToLooseKGs * 7700;
  const dailyDiff = Math.abs(parsedCalorieNeeds - parsedGoalCalories);
  const weeklyRate = (dailyDiff * 7) / 7700;

  const sign = Math.sign(needToBurnCalories);
  const plan =
    sign === 1 ? GOALS.LOOSE : sign === -1 ? GOALS.GAIN : GOALS.MAINTAIN;

  if (plan === GOALS.MAINTAIN)
    return { plan, weeklyRate: undefined, goalDate: undefined };

  const days = Math.abs(needToBurnCalories / dailyDiff);
  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);

  return {
    plan: plan,
    weeklyRate: weeklyRate,
    goalDate: DateUtils.getDateShortStringFormat(futureDate),
  };
}

/**
 * Calculates the number of grams for a macronutrient based on its
 * percentage of total daily calories.
 *
 * - Fat provides 9 kcal per gram.
 * - Protein and Carbohydrates provide 4 kcal per gram.
 *
 * @param {string} macroName - Name of the macronutrient (e.g., MACROS.FAT).
 * @param {number} percentage - Percentage of total calories allocated to this macro (5-90).
 * @param {number} goalCalories - Total daily calorie goal.
 *
 * @returns {number} Grams of the macronutrient (rounded up).
 *
 * @throws {Error} If parameters are missing or invalid.
 */
export function getMacroGramm(macroName, percentage, goalCalories) {
  ValidationUtils.validateRequiredParam(macroName, "macroName");
  const parsedPercentage = ValidationUtils.validateNumberParam(
    percentage,
    "percentage",
    Validation.MIN_MACRO_PERCENTAGE,
    Validation.MAX_MACRO_PERCENTAGE,
    true,
  );
  const parsedGoalCalories = ValidationUtils.validateNumberParam(
    goalCalories,
    "goalCalories",
    Validation.MIN_GOAL_CALORIES,
    Validation.MAX_GOAL_CALORIES,
    true,
  );

  const macrosInCalories = parsedGoalCalories * (parsedPercentage / 100);
  const gramm =
    macroName === MACROS.FAT
      ? Math.ceil(macrosInCalories / 9)
      : Math.ceil(macrosInCalories / 4);

  return gramm;
}

// HELPERS

/**
 * Returns the healthy BMI range for adults.
 *
 * Reference: https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html
 *
 * @returns {{ min: number, max: number }} Minimum and maximum healthy BMI.
 */
function getHealtyBmiRange() {
  return {
    min: 18.5,
    max: 24.99,
  };
}

/**
 * Calculates the healthy weight range (kg) for a given height.
 *
 * @param {number} heightCm - Height in centimeters.
 * @returns {{ min: number, max: number }} Minimum and maximum healthy weight in kg.
 *
 */
function getHealthyWeightRange(heightCm) {
  const { min: minBMI, max: maxBMI } = getHealtyBmiRange();
  const heightM = heightCm / 100;

  const minWeight = minBMI * heightM ** 2;
  const maxWeight = maxBMI * heightM ** 2;

  return {
    min: parseFloat(minWeight.toFixed(1)),
    max: parseFloat(maxWeight.toFixed(1)),
  };
}

/**
 * Calculates the optimal weight (middle of healthy weight range) for a given height.
 *
 * @param {number} heightCm - Height in centimeters.
 * @returns {number} Optimal weight in kg.
 *
 */
const getOptimalWeight = (heightCm) => {
  const { min, max } = getHealthyWeightRange(heightCm);
  return parseFloat(((parseFloat(max) + parseFloat(min)) / 2.0).toFixed(1));
};
