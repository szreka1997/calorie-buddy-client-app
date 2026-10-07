import COLORS from "../constants/colorConstants";
import { getDynamicColors, hexToRgba } from "./colorUtils";
import * as ValidationUtils from "../utils/validationUtils";

/**
 * Calculates percentage of a number relative to a total.
 *
 * @param {number} number
 * @param {number} total
 * @returns {number} Percentage (0–100)
 */
export function calculatePercentage(number, total) {
  const parsedNumber = ValidationUtils.validateNumberParam(number, "number");
  const parsedTotal = ValidationUtils.validateNumberParam(total, "total");

  if (parsedTotal === 0) {
    throw new Error("Invalid parameter! total must not be zero!");
  }

  return Math.round((parsedNumber / parsedTotal) * 100);
}

/**
 * Sums all values in a dictionary/object.
 *
 * @param {Object} dict
 * @returns {number}
 */
export function sumDictElements(dict) {
  let sum = 0;
  Object.values(dict).forEach((value) => {
    sum += value;
  });

  return sum;
}

/**
 * Sums all elements in a list, optionally as integers.
 *
 * @param {Array} list
 * @param {boolean} [isInt=false]
 * @returns {number}
 */
export function sumListElements(list, isInt = false) {
  return list.reduce(
    (a, c) =>
      isInt ? parseInt(a) + parseInt(c) : parseFloat(a) + parseFloat(c),
    0,
  );
}

/**
 * Calculates the average of list elements.
 *
 * @param {Array} list
 * @param {boolean} [isInt=false]
 * @returns {number}
 */
export function avaregeListElements(list, isInt = false) {
  return Math.ceil(parseFloat(sumListElements(list, isInt)) / list.length);
}

/**
 * Parses all values in an object into numbers (int or float).
 *
 * @param {{ data: Object, isDecimal?: boolean }} params
 * @returns {Object}
 */
export function parseNumeric({ data, isDecimal = false }) {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      isDecimal ? parseFloat(value) : parseInt(value),
    ]),
  );
}

/**
 * Calculates consumed percentage capped at 1 (100%).
 *
 * @param {number|string} consumed
 * @param {number|string} max
 * @returns {number} Value between 0 and 1
 */
export function calculateConsumedPercent(consumed, max) {
  const amount = parseFloat(consumed) / parseFloat(max);

  return amount > 1 ? 1 : amount;
}

/**
 * Creates chart color configuration with opacity support.
 *
 * @param {{ color: string }} params
 * @returns {{ color: (opacity?: number) => string }}
 */
export function getChartConfigColor({ color }) {
  return {
    color: (opacity = 1) => hexToRgba(color, opacity),
  };
}

/**
 * Builds base chart configuration with transparent background and color settings.
 *
 * @param {{ color: string }} params
 * @returns {Object}
 */
export function getChartConfig({ color }) {
  return {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    ...getChartConfigColor({ color }),
  };
}

/**
 * Builds chart data for a single-value progress indicator.
 *
 * @param {{ actualAmount: number|string, totalAmount: number|string, accent: boolean }} params
 * @returns {{ data: number[], chartConfig: Object }}
 */
export function getCustomChartData({ actualAmount, totalAmount, accent }) {
  const colors = getDynamicColors(accent);
  const data = [calculateConsumedPercent(actualAmount, totalAmount)];
  const chartConfig = getChartConfig({ color: colors.shade500 });

  return { data, chartConfig };
}

/**
 * Builds configuration and data for a line chart.
 *
 * @param {{ rawData: { labels: Array, data: Array }, legend: string, accent?: boolean }} params
 * @returns {{ data: Object, chartConfig: Object }}
 */
export function getCustomLineChartData({ rawData, legend, accent = false }) {
  const data = {
    labels: rawData.labels,
    datasets: [
      {
        data: rawData.data,
        ...getChartConfigColor({
          color: accent ? COLORS.PRIMARY_500 : COLORS.ACCENT_500,
        }),
      },
    ],
    legend: [legend],
  };

  const chartConfig = {
    ...getChartConfig({
      color: accent ? COLORS.ACCENT_500 : COLORS.PRIMARY_500,
    }),
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  return { data, chartConfig };
}
