import {
  createNumericField,
  createStringFields,
  createRadioFields,
  getDisplayTextForHorizontalDateInput,
} from "../../utils/formUtils";
import * as DateUtils from "../../utils/dateUtils";

describe("Form Utils", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("[createNumericField]", () => {
    test("returns field config with default min, max, and float pattern", () => {
      const result = createNumericField("weight", "Weight", "Enter weight");

      expect(result.name).toEqual("weight");
      expect(result.label).toEqual("Weight");
      expect(result.placeholderText).toEqual("Enter weight");
      expect(result.rules.required).toEqual("Weight is required!");
      expect(result.rules.pattern.value).toEqual(/^\d*(\.\d+)?$/);
      expect(result.rules.pattern.message).toEqual(
        "Weight must be a positive number",
      );
      expect(result.rules.min).toEqual({
        value: 0,
        message: "Weight must be greater than or equal to 0!",
      });
      expect(result.rules.max).toEqual({
        value: 100,
        message: "Weight must be less than or equal to 100!",
      });
    });

    test("uses integer pattern when isInt is true", () => {
      const result = createNumericField(
        "age",
        "Age",
        "Enter age",
        1,
        120,
        true,
      );

      expect(result.rules.pattern.value).toEqual(/^\d+$/);
      expect(result.rules.pattern.message).toEqual(
        "Age must be a positive whole number",
      );
    });

    test("applies custom min and max values", () => {
      const result = createNumericField(
        "calories",
        "Calories",
        "Enter calories",
        500,
        5000,
      );

      expect(result.rules.min).toEqual({
        value: 500,
        message: "Calories must be greater than or equal to 500!",
      });
      expect(result.rules.max).toEqual({
        value: 5000,
        message: "Calories must be less than or equal to 5000!",
      });
    });

    test("uses custom validate function when provided", () => {
      const customValidate = jest.fn().mockReturnValue(true);
      const result = createNumericField(
        "weight",
        "Weight",
        "Enter weight",
        0,
        300,
        false,
        customValidate,
      );

      expect(result.rules.validate).toEqual(customValidate);
    });

    test("default validate returns error for non-integer when isInt is true", () => {
      const result = createNumericField(
        "age",
        "Age",
        "Enter age",
        0,
        120,
        true,
      );

      expect(result.rules.validate("abc")).toEqual(
        "You have to enter a positive whole number!",
      );
    });

    test("default validate returns error for non-number when isInt is false", () => {
      const result = createNumericField("weight", "Weight", "Enter weight");

      expect(result.rules.validate("abc")).toEqual(
        "You have to enter a positive number!",
      );
    });

    test("default validate returns undefined for valid integer input", () => {
      const result = createNumericField(
        "age",
        "Age",
        "Enter age",
        0,
        120,
        true,
      );

      expect(result.rules.validate("25")).toBeUndefined();
    });

    test("default validate returns undefined for valid float input", () => {
      const result = createNumericField("weight", "Weight", "Enter weight");

      expect(result.rules.validate("72.5")).toBeUndefined();
    });

    test("throws error when name is missing", () => {
      expect(() =>
        createNumericField(undefined, "Weight", "Enter weight"),
      ).toThrow("Missing required parameter: name!");
    });

    test("throws error when label is missing", () => {
      expect(() =>
        createNumericField("weight", undefined, "Enter weight"),
      ).toThrow("Missing required parameter: label!");
    });

    test("throws error when placeholderText is missing", () => {
      expect(() => createNumericField("weight", "Weight", undefined)).toThrow(
        "Missing required parameter: placeholderText!",
      );
    });
  });

  describe("[createStringFields]", () => {
    test("returns field config with default minLength and maxLength", () => {
      const result = createStringFields("name", "Name", "Enter name");

      expect(result.name).toEqual("name");
      expect(result.label).toEqual("Name");
      expect(result.placeholderText).toEqual("Enter name");
      expect(result.rules.required).toEqual("Name is required!");
      expect(result.rules.minLength).toEqual({
        value: 3,
        message: "Name must be at least 3 character long!",
      });
      expect(result.rules.maxLength).toEqual({
        value: 50,
        message: "Name must be maximum 50 character long!",
      });
    });

    test("applies custom minLength and maxLength values", () => {
      const result = createStringFields(
        "description",
        "Description",
        "Enter description",
        5,
        200,
      );

      expect(result.rules.minLength).toEqual({
        value: 5,
        message: "Description must be at least 5 character long!",
      });
      expect(result.rules.maxLength).toEqual({
        value: 200,
        message: "Description must be maximum 200 character long!",
      });
    });
  });

  describe("[createRadioFields]", () => {
    test("returns field config with radio options", () => {
      const options = [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
      ];
      const result = createRadioFields("sex", "Sex", "Select sex", options);

      expect(result.name).toEqual("sex");
      expect(result.label).toEqual("Sex");
      expect(result.placeholderText).toEqual("Select sex");
      expect(result.rules.required).toEqual("Sex is required!");
      expect(result.radioConfig).toEqual({ options });
    });

    test("returns empty options array when no options provided", () => {
      const result = createRadioFields(
        "activity",
        "Activity",
        "Select activity",
        [],
      );

      expect(result.radioConfig.options).toEqual([]);
    });
  });

  describe("[getDisplayTextForHorizontalDateInput]", () => {
    test("returns formatted defaultValue when defaultValue is provided", () => {
      const defaultDate = new Date("2025-06-15");
      jest
        .spyOn(DateUtils, "getDateStringFormat")
        .mockReturnValue("Jun 15, 2025");

      const result = getDisplayTextForHorizontalDateInput(
        "Select date",
        defaultDate,
      );

      expect(result).toEqual("Jun 15, 2025");
      expect(DateUtils.getDateStringFormat).toHaveBeenCalledWith(defaultDate);
    });

    test("returns formatted value when isTouched is true and no defaultValue", () => {
      const valueDate = new Date("2025-03-20");
      jest
        .spyOn(DateUtils, "getDateStringFormat")
        .mockReturnValue("Mar 20, 2025");

      const result = getDisplayTextForHorizontalDateInput(
        "Select date",
        undefined,
        valueDate,
        true,
      );

      expect(result).toEqual("Mar 20, 2025");
      expect(DateUtils.getDateStringFormat).toHaveBeenCalledWith(valueDate);
    });

    test("returns placeholderText when no defaultValue and not touched", () => {
      const result = getDisplayTextForHorizontalDateInput(
        "Select date",
        undefined,
        undefined,
        false,
      );

      expect(result).toEqual("Select date");
    });

    test("prioritizes defaultValue over isTouched and value", () => {
      const defaultDate = new Date("2025-01-01");
      const valueDate = new Date("2025-12-31");
      jest
        .spyOn(DateUtils, "getDateStringFormat")
        .mockReturnValue("Jan 1, 2025");

      const result = getDisplayTextForHorizontalDateInput(
        "Select date",
        defaultDate,
        valueDate,
        true,
      );

      expect(result).toEqual("Jan 1, 2025");
      expect(DateUtils.getDateStringFormat).toHaveBeenCalledWith(defaultDate);
    });
  });
});
