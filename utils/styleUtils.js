import COLORS from "../constants/colorConstants";
import { getDynamicColors } from "./colorUtils";
import * as ColorUtils from "./colorUtils";
import * as ValidationUtils from "../utils/validationUtils";

/**
 * Determines layout style for alert buttons based on count.
 *
 * @param {number} buttonCount
 * @returns {{ flexDirection: string, justifyContent: string }}
 */
export function getAlertButtonLayout(buttonCount) {
  const parsedButtonCount = ValidationUtils.validateNumberParam(
    buttonCount,
    "buttonCount",
    1,
    10,
    true,
  );

  return {
    flexDirection: parsedButtonCount > 2 ? "column" : "row",
    justifyContent:
      parsedButtonCount === 1
        ? "flex-end"
        : parsedButtonCount === 2
          ? "space-evenly"
          : "center",
  };
}

/**
 * Returns style object for food or meal image display.
 *
 * @param {boolean} [isDetails=false]
 * @param {boolean} [accent=false]
 * @returns {Object}
 */
export function getFoodOrMealImageStyle(isDetails = false, accent = false) {
  const colors = ColorUtils.getDynamicColors(accent);
  const size = isDetails ? 60 : 50;

  return {
    height: size,
    width: size,
    borderRadius: size / 2,
    borderWidth: isDetails ? 2 : 1,
    borderColor: colors.shade500,
  };
}

/**
 * Returns style for kcal text based on view type.
 *
 * @param {boolean} [isDetails=false]
 * @returns {{ fontSize: number }}
 */
export function getKcalTextStyle(isDetails = false) {
  return {
    fontSize: isDetails ? 24 : 18,
  };
}

/**
 * Returns pressed state style based on platform and ripple setting.
 *
 * @param {boolean} [isAndroid=false]
 * @param {boolean} [shouldAndroidRipple=false]
 * @returns {{ opacity: number }}
 */
export function getPressedStyle(
  isAndroid = false,
  shouldAndroidRipple = false,
) {
  return {
    opacity: isAndroid ? (shouldAndroidRipple ? 1 : 0.5) : 0.5,
  };
}

/**
 * Returns style for icon button inner container.
 *
 * @param {number} borderWidth
 * @param {boolean} [useBackgroundColor=false]
 * @param {boolean} [accent=false]
 * @returns {{ borderColor: string, borderWidth: number, backgroundColor: string }}
 */
export function getIconButtonInnerContainerStyle(
  borderWidth,
  useBackgroundColor = false,
  accent = false,
) {
  const colors = ColorUtils.getDynamicColors(accent);
  return {
    borderColor: colors.shade500,
    borderWidth,
    backgroundColor: useBackgroundColor ? colors.shade900 : "transparent",
  };
}

/**
 * Returns text style for comment messages based on type.
 *
 * @param {{ item: Object, accent?: boolean }} params
 * @returns {{ color: string }}
 */
export function getCommentTextStyle({ item, accent = false }) {
  const dynamicColors = getDynamicColors(!accent);
  return {
    color:
      (item?.good && COLORS.GOOD_500) ||
      (item?.risks && COLORS.ERROR_100) ||
      dynamicColors.shade100,
  };
}
