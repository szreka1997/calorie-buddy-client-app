import { calculateAge } from "./ageUtils";
import * as Validation from "../constants/validationConstants";

/**
 * Validates that a required parameter is provided.
 *
 * @param {*} value - The value to check.
 * @param {string} name - The name of the parameter (used in error messages).
 *
 * @throws {Error} If the value is missing, null, undefined, or falsy.
 */
export function validateRequiredParam(value, name) {
  if (value === null || value === undefined) {
    throw new Error(`Missing required parameter: ${name}!`);
  }
}

/**
 * Validates and parses a numeric parameter.
 *
 * @param {string|number} value - The value to validate and parse.
 * @param {string} name - The parameter name (used in error messages).
 * @param {number} [min] - Optional minimum value (inclusive).
 * @param {number} [max] - Optional maximum value (inclusive).
 * @param {boolean} [isInt=false] - Whether the value must be parsed as an integer.
 * @returns {number} The validated and parsed number.
 *
 * @throws {Error} If the parameter is missing or undefined.
 * @throws {Error} If the parameter is not a number (or whole number when `isInt = true`).
 * @throws {Error} If the parameter is below `min`.
 * @throws {Error} If the parameter is above `max`.
 */
export function validateNumberParam(
  value,
  name,
  min = undefined,
  max = undefined,
  isInt = false,
) {
  validateRequiredParam(value, name);

  const parsed = isInt ? parseInt(value) : parseFloat(value);
  if (isNaN(parsed)) {
    throw new Error(
      `Invalid parameter! ${name} must be a ${isInt ? "whole " : ""}number!`,
    );
  }

  if (min !== null && min !== undefined && parsed < min) {
    throw new Error(
      `Invalid parameter! ${name} must be greater than or equal to ${min}!`,
    );
  }

  if (max !== null && max !== undefined && parsed > max) {
    throw new Error(
      `Invalid parameter! ${name} must be less than or equal to ${max}!`,
    );
  }

  return parsed;
}

/**
 * Validates that a parameter is a valid date or date string.
 *
 * @param {Date|string} value - The value to validate (Date object or valid date string).
 * @param {string} name - The parameter name (used in error messages).
 *
 * @throws {Error} If the parameter is missing or not a valid date.
 *
 * @example
 * validateDateParam("2023-10-15", "startDate"); // ✅ no error
 * validateDateParam(new Date(), "createdAt");   // ✅ no error
 * validateDateParam("invalid-date", "startDate"); // ❌ throws error
 */
export function validateDateParam(value, name) {
  validateRequiredParam(value, name);

  const parsedDate = new Date(value);
  if (!parsedDate.getDate()) {
    throw new Error(`Invalid parameter! ${name} must be a date or datestring!`);
  }

  return parsedDate;
}

/**
 * Validates an age parameter.
 *
 * Ensures that the provided age is a whole number within the allowed range.
 *
 * @param {number|string} age - The age value to validate.
 * @returns {number} - The validated age.
 * @throws Will throw an error if the age is not a number, cannot parse to a number, or out of bounds.
 */
export function validateAgeParam(age) {
  return validateNumberParam(
    age,
    "Age",
    Validation.MIN_AGE,
    Validation.MAX_AGE,
    true,
  );
}

/**
 * Validates a birthday parameter and ensures the person meets age constraints.
 *
 * @param {string|Date} value - The birthday value to validate. Can be a Date object or date string.
 * @param {string} name - The name of the parameter (used in error messages).
 * @throws Will throw an error if the value is missing, invalid, or results in an age outside the allowed range.
 * @returns {Date} The parsed Date object representing the birthday.
 */
export function validateBirthdayParam(value, name) {
  const parsedDate = validateDateParam(value, name);
  const age = calculateAge(parsedDate);
  validateAgeParam(age);

  return parsedDate;
}
