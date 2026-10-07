import * as ValidationUtils from "../utils/validationUtils";

/**
 * Extracts vertical scroll offset from a scroll event.
 *
 * @param {Object} event
 * @returns {number}
 */
export function handleScrollY(event) {
  return event?.nativeEvent?.contentOffset?.y || 0;
}

/**
 * Calculates vertical offset to position an element near screen center.
 *
 * @param {number} scrollY
 * @param {number} pageY
 * @param {number} screenHeight
 * @returns {number}
 */
export function calculateCenterOffset(scrollY, pageY, screenHeight) {
  const parsedScrollY = ValidationUtils.validateNumberParam(scrollY, "scrollY");
  const parsedPageY = ValidationUtils.validateNumberParam(pageY, "pageY");
  const parsedScreenHeight = ValidationUtils.validateNumberParam(
    screenHeight,
    "screenHeight",
  );

  return parsedScrollY + (parsedPageY - parsedScreenHeight / 3);
}
