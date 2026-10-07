import { calculateAge } from "./ageUtils";
import * as ValidationUtils from "../utils/validationUtils";

/**
 * Calculates the age based on a given birthday.
 *
 * The input date is validated before computing the age. After calculation,
 * the resulting age is also validated to ensure it falls within acceptable limits.
 *
 * @param {Date|string|number} birthday - The birth date of the individual.
 * @returns {number} The calculated age in years.
 *
 * @throws {Error} If the birthday is invalid or the resulting age is out of bounds.
 */
export function getAge(birthday) {
  const parsedBirthday = ValidationUtils.validateDateParam(
    birthday,
    "birthday",
  );

  const age = calculateAge(parsedBirthday);

  ValidationUtils.validateAgeParam(age, "birthday");

  return age;
}

/**
 * Formats a date into a human-readable string (e.g., "Jan 15, 2023").
 *
 * @param {string | Date} date - The date to format, either a Date object or a valid date string.
 * @returns {string} Formatted date string.
 * @throws {Error} If the date is missing or invalid.
 *
 */
export function getDateStringFormat(date) {
  const parsedDate = ValidationUtils.validateDateParam(date, "date");

  return `${getMonthShortName(
    parsedDate.getMonth(),
  )} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`;
}

/**
 * Converts a date into an local short string format (YYYY-MM-DD).
 *
 * @param {string | Date} date - The date to format, either a Date object or a valid date string.
 * @returns {string} The formatted date string in "YYYY-MM-DD" format.
 * @throws {Error} If the date is missing or invalid.
 *
 */
export function getDateShortStringFormat(date) {
  const parsedDate = ValidationUtils.validateDateParam(date, "date");

  return parsedDate.toLocaleDateString("en-CA");
}

/**
 * Formats a date string into a short label (MM.DD.).
 *
 * The input date is converted to a local date string using the "en-CA" format
 * (YYYY-MM-DD), then transformed into a "MM.DD." label.
 *
 * @param {string|Date|number} date - The input date value.
 * @returns {string} A formatted date label in "MM.DD." format.
 *
 * @throws {Error} If the provided date cannot be parsed.
 */
export function getDateLabelName(date) {
  const localDate = new Date(date).toLocaleDateString("en-CA");
  const tempList = localDate.split("-");

  return tempList[1] + "." + tempList[2] + ".";
}

/**
 * Returns a new date offset by a given number of days from a previous date in local date.
 *
 * Creates a copy of the provided date and shifts it forward or backward
 * by the specified offset in days.
 *
 * @param {Object} params - The input parameters.
 * @param {Date} params.prevDate - The base date to calculate from.
 * @param {number} params.offset - The number of days to shift (can be negative).
 * @returns {Date} A new Date instance adjusted by the given offset.
 *
 * @throws {Error} If the provided date is invalid.
 */
export function getNeighbourDate({ prevDate, offset }) {
  const localPrevDate = getDateShortStringFormat(prevDate);
  const parsedPrevDate = new Date(localPrevDate);

  parsedPrevDate.setDate(parsedPrevDate.getDate() + offset);

  return new Date(getDateShortStringFormat(parsedPrevDate));
}

/**
 * Returns a formatted date label for the food diary.
 *
 * If the provided date matches today's date, the function returns "TODAY".
 * Otherwise, it returns the date formatted as a short ISO string.
 *
 * @param {Object} params - The input parameters.
 * @param {Date|string|number} params.date - The date to format.
 * @returns {string} "TODAY" if the date is today, otherwise the formatted date string.
 *
 * @throws {Error} If the provided date cannot be parsed.
 */
export function getFoodDiaryDateText({ date }) {
  const dateText = getDateShortStringFormat(date);

  return dateText === getDateShortStringFormat(new Date()) ? "TODAY" : dateText;
}

// HELPERS

/**
 * Returns the short month name (3-letter abbreviation) for a given month index.
 *
 * @param {number} month - The month index (0 = January, 11 = December).
 * @returns {string} The abbreviated month name (e.g., "Jan", "Feb").
 *
 */
function getMonthShortName(month) {
  switch (month) {
    case 0:
      return "Jan";
    case 1:
      return "Feb";
    case 2:
      return "Mar";
    case 3:
      return "Apr";
    case 4:
      return "May";
    case 5:
      return "Jun";
    case 6:
      return "Jul";
    case 7:
      return "Aug";
    case 8:
      return "Sep";
    case 9:
      return "Oct";
    case 10:
      return "Nov";
    case 11:
      return "Dec";
  }
}
