import {
  validateRequiredParam,
  validateNumberParam,
  validateDateParam,
  validateAgeParam,
  validateBirthdayParam,
} from "../../utils/validationUtils";
import * as Validation from "../../constants/validationConstants";
import * as AgeUtils from "../../utils/ageUtils";

describe("Validation Utils", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("[validateRequiredParam]", () => {
    test("does not throw for a valid string value", () => {
      expect(() => validateRequiredParam("hello", "name")).not.toThrow();
    });

    test("does not throw for zero", () => {
      expect(() => validateRequiredParam(0, "count")).not.toThrow();
    });

    test("does not throw for an empty string", () => {
      expect(() => validateRequiredParam("", "field")).not.toThrow();
    });

    test("does not throw for false", () => {
      expect(() => validateRequiredParam(false, "flag")).not.toThrow();
    });

    test("throws error when value is null", () => {
      expect(() => validateRequiredParam(null, "param")).toThrow(
        "Missing required parameter: param!",
      );
    });

    test("throws error when value is undefined", () => {
      expect(() => validateRequiredParam(undefined, "param")).toThrow(
        "Missing required parameter: param!",
      );
    });
  });

  describe("[validateNumberParam]", () => {
    test("parses and returns a valid integer from number input", () => {
      expect(validateNumberParam(42, "value")).toEqual(42);
    });

    test("parses and returns a valid float from string input", () => {
      expect(validateNumberParam("3.14", "value")).toEqual(3.14);
    });

    test("parses as integer when isInt is true", () => {
      expect(
        validateNumberParam("3.99", "value", undefined, undefined, true),
      ).toEqual(3);
    });

    test("parses as float by default", () => {
      expect(validateNumberParam("3.99", "value")).toEqual(3.99);
    });

    test("returns parsed number when within min and max bounds", () => {
      expect(validateNumberParam(50, "value", 0, 100)).toEqual(50);
    });

    test("returns parsed number when equal to min", () => {
      expect(validateNumberParam(0, "value", 0, 100)).toEqual(0);
    });

    test("returns parsed number when equal to max", () => {
      expect(validateNumberParam(100, "value", 0, 100)).toEqual(100);
    });

    test("throws error when value is null", () => {
      expect(() => validateNumberParam(null, "value")).toThrow(
        "Missing required parameter: value!",
      );
    });

    test("throws error when value is undefined", () => {
      expect(() => validateNumberParam(undefined, "value")).toThrow(
        "Missing required parameter: value!",
      );
    });

    test("throws error when value is not a number", () => {
      expect(() => validateNumberParam("abc", "value")).toThrow(
        "Invalid parameter! value must be a number!",
      );
    });

    test("throws error with whole number message when isInt is true and value is not a number", () => {
      expect(() =>
        validateNumberParam("abc", "value", undefined, undefined, true),
      ).toThrow("Invalid parameter! value must be a whole number!");
    });

    test("throws error when value is below min", () => {
      expect(() => validateNumberParam(5, "value", 10, 100)).toThrow(
        "Invalid parameter! value must be greater than or equal to 10!",
      );
    });

    test("throws error when value exceeds max", () => {
      expect(() => validateNumberParam(150, "value", 0, 100)).toThrow(
        "Invalid parameter! value must be less than or equal to 100!",
      );
    });

    test("does not enforce min when min is undefined", () => {
      expect(validateNumberParam(-100, "value", undefined, 100)).toEqual(-100);
    });

    test("does not enforce max when max is undefined", () => {
      expect(validateNumberParam(9999, "value", 0, undefined)).toEqual(9999);
    });

    test("does not enforce min when min is null", () => {
      expect(validateNumberParam(-100, "value", null, 100)).toEqual(-100);
    });

    test("does not enforce max when max is null", () => {
      expect(validateNumberParam(9999, "value", 0, null)).toEqual(9999);
    });
  });

  describe("[validateDateParam]", () => {
    test("returns parsed Date for a valid date string", () => {
      const result = validateDateParam("2023-10-15", "registerDate");

      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toEqual(2023);
    });

    test("returns parsed Date for a Date object", () => {
      const date = new Date("2025-01-01");
      const result = validateDateParam(date, "registerDate");

      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toEqual(2025);
    });

    test("throws error when value is null", () => {
      expect(() => validateDateParam(null, "registerDate")).toThrow(
        "Missing required parameter: registerDate!",
      );
    });

    test("throws error when value is undefined", () => {
      expect(() => validateDateParam(undefined, "registerDate")).toThrow(
        "Missing required parameter: registerDate!",
      );
    });

    test("throws error for an invalid date string", () => {
      expect(() => validateDateParam("invalid-date", "registerDate")).toThrow(
        "Invalid parameter! registerDate must be a date or datestring!",
      );
    });

    test("throws error for an empty string", () => {
      expect(() => validateDateParam("", "registerDate")).toThrow(
        "Invalid parameter! registerDate must be a date or datestring!",
      );
    });
  });

  describe("[validateAgeParam]", () => {
    test("returns parsed age for a valid age within bounds", () => {
      expect(validateAgeParam(25)).toEqual(25);
    });

    test("returns parsed age at minimum boundary", () => {
      expect(validateAgeParam(Validation.MIN_AGE)).toEqual(Validation.MIN_AGE);
    });

    test("returns parsed age at maximum boundary", () => {
      expect(validateAgeParam(Validation.MAX_AGE)).toEqual(Validation.MAX_AGE);
    });

    test("parses string input as integer", () => {
      expect(validateAgeParam("30")).toEqual(30);
    });

    test("throws error when age is below minimum", () => {
      expect(() => validateAgeParam(Validation.MIN_AGE - 1)).toThrow(
        `Invalid parameter! Age must be greater than or equal to ${Validation.MIN_AGE}!`,
      );
    });

    test("throws error when age exceeds maximum", () => {
      expect(() => validateAgeParam(Validation.MAX_AGE + 1)).toThrow(
        `Invalid parameter! Age must be less than or equal to ${Validation.MAX_AGE}!`,
      );
    });

    test("throws error when age is null", () => {
      expect(() => validateAgeParam(null)).toThrow(
        "Missing required parameter: Age!",
      );
    });

    test("throws error when age is not a number", () => {
      expect(() => validateAgeParam("abc")).toThrow(
        "Invalid parameter! Age must be a whole number!",
      );
    });
  });

  describe("[validateBirthdayParam]", () => {
    test("returns parsed Date for a valid birthday within age bounds", () => {
      jest.spyOn(AgeUtils, "calculateAge").mockReturnValue(30);

      const result = validateBirthdayParam("1995-06-15", "birthday");

      expect(result).toBeInstanceOf(Date);
    });

    test("throws error when birthday is null", () => {
      expect(() => validateBirthdayParam(null, "birthday")).toThrow(
        "Missing required parameter: birthday!",
      );
    });

    test("throws error when birthday is an invalid date string", () => {
      expect(() => validateBirthdayParam("not-a-date", "birthday")).toThrow(
        "Invalid parameter! birthday must be a date or datestring!",
      );
    });

    test("throws error when resulting age is below minimum", () => {
      jest
        .spyOn(AgeUtils, "calculateAge")
        .mockReturnValue(Validation.MIN_AGE - 1);

      expect(() => validateBirthdayParam("2020-01-01", "birthday")).toThrow(
        `Invalid parameter! Age must be greater than or equal to ${Validation.MIN_AGE}!`,
      );
    });

    test("throws error when resulting age exceeds maximum", () => {
      jest
        .spyOn(AgeUtils, "calculateAge")
        .mockReturnValue(Validation.MAX_AGE + 1);

      expect(() => validateBirthdayParam("1900-01-01", "birthday")).toThrow(
        `Invalid parameter! Age must be less than or equal to ${Validation.MAX_AGE}!`,
      );
    });

    test("accepts Date object input", () => {
      jest.spyOn(AgeUtils, "calculateAge").mockReturnValue(25);

      const date = new Date("2000-05-20");
      const result = validateBirthdayParam(date, "birthday");

      expect(result).toBeInstanceOf(Date);
    });
  });
});
