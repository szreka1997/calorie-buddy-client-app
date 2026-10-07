import * as DateUtils from "./dateUtils";
import * as ValidationUtils from "./validationUtils";

/**
 * Creates configuration for a numeric input field with validation rules.
 *
 * @param {string} name
 * @param {string} label
 * @param {string} placeholderText
 * @param {number} [min=0]
 * @param {number} [max=100]
 * @param {boolean} [isInt=false]
 * @param {Function|null} [validate=null]
 * @returns {Object}
 */
export function createNumericField(
  name,
  label,
  placeholderText,
  min = 0,
  max = 100,
  isInt = false,
  validate = null,
) {
  ValidationUtils.validateRequiredParam(name, "name");
  ValidationUtils.validateRequiredParam(label, "label");
  ValidationUtils.validateRequiredParam(placeholderText, "placeholderText");
  const parsedMin = ValidationUtils.validateNumberParam(
    min,
    "min",
    null,
    null,
    isInt,
  );
  const parsedMax = ValidationUtils.validateNumberParam(
    max,
    "max",
    null,
    null,
    isInt,
  );
  return {
    name,
    label,
    placeholderText,
    rules: {
      required: `${label} is required!`,
      pattern: {
        value: isInt ? /^\d+$/ : /^\d*(\.\d+)?$/,
        message: `${label} must be a positive ${isInt ? "whole " : ""}number`,
      },
      min: {
        value: parsedMin,
        message: `${label} must be greater than or equal to ${min}!`,
      },
      max: {
        value: parsedMax,
        message: `${label} must be less than or equal to ${max}!`,
      },
      validate: validate
        ? validate
        : (value) => {
            if (isInt && isNaN(parseInt(value))) {
              return "You have to enter a positive whole number!";
            }
            if (!isInt && isNaN(parseFloat(value))) {
              return "You have to enter a positive number!";
            }
          },
    },
  };
}

/**
 * Creates configuration for a text input field with length validation.
 *
 * @param {string} name
 * @param {string} label
 * @param {string} placeholderText
 * @param {number} [minLength=3]
 * @param {number} [maxLength=50]
 * @returns {Object}
 */
export function createStringFields(
  name,
  label,
  placeholderText,
  minLength = 3,
  maxLength = 50,
) {
  return {
    name,
    label,
    placeholderText,
    rules: {
      required: `${label} is required!`,
      minLength: {
        value: minLength,
        message: `${label} must be at least ${minLength} character long!`,
      },
      maxLength: {
        value: maxLength,
        message: `${label} must be maximum ${maxLength} character long!`,
      },
    },
  };
}

/**
 * Creates configuration for a radio input field.
 *
 * @param {string} name
 * @param {string} label
 * @param {string} placeholderText
 * @param {Array} options
 * @returns {Object}
 */
export function createRadioFields(name, label, placeholderText, options) {
  return {
    name,
    label,
    placeholderText,
    rules: {
      required: `${label} is required!`,
    },
    radioConfig: {
      options,
    },
  };
}

/**
 * Determines display text for a date input field.
 *
 * @param {string} placeholderText
 * @param {Date} [defaultValue]
 * @param {Date} [value]
 * @param {boolean} [isTouched=false]
 * @returns {string}
 */
export function getDisplayTextForHorizontalDateInput(
  placeholderText,
  defaultValue = undefined,
  value = undefined,
  isTouched = false,
) {
  return defaultValue
    ? DateUtils.getDateStringFormat(defaultValue)
    : isTouched
      ? DateUtils.getDateStringFormat(value)
      : placeholderText;
}
