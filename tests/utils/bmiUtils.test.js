import {
  getBMI,
  getBMR,
  getMacroGramm,
  getCalorieNeeds,
  getLossOrGainPlan,
  getOptimalWeightRange,
} from "../../utils/bmiUtils";
import {
  SEX,
  GOALS,
  MACROS,
  ACTIVITY_LEVEL,
} from "../../constants/commonConstants";
import * as DateUtils from "../../utils/dateUtils";

describe("BMI Utils", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  describe("[getOptimalWeightRange]", () => {
    test("returns optimal weight data for valid height", () => {
      const result = getOptimalWeightRange(180);

      expect(result).toEqual({
        optimalWeight: 70.5,
        optimalWeightRange: { min: 59.9, max: 81 },
      });
    });

    test("throws error when height is below minimum", () => {
      expect(() => getOptimalWeightRange(100)).toThrow(
        "Invalid parameter! Height must be greater than or equal to 140!",
      );
    });
  });

  describe("[getBMI]", () => {
    test("calculates BMI from string inputs and rounds to one decimal", () => {
      expect(getBMI("180", "75")).toEqual(23.1);
    });

    test("throws error when weight exceeds maximum", () => {
      expect(() => getBMI(180, 400)).toThrow(
        "Invalid parameter! Weight must be less than or equal to 300!",
      );
    });
  });

  describe("[getBMR]", () => {
    test("calculates male BMR using age from DateUtils", () => {
      const ageSpy = jest.spyOn(DateUtils, "getAge").mockReturnValue(30);

      const result = getBMR(SEX.MALE, "1995-06-15", 180, 75);

      expect(result).toEqual(1730);
      expect(ageSpy).toHaveBeenCalledWith(expect.any(Date));
    });

    test("calculates female BMR and rounds the result", () => {
      jest.spyOn(DateUtils, "getAge").mockReturnValue(28);

      const result = getBMR(SEX.FEMALE, new Date("1997-04-10"), 165, 62.5);

      // 10 * 62.5 + 6.25 * 165 - 5 * 28 - 161 = 1354.75 -> 1355 after rounding
      expect(result).toEqual(1355);
    });

    test("throws error when sex is missing", () => {
      expect(() => getBMR(undefined, "1995-06-15", 180, 75)).toThrow(
        "Missing required parameter: sex!",
      );
    });
  });

  describe("[getCalorieNeeds]", () => {
    test("returns calorie needs for not very active lifestyle", () => {
      expect(
        getCalorieNeeds(ACTIVITY_LEVEL.NOT_VERY_ACTIVE.title, 1723),
      ).toEqual(2068);
    });

    test("returns calorie needs for lightly active lifestyle", () => {
      expect(
        getCalorieNeeds(ACTIVITY_LEVEL.LIGHTLY_ACTIVE.title, 1800),
      ).toEqual(2475);
    });

    test("returns calorie needs for active lifestyle", () => {
      expect(getCalorieNeeds(ACTIVITY_LEVEL.ACTIVE.title, 2000)).toEqual(3100);
    });

    test("returns calorie needs for very active lifestyle", () => {
      expect(getCalorieNeeds(ACTIVITY_LEVEL.VERY_ACTIVE.title, 2000)).toEqual(
        3450,
      );
    });

    test("returns calorie needs for extra active lifestyle", () => {
      expect(getCalorieNeeds(ACTIVITY_LEVEL.EXTRA_ACTIVE.title, 2000)).toEqual(
        3800,
      );
    });

    test("throws error for invalid activity level", () => {
      expect(() => getCalorieNeeds("Super Active", 2000)).toThrow(
        "Invalid parameter: activityLevel!",
      );
    });

    test("validates minimum BMR value", () => {
      expect(() => getCalorieNeeds(ACTIVITY_LEVEL.ACTIVE.title, 499)).toThrow(
        "Invalid parameter! bmr must be greater than or equal to 500!",
      );
    });

    test("validates maximum BMR value", () => {
      expect(() => getCalorieNeeds(ACTIVITY_LEVEL.ACTIVE.title, 4501)).toThrow(
        "Invalid parameter! bmr must be less than or equal to 4500!",
      );
    });
  });

  describe("[getLossOrGainPlan]", () => {
    test("returns maintain plan when weight and calories are already balanced", () => {
      expect(getLossOrGainPlan(70, 70, 2200, 2200)).toEqual({
        plan: GOALS.MAINTAIN,
      });
    });

    test("returns loss plan with calculated goal date", () => {
      const today = new Date("2025-01-01T00:00:00.000Z");
      jest.useFakeTimers().setSystemTime(today);

      const result = getLossOrGainPlan(90, 80, 2000, 2500);

      expect(result.plan).toEqual(GOALS.LOOSE);
      expect(result.weeklyRate).toBeCloseTo(0.45, 2);
      expect(result.goalDate).toEqual("2025-06-04");
    });

    test("returns gain plan and mirrors weight gain logic", () => {
      const today = new Date("2025-01-01T00:00:00.000Z");
      jest.useFakeTimers().setSystemTime(today);

      const result = getLossOrGainPlan(60, 70, 2800, 2300);

      expect(result.plan).toEqual(GOALS.GAIN);
      expect(result.weeklyRate).toBeCloseTo(0.45, 2);
      expect(result.goalDate).toEqual("2025-06-04");
    });

    test("throws error when weight goal contradicts calorie goal", () => {
      expect(() => getLossOrGainPlan(70, 70, 2200, 2500)).toThrow(
        "Invalid parameter(s): The goal in weight does not correlate with the goal with calories!",
      );
    });
  });

  describe("[getMacroGramm]", () => {
    test("calculates fat grams using 9 kcal per gram", () => {
      expect(getMacroGramm(MACROS.FAT, 30, 2000)).toEqual(67);
    });

    test("calculates protein grams using 4 kcal per gram", () => {
      expect(getMacroGramm(MACROS.PROTEIN, 25, 2400)).toEqual(150);
    });

    test("validates percentage boundaries", () => {
      expect(() => getMacroGramm(MACROS.FAT, 2, 2000)).toThrow(
        "Invalid parameter! percentage must be greater than or equal to 5!",
      );
    });
  });
});
