import COLORS from "../constants/colorConstants";
import { getDynamicColors } from "./colorUtils";
import { calculateConsumedPercent } from "./helperFunctions";
import * as Validation from "../constants/validationConstants";
import * as DateUtils from "./dateUtils";
import * as FormUtils from "./formUtils";

/**
 * Calculates total weight change from first to last entry.
 *
 * @param {Array} weights
 * @returns {number}
 */
export function calculateTotalWeightChange(weights) {
  return parseFloat(weights[weights.length - 1]) - parseFloat(weights[0]);
}

/**
 * Calculates average weight change between consecutive entries.
 *
 * @param {Array} weights
 * @returns {number}
 */
export function calculateAvaregeWeightChange(weights) {
  let totalDiff = 0;
  for (let i = 1; i < weights.length; i++) {
    totalDiff += weights[i] - weights[i - 1];
  }
  return totalDiff / (weights.length - 1);
}

/**
 * Formats a number with a signed prefix (+ / -).
 *
 * @param {number} value
 * @returns {string}
 */
export function getSignedValueText(value) {
  return value >= 0 ? `+ ${value}` : `- ${Math.abs(value)}`;
}

/**
 * Prepares weight chart data and summary statistics.
 *
 * @param {Array} weights
 * @param {number} [numberOfData=7]
 * @returns {{
 *   chartData: { labels: Array, data: Array },
 *   statInfo: { netChange: number|string, avaregeLog: number|string }
 * }}
 */
export function prepareWeightChartData(weights, numberOfData = 7) {
  const labels = [];
  const data = [];
  const statInfo = { netChange: 0, avaregeLog: 0 };

  for (let i = 0; i < Math.min(numberOfData, weights.length); i++) {
    const item = weights[i];
    labels.push(DateUtils.getDateLabelName(item.date));
    data.push(parseFloat(item.weight));
  }

  if (data.length > 1) {
    statInfo.netChange = calculateTotalWeightChange(data).toFixed(2);
    statInfo.avaregeLog = calculateAvaregeWeightChange(data).toFixed(2);
  }

  return {
    chartData: { labels, data },
    statInfo,
  };
}

/**
 * Builds nested calorie and macro progress chart data.
 *
 * @param {{
 *   consumedKcal: number|string,
 *   consumedProtein: number|string,
 *   consumedCarbs: number|string,
 *   consumedFat: number|string,
 *   maxKcal: number|string,
 *   maxProtein: number|string,
 *   maxCarbs: number|string,
 *   maxFat: number|string,
 *   accent: boolean
 * }} params
 * @returns {Array}
 */
export function getCaloriesAndMacrosChartData({
  consumedKcal,
  consumedProtein,
  consumedCarbs,
  consumedFat,
  maxKcal,
  maxProtein,
  maxCarbs,
  maxFat,
  accent,
}) {
  const dynamicColors = getDynamicColors(accent);

  return [
    {
      key: "kcal",
      data: [calculateConsumedPercent(consumedKcal, maxKcal)],
      radius: 80,
      color: dynamicColors.shade500,
    },
    {
      key: "protein",
      data: [calculateConsumedPercent(consumedProtein, maxProtein)],
      radius: 60,
      color: COLORS.PROTEIN_500,
    },
    {
      key: "carbs",
      data: [calculateConsumedPercent(consumedCarbs, maxCarbs)],
      radius: 40,
      color: COLORS.CARBS_500,
    },
    {
      key: "fat",
      data: [calculateConsumedPercent(consumedFat, maxFat)],
      radius: 20,
      color: COLORS.FAT_500,
    },
  ];
}

/**
 * Builds explanatory text data for calories and macronutrient breakdown.
 *
 * @param {{
 *   consumedKcal: number|string,
 *   consumedProtein: number|string,
 *   consumedCarbs: number|string,
 *   consumedFat: number|string,
 *   maxKcal: number|string,
 *   maxProtein: number|string,
 *   maxCarbs: number|string,
 *   maxFat: number|string,
 *   accent?: boolean
 * }} params
 * @returns {Array}
 */
export function getCaloriesAndMacrosExplanatoryTextsData({
  consumedKcal,
  consumedProtein,
  consumedCarbs,
  consumedFat,
  maxKcal,
  maxProtein,
  maxCarbs,
  maxFat,
  accent = false,
}) {
  const dynamicColors = getDynamicColors(accent);
  return [
    {
      key: "kcal",
      label: "Kcal: ",
      value: `${consumedKcal} / ${maxKcal}`,
      icon: "flame",
      textColor: dynamicColors.shade50,
      highlightColor: dynamicColors.shade500,
      iconColor: dynamicColors.shade500,
    },
    {
      key: "protein",
      label: "Protein: ",
      value: `${consumedProtein} / ${maxProtein}`,
      icon: "fish",
      textColor: COLORS.PROTEIN_100,
      highlightColor: COLORS.PROTEIN_500,
      iconColor: COLORS.PROTEIN_500,
    },
    {
      key: "carbs",
      label: "Carbs: ",
      value: `${consumedCarbs} / ${maxCarbs}`,
      icon: "nutrition",
      textColor: COLORS.CARBS_100,
      highlightColor: COLORS.CARBS_500,
      iconColor: COLORS.CARBS_500,
    },
    {
      key: "fat",
      label: "Fat: ",
      value: `${consumedFat} / ${maxFat}`,
      icon: "egg",
      textColor: COLORS.FAT_100,
      highlightColor: COLORS.FAT_500,
      iconColor: COLORS.FAT_500,
    },
  ];
}

/**
 * Returns configuration for the add weight form field.
 *
 * @returns {{ weightConfig: Object }}
 */
export function getAddWeightFormFieldsConfig() {
  return {
    weightConfig: FormUtils.createNumericField(
      "weight",
      "Today's weight (kg)",
      "Enter today's weight",
      Validation.MIN_WEIGHT,
      Validation.MAX_WEIGHT,
    ),
  };
}
