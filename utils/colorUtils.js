import COLORS from "../constants/colorConstants";

/**
 * Returns a set of dynamic color shades based on whether accent colors should be used.
 *
 * @param {boolean} [accent=false] - If true, use accent colors; otherwise, use primary colors.
 * @returns {Object} Object containing color shades: shade1000, shade900, ..., shade50
 *
 */
export function getDynamicColors(accent = false) {
  return {
    shade1000: accent ? COLORS.ACCENT_1000 : COLORS.PRIMARY_1000,
    shade900: accent ? COLORS.ACCENT_900 : COLORS.PRIMARY_900,
    shade800: accent ? COLORS.ACCENT_800 : COLORS.PRIMARY_800,
    shade700: accent ? COLORS.ACCENT_700 : COLORS.PRIMARY_700,
    shade500: accent ? COLORS.ACCENT_500 : COLORS.PRIMARY_500,
    shade400: accent ? COLORS.ACCENT_400 : COLORS.PRIMARY_400,
    shade200: accent ? COLORS.ACCENT_200 : COLORS.PRIMARY_200,
    shade100: accent ? COLORS.ACCENT_100 : COLORS.PRIMARY_100,
    shade50: accent ? COLORS.ACCENT_50 : COLORS.PRIMARY_50,
  };
}

/**
 * Returns macro nutrient colors, optionally using lighter shades.
 *
 * @param {boolean} [lightShade=false] - If true, returns lighter shades of macro colors.
 * @returns {Object} Object containing macro colors: protein, carbs, fat.
 *
 */
export function getMacroColors(lightShade = false) {
  return {
    protein: lightShade ? COLORS.PROTEIN_100 : COLORS.PROTEIN_500,
    carbs: lightShade ? COLORS.CARBS_100 : COLORS.CARBS_500,
    fat: lightShade ? COLORS.FAT_100 : COLORS.FAT_500,
  };
}

/**
 * Determines the text color for a horizontal input field based on its value
 * and interaction state.
 *
 * If the input has been touched or contains a truthy value, a stronger color
 * is returned. Otherwise, a lighter shade is used. The color palette switches
 * between primary and accent variants depending on the `accent` flag.
 *
 * @param {*} value - The current value of the input. Truthy values indicate the field is filled.
 * @param {boolean} [isTouched=false] - Whether the input has been interacted with.
 * @param {boolean} [accent=false] - Whether to use the accent color palette instead of the primary one.
 * @returns {string} A color value from the COLORS constants.
 */
export function getHorizontalInputValueTextColor(
  value,
  isTouched = false,
  accent = false,
) {
  return isTouched || value
    ? accent
      ? COLORS.ACCENT_500
      : COLORS.PRIMARY_500
    : accent
      ? COLORS.ACCENT_800
      : COLORS.PRIMARY_800;
}

/**
 * Converts a hexadecimal color value to an RGBA string.
 *
 * Supports both 3-digit (#RGB) and 6-digit (#RRGGBB) hex formats.
 * The hash prefix is optional. The resulting RGBA string includes
 * the provided opacity value.
 *
 * @param {string} hex - The hexadecimal color string (e.g. "#ff5733" or "fff").
 * @param {number} [opacity=1] - The opacity value between 0 and 1.
 * @returns {string} The RGBA color string (e.g. "rgba(255, 87, 51, 1)").
 *
 * @throws {Error} If the hex value cannot be parsed into a valid color.
 */
export function hexToRgba(hex, opacity = 1) {
  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
