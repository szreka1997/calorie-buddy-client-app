// USERS RELATED MIN
export const MIN_HEIGHT = 140;
export const MIN_WEIGHT = 35;
export const MIN_AGE = 18;
export const MIN_GOAL_CALORIES = 500;
export const MIN_MACRO_PERCENTAGE = 5;
export const MIN_BMR = 500; // Math.floor(10 * MIN_WEIGHT + 6.25 * MIN_HEIGHT - 5 * MAX_AGE - 161);
export const MIN_CALORIE_NEEDS = MIN_BMR;

// USERS RELATED MAX
export const MAX_HEIGHT = 250;
export const MAX_WEIGHT = 300;
export const MAX_AGE = 100;
export const MAX_GOAL_CALORIES = 10000;
export const MAX_MACRO_PERCENTAGE = 90;
export const MAX_BMR = 4500; // Math.ceil(10 * MAX_WEIGHT + 6.25 * MAX_HEIGHT - 5 * MIN_AGE + 5);
export const MAX_CALORIE_NEEDS = 9000; // 2 * MAX_BMR;

// FOOD RELATED MIN
export const MIN_CALORIES_OR_MACROS_PER_100_G = 0;
export const MIN_RECOMMENDED_SERVING_SIZE = 1;
export const MIN_QUANTITY = 1;
export const MIN_CONSUMED = 0;

// FOOD RELATED MAX
export const MAX_CALORIES_OR_MACROS_PER_100_G = 1000;
export const MAX_RECOMMENDED_SERVING_SIZE = 1000;
export const MAX_QUANTITY = 10000;
export const MAX_CONSUMED = 10000;
