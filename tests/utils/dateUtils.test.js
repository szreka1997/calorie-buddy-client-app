import * as ValidationUtils from "../../utils/validationUtils";
import { calculateAge } from "../../utils/ageUtils";
import {
  getAge,
  getDateStringFormat,
  getDateShortStringFormat,
  getDateLabelName,
  getNeighbourDate,
  getFoodDiaryDateText,
} from "../../utils/dateUtils";

jest.mock("../../utils/validationUtils");
jest.mock("../../utils/ageUtils");

describe("Date Utils", () => {
  beforeEach(() => {
    ValidationUtils.validateDateParam.mockImplementation(
      (value) => new Date(value),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe("[getAge]", () => {
    test("validates and calculates age", () => {
      const birthday = "1990-05-20";
      const parsedDate = new Date(birthday);

      calculateAge.mockReturnValue(34);

      const result = getAge(birthday);

      expect(result).toEqual(34);
      expect(ValidationUtils.validateDateParam).toHaveBeenCalledWith(
        birthday,
        "birthday",
      );
      expect(calculateAge).toHaveBeenCalledWith(parsedDate);
      expect(ValidationUtils.validateAgeParam).toHaveBeenCalledWith(
        34,
        "birthday",
      );
    });
  });

  describe("[getDateStringFormat]", () => {
    test.each([
      [0, "Jan"],
      [1, "Feb"],
      [2, "Mar"],
      [3, "Apr"],
      [4, "May"],
      [5, "Jun"],
      [6, "Jul"],
      [7, "Aug"],
      [8, "Sep"],
      [9, "Oct"],
      [10, "Nov"],
      [11, "Dec"],
    ])("formats month index %i to %s", (monthIndex, expectedMonth) => {
      const day = 15;
      const incomingDate = `2025-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      expect(getDateStringFormat(incomingDate)).toEqual(
        `${expectedMonth} ${day}, 2025`,
      );
      expect(ValidationUtils.validateDateParam).toHaveBeenCalledWith(
        incomingDate,
        "date",
      );
    });
  });

  describe("[getDateShortStringFormat]", () => {
    test("returns locale short string from validated date", () => {
      const incomingDate = "2025-04-15T00:00:00.000Z";
      expect(getDateShortStringFormat(incomingDate)).toEqual("2025-04-15");
      expect(ValidationUtils.validateDateParam).toHaveBeenCalledWith(
        incomingDate,
        "date",
      );
    });

    test("returns next day when time greater or equal 23:00", () => {
      const incomingDate = "2025-04-15T23:00:00Z";

      expect(getDateShortStringFormat(incomingDate)).toEqual("2025-04-16");
      expect(ValidationUtils.validateDateParam).toHaveBeenCalledWith(
        incomingDate,
        "date",
      );
    });
  });

  describe("[getDateLabelName]", () => {
    test("converts date into local label", () => {
      expect(getDateLabelName("2025-12-31")).toEqual("12.31.");
    });
  });

  describe("[getNeighbourDate]", () => {
    const baseDate = new Date("2025-05-01T00:00:00Z");

    test.each([
      [0, "2025-05-01T00:00:00.000Z"],
      [1, "2025-05-02T00:00:00.000Z"],
      [5, "2025-05-06T00:00:00.000Z"],
      [122, "2025-08-31T00:00:00.000Z"],
      [365, "2026-05-01T00:00:00.000Z"],
      [-1, "2025-04-30T00:00:00.000Z"],
      [-5, "2025-04-26T00:00:00.000Z"],
      [-120, "2025-01-01T00:00:00.000Z"],
      [-365, "2024-05-01T00:00:00.000Z"],
    ])("returns new date shifted by %s days", (offset, resultDate) => {
      const result = getNeighbourDate({ prevDate: baseDate, offset });

      expect(result.toISOString()).toEqual(resultDate);
    });
  });

  describe("[getFoodDiaryDateText]", () => {
    test("returns TODAY when date matches current date", () => {
      const today = new Date("2025-01-02T10:00:00Z");
      jest.useFakeTimers().setSystemTime(today);

      expect(getFoodDiaryDateText({ date: today })).toEqual("TODAY");
    });

    test("returns ISO short string when date is not today", () => {
      expect(getFoodDiaryDateText({ date: "2025-01-03" })).toEqual(
        "2025-01-03",
      );
    });
  });
});
