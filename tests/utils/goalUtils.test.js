import { SEX, GOALS, ACTIVITY_LEVEL } from "../../constants/commonConstants";
import {
  getBasicInformationFormFieldsConfig,
  getCalorieNecessityFormFieldsConfig,
  getGoalSettingFormFieldsConfig,
  getNutritionGoalsFormFieldsConfig,
  calculateProgressChartData,
  calculateTotalLost,
  getProgressTotalGoalLabelName,
  calculateProgressRemaining,
  getOptimalWeightMessage,
  getCalorieNecessityMessage,
  getGoalPlanMessage,
  getMacrosMessage,
  buildDeficitMessages,
  getWeightProggressChartData,
} from "../../utils/goalUtils";
import * as BmiUtils from "../../utils/bmiUtils";
import * as DateUtils from "../../utils/dateUtils";
import * as Validation from "../../constants/validationConstants";

describe("Goal Utils", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetAllMocks();
    jest.useRealTimers();
  });

  describe("[getBasicInformationFormFieldsConfig]", () => {
    test("returns object with usernameConfig, sexConfig, birthdayConfig, and heightConfig", () => {
      const result = getBasicInformationFormFieldsConfig();

      expect(result.usernameConfig).toBeDefined();
      expect(result.sexConfig).toBeDefined();
      expect(result.birthdayConfig).toBeDefined();
      expect(result.heightConfig).toBeDefined();
    });

    test("usernameConfig has correct name and label", () => {
      const result = getBasicInformationFormFieldsConfig();

      expect(result.usernameConfig.name).toEqual("username");
      expect(result.usernameConfig.label).toEqual("Username");
      expect(result.usernameConfig.placeholderText).toEqual("Enter username");
    });

    test("sexConfig has correct radio options for Male and Female", () => {
      const result = getBasicInformationFormFieldsConfig();

      expect(result.sexConfig.name).toEqual("sex");
      expect(result.sexConfig.label).toEqual("Sex");
      expect(result.sexConfig.radioConfig.options).toEqual([
        { label: SEX.MALE, value: SEX.MALE },
        { label: SEX.FEMALE, value: SEX.FEMALE },
      ]);
    });

    test("birthdayConfig has correct name, label, and required rule", () => {
      const result = getBasicInformationFormFieldsConfig();

      expect(result.birthdayConfig.name).toEqual("birthday");
      expect(result.birthdayConfig.label).toEqual("Birthday");
      expect(result.birthdayConfig.placeholderText).toEqual("Set birthday");
      expect(result.birthdayConfig.rules.required).toEqual(
        "Birthday is required!",
      );
    });

    test("birthdayConfig validate returns undefined for valid birthday", () => {
      const result = getBasicInformationFormFieldsConfig();
      const validBirthday = new Date("1995-06-15");

      expect(
        result.birthdayConfig.rules.validate(validBirthday),
      ).toBeUndefined();
    });

    test("birthdayConfig validate returns error message for invalid birthday", () => {
      const result = getBasicInformationFormFieldsConfig();
      const tooYoungBirthday = new Date();

      const validationResult =
        result.birthdayConfig.rules.validate(tooYoungBirthday);

      expect(validationResult).toBeDefined();
    });

    test("heightConfig has correct name and validation bounds", () => {
      const result = getBasicInformationFormFieldsConfig();

      expect(result.heightConfig.name).toEqual("height");
      expect(result.heightConfig.label).toEqual("Height (cm)");
      expect(result.heightConfig.rules.min.value).toEqual(
        Validation.MIN_HEIGHT,
      );
      expect(result.heightConfig.rules.max.value).toEqual(
        Validation.MAX_HEIGHT,
      );
    });
  });

  describe("[getCalorieNecessityFormFieldsConfig]", () => {
    test("returns object with startingWeightConfig and activityLevelConfig", () => {
      const result = getCalorieNecessityFormFieldsConfig();

      expect(result.startingWeightConfig).toBeDefined();
      expect(result.activityLevelConfig).toBeDefined();
    });

    test("startingWeightConfig has correct name and validation bounds", () => {
      const result = getCalorieNecessityFormFieldsConfig();

      expect(result.startingWeightConfig.name).toEqual("startingWeight");
      expect(result.startingWeightConfig.label).toEqual("Starting Weight (kg)");
      expect(result.startingWeightConfig.rules.min.value).toEqual(
        Validation.MIN_WEIGHT,
      );
      expect(result.startingWeightConfig.rules.max.value).toEqual(
        Validation.MAX_WEIGHT,
      );
    });

    test("activityLevelConfig has all 5 activity level options", () => {
      const result = getCalorieNecessityFormFieldsConfig();
      const options = result.activityLevelConfig.radioConfig.options;

      expect(options).toHaveLength(5);
      expect(options.map((o) => o.value)).toEqual([
        ACTIVITY_LEVEL.NOT_VERY_ACTIVE.title,
        ACTIVITY_LEVEL.LIGHTLY_ACTIVE.title,
        ACTIVITY_LEVEL.ACTIVE.title,
        ACTIVITY_LEVEL.VERY_ACTIVE.title,
        ACTIVITY_LEVEL.EXTRA_ACTIVE.title,
      ]);
    });

    test("activityLevelConfig options include details", () => {
      const result = getCalorieNecessityFormFieldsConfig();
      const options = result.activityLevelConfig.radioConfig.options;

      expect(options[0].details).toEqual(
        ACTIVITY_LEVEL.NOT_VERY_ACTIVE.details,
      );
      expect(options[4].details).toEqual(ACTIVITY_LEVEL.EXTRA_ACTIVE.details);
    });
  });

  describe("[getGoalSettingFormFieldsConfig]", () => {
    test("returns array with goalWeight and goalCalories fields", () => {
      const getValues = jest.fn().mockReturnValue({});
      const result = getGoalSettingFormFieldsConfig(getValues);

      expect(Array.isArray(result)).toBeTruthy();
      expect(result).toHaveLength(2);
      expect(result[0].name).toEqual("goalWeight");
      expect(result[1].name).toEqual("goalCalories");
    });

    test("goalWeight field has correct validation bounds", () => {
      const getValues = jest.fn().mockReturnValue({});
      const result = getGoalSettingFormFieldsConfig(getValues);

      expect(result[0].rules.min.value).toEqual(Validation.MIN_WEIGHT);
      expect(result[0].rules.max.value).toEqual(Validation.MAX_WEIGHT);
    });

    test("goalCalories field has correct validation bounds", () => {
      const getValues = jest.fn().mockReturnValue({});
      const result = getGoalSettingFormFieldsConfig(getValues);

      expect(result[1].rules.min.value).toEqual(Validation.MIN_GOAL_CALORIES);
      expect(result[1].rules.max.value).toEqual(Validation.MAX_GOAL_CALORIES);
    });

    test("goalCalories validate returns error when goalCalories is empty", () => {
      const getValues = jest.fn().mockReturnValue({
        sex: SEX.MALE,
        birthday: "1995-06-15",
        height: 180,
        startingWeight: "80",
        activityLevel: ACTIVITY_LEVEL.ACTIVE.title,
        goalWeight: "70",
      });
      const result = getGoalSettingFormFieldsConfig(getValues);

      expect(result[1].rules.validate("")).toEqual(
        "Goal calories is required!",
      );
    });

    test("goalCalories validate returns error when gaining weight but calories too low", () => {
      jest.spyOn(BmiUtils, "getBMR").mockReturnValue(1730);
      jest.spyOn(BmiUtils, "getCalorieNeeds").mockReturnValue(2680);

      const getValues = jest.fn().mockReturnValue({
        sex: SEX.MALE,
        birthday: "1995-06-15",
        height: 180,
        startingWeight: "70",
        activityLevel: ACTIVITY_LEVEL.ACTIVE.title,
        goalWeight: "80",
      });
      const result = getGoalSettingFormFieldsConfig(getValues);

      expect(result[1].rules.validate("2500")).toEqual(
        "You have to consume more calories based on your goal weight!",
      );
    });

    test("goalCalories validate returns error when gaining weight but calories too high", () => {
      jest.spyOn(BmiUtils, "getBMR").mockReturnValue(1730);
      jest.spyOn(BmiUtils, "getCalorieNeeds").mockReturnValue(2680);

      const getValues = jest.fn().mockReturnValue({
        sex: SEX.MALE,
        birthday: "1995-06-15",
        height: 180,
        startingWeight: "70",
        activityLevel: ACTIVITY_LEVEL.ACTIVE.title,
        goalWeight: "80",
      });
      const result = getGoalSettingFormFieldsConfig(getValues);

      expect(result[1].rules.validate("3200")).toEqual(
        "You have to consume less, because this way you will gain to much fat!",
      );
    });

    test("goalCalories validate returns error when losing weight but calories too high", () => {
      jest.spyOn(BmiUtils, "getBMR").mockReturnValue(1730);
      jest.spyOn(BmiUtils, "getCalorieNeeds").mockReturnValue(2680);

      const getValues = jest.fn().mockReturnValue({
        sex: SEX.MALE,
        birthday: "1995-06-15",
        height: 180,
        startingWeight: "90",
        activityLevel: ACTIVITY_LEVEL.ACTIVE.title,
        goalWeight: "80",
      });
      const result = getGoalSettingFormFieldsConfig(getValues);

      expect(result[1].rules.validate("2700")).toEqual(
        "You have to consume less calories based on your goal weight!",
      );
    });

    test("goalCalories validate returns error when losing weight but calories too low", () => {
      jest.spyOn(BmiUtils, "getBMR").mockReturnValue(1730);
      jest.spyOn(BmiUtils, "getCalorieNeeds").mockReturnValue(2680);

      const getValues = jest.fn().mockReturnValue({
        sex: SEX.MALE,
        birthday: "1995-06-15",
        height: 180,
        startingWeight: "90",
        activityLevel: ACTIVITY_LEVEL.ACTIVE.title,
        goalWeight: "80",
      });
      const result = getGoalSettingFormFieldsConfig(getValues);

      expect(result[1].rules.validate("2100")).toEqual(
        "You have to consume more for a healthy lifestyle!",
      );
    });

    test("goalCalories validate returns error when maintaining weight but calories differ", () => {
      jest.spyOn(BmiUtils, "getBMR").mockReturnValue(1730);
      jest.spyOn(BmiUtils, "getCalorieNeeds").mockReturnValue(2680);

      const getValues = jest.fn().mockReturnValue({
        sex: SEX.MALE,
        birthday: "1995-06-15",
        height: 180,
        startingWeight: "80",
        activityLevel: ACTIVITY_LEVEL.ACTIVE.title,
        goalWeight: "80",
      });
      const result = getGoalSettingFormFieldsConfig(getValues);

      expect(result[1].rules.validate("2500")).toEqual(
        "You have to consume exactly the same amount as your calorie need based on your goal!",
      );
    });

    test("goalCalories validate returns error when getBMR throws", () => {
      jest.spyOn(BmiUtils, "getBMR").mockImplementation(() => {
        throw new Error("Invalid parameter! error");
      });

      const getValues = jest.fn().mockReturnValue({
        sex: SEX.MALE,
        birthday: "1995-06-15",
        height: "300",
        startingWeight: "80",
        activityLevel: ACTIVITY_LEVEL.ACTIVE.title,
        goalWeight: "80",
      });
      const result = getGoalSettingFormFieldsConfig(getValues);

      expect(result[1].rules.validate("2500")).toEqual("error");
    });

    test("goalCalories validate returns undefined when not all fields are filled in", () => {
      const getValues = jest.fn().mockReturnValue({
        sex: SEX.MALE,
        birthday: "1995-06-15",
        height: 180,
        startingWeight: "",
        activityLevel: "",
        goalWeight: "",
      });
      const result = getGoalSettingFormFieldsConfig(getValues);

      expect(result[1].rules.validate("2500")).toBeUndefined();
    });

    test("goalCalories validate returns undefined for valid gaining plan within 500 surplus", () => {
      jest.spyOn(BmiUtils, "getBMR").mockReturnValue(1730);
      jest.spyOn(BmiUtils, "getCalorieNeeds").mockReturnValue(2680);

      const getValues = jest.fn().mockReturnValue({
        sex: SEX.MALE,
        birthday: "1995-06-15",
        height: 180,
        startingWeight: "70",
        activityLevel: ACTIVITY_LEVEL.ACTIVE.title,
        goalWeight: "80",
      });
      const result = getGoalSettingFormFieldsConfig(getValues);

      // 2680 < 3000 <= 2680 + 500 (3180), so this is a valid gain plan
      expect(result[1].rules.validate("3000")).toBeUndefined();
    });

    test("goalCalories validate returns undefined for valid losing plan", () => {
      jest.spyOn(BmiUtils, "getBMR").mockReturnValue(1730);
      jest.spyOn(BmiUtils, "getCalorieNeeds").mockReturnValue(2680);

      const getValues = jest.fn().mockReturnValue({
        sex: SEX.MALE,
        birthday: "1995-06-15",
        height: 180,
        startingWeight: "90",
        activityLevel: ACTIVITY_LEVEL.ACTIVE.title,
        goalWeight: "80",
      });
      const result = getGoalSettingFormFieldsConfig(getValues);

      expect(result[1].rules.validate("2400")).toBeUndefined();
    });
  });

  describe("[getNutritionGoalsFormFieldsConfig]", () => {
    test("returns array with goalProtein, goalCarbs, and goalFat fields", () => {
      const getValues = jest.fn().mockReturnValue([30, 40, 30]);
      const result = getNutritionGoalsFormFieldsConfig(getValues);

      expect(Array.isArray(result)).toBeTruthy();
      expect(result).toHaveLength(3);
      expect(result[0].name).toEqual("goalProtein");
      expect(result[1].name).toEqual("goalCarbs");
      expect(result[2].name).toEqual("goalFat");
    });

    test("all fields have correct validation bounds", () => {
      const getValues = jest.fn().mockReturnValue([30, 40, 30]);
      const result = getNutritionGoalsFormFieldsConfig(getValues);

      result.forEach((field) => {
        expect(field.rules.min.value).toEqual(Validation.MIN_MACRO_PERCENTAGE);
        expect(field.rules.max.value).toEqual(Validation.MAX_MACRO_PERCENTAGE);
      });
    });

    test("validate returns error when macros do not sum to 100", () => {
      const getValues = jest.fn().mockReturnValue([30, 40, 20]);
      const result = getNutritionGoalsFormFieldsConfig(getValues);

      expect(result[0].rules.validate()).toEqual(
        "Macronutrients must equal 100%!",
      );
    });

    test("validate returns undefined when macros sum to 100", () => {
      const getValues = jest.fn().mockReturnValue([30, 40, 30]);
      const result = getNutritionGoalsFormFieldsConfig(getValues);

      expect(result[0].rules.validate()).toBeUndefined();
    });
  });

  describe("[calculateProgressChartData]", () => {
    test("returns 0 when gaining and current weight is at or below starting weight", () => {
      expect(calculateProgressChartData(70, 80, 70)).toEqual(0);
      expect(calculateProgressChartData(70, 80, 65)).toEqual(0);
    });

    test("returns ratio when gaining and current weight exceeds goal", () => {
      // goalWeight / currentWeight = 80 / 85
      expect(calculateProgressChartData(70, 80, 85)).toBeCloseTo(80 / 85, 5);
    });

    test("returns progress ratio when gaining and current weight is between start and goal", () => {
      // (75 - 70) / (80 - 70) = 0.5
      expect(calculateProgressChartData(70, 80, 75)).toEqual(0.5);
    });

    test("returns 0 when losing and current weight is at or above starting weight", () => {
      expect(calculateProgressChartData(90, 80, 90)).toEqual(0);
      expect(calculateProgressChartData(90, 80, 95)).toEqual(0);
    });

    test("returns ratio when losing and current weight is below goal", () => {
      // currentWeight / goalWeight = 75 / 80
      expect(calculateProgressChartData(90, 80, 75)).toBeCloseTo(75 / 80, 5);
    });

    test("returns progress ratio when losing and current weight is between goal and start", () => {
      // (90 - 85) / (90 - 80) = 0.5
      expect(calculateProgressChartData(90, 80, 85)).toEqual(0.5);
    });

    test("handles string inputs", () => {
      expect(calculateProgressChartData("90", "80", "85")).toEqual(0.5);
    });

    test("returns undefined when starting weight equals goal weight", () => {
      expect(calculateProgressChartData(80, 80, 80)).toBeUndefined();
    });
  });

  describe("[calculateTotalLost]", () => {
    test("returns weight lost when losing weight", () => {
      // startingWeight - currentWeight = 90 - 85 = 5
      expect(calculateTotalLost(90, 80, 85)).toEqual(5);
    });

    test("returns weight gained when isGain is true", () => {
      // currentWeight - startingWeight = 75 - 70 = 5
      expect(calculateTotalLost(70, 80, 75, true)).toEqual(5);
    });

    test("returns weight gained when original plan is gain and goal is reached", () => {
      // currentWeight - startingWeight = 80 - 70 = 10
      expect(calculateTotalLost(70, 80, 80)).toEqual(10);
    });

    test("returns weight lost for loss plan (default isGain = false)", () => {
      // startingWeight - currentWeight = 100 - 90 = 10
      expect(calculateTotalLost(100, 80, 90)).toEqual(10);
    });

    test("handles string inputs", () => {
      expect(calculateTotalLost("90", "80", "85")).toEqual(5);
    });
  });

  describe("[getProgressTotalGoalLabelName]", () => {
    test("returns 'Total loose: ' for loss plan", () => {
      const result = getProgressTotalGoalLabelName({
        startingWeight: 90,
        goalWeight: 80,
        plan: { plan: GOALS.LOOSE },
      });

      expect(result).toEqual("Total loose: ");
    });

    test("returns 'Total gain: ' for gain plan", () => {
      const result = getProgressTotalGoalLabelName({
        startingWeight: 70,
        goalWeight: 80,
        plan: { plan: GOALS.GAIN },
      });

      expect(result).toEqual("Total gain: ");
    });

    test("returns 'Total gain: ' for maintain plan when goal is higher than starting", () => {
      const result = getProgressTotalGoalLabelName({
        startingWeight: 70,
        goalWeight: 80,
        plan: { plan: GOALS.MAINTAIN },
      });

      expect(result).toEqual("Total gain: ");
    });

    test("returns 'Total loose: ' for maintain plan when goal is lower than starting", () => {
      const result = getProgressTotalGoalLabelName({
        startingWeight: 90,
        goalWeight: 80,
        plan: { plan: GOALS.MAINTAIN },
      });

      expect(result).toEqual("Total loose: ");
    });

    test("returns 'Total loose: ' for maintain plan when goal is equal to starting", () => {
      const result = getProgressTotalGoalLabelName({
        startingWeight: 80,
        goalWeight: 80,
        plan: { plan: GOALS.MAINTAIN },
      });

      expect(result).toEqual("Total loose: ");
    });
  });

  describe("[calculateProgressRemaining]", () => {
    test("returns absolute difference between current and goal weight", () => {
      expect(calculateProgressRemaining(85, 80)).toEqual(5);
    });

    test("returns positive value when current weight is below goal", () => {
      expect(calculateProgressRemaining(75, 80)).toEqual(5);
    });

    test("returns 0 when current weight equals goal weight", () => {
      expect(calculateProgressRemaining(80, 80)).toEqual(0);
    });

    test("handles string inputs", () => {
      expect(calculateProgressRemaining("85", "80")).toEqual(5);
    });
  });

  describe("[getOptimalWeightMessage]", () => {
    const CustomText = ({ children }) => children;

    test("returns null when there are field errors", () => {
      expect(
        getOptimalWeightMessage(
          SEX.MALE,
          new Date("1995-06-15"),
          180,
          { sex: "error", birthday: undefined, height: undefined },
          { sex: true, birthday: true, height: true },
          false,
          CustomText,
        ),
      ).toBeNull();
    });

    test("returns null when fields are not touched", () => {
      expect(
        getOptimalWeightMessage(
          SEX.MALE,
          new Date("1995-06-15"),
          180,
          {},
          { sex: false, birthday: true, height: true },
          false,
          CustomText,
        ),
      ).toBeNull();
    });

    test("returns null when sex is missing", () => {
      expect(
        getOptimalWeightMessage(
          null,
          new Date("1995-06-15"),
          180,
          {},
          { sex: true, birthday: true, height: true },
          false,
          CustomText,
        ),
      ).toBeNull();
    });

    test("returns JSX message for valid inputs", () => {
      jest.spyOn(BmiUtils, "getOptimalWeightRange").mockReturnValue({
        optimalWeight: 70.5,
        optimalWeightRange: { min: 59.9, max: 81 },
      });

      const result = getOptimalWeightMessage(
        SEX.MALE,
        new Date("1995-06-15"),
        180,
        {},
        { sex: true, birthday: true, height: true },
        false,
        CustomText,
      );

      expect(result).not.toBeNull();
    });

    test("returns null when getOptimalWeightRange throws", () => {
      jest.spyOn(BmiUtils, "getOptimalWeightRange").mockImplementation(() => {
        throw new Error("Invalid");
      });

      const result = getOptimalWeightMessage(
        SEX.MALE,
        new Date("1995-06-15"),
        180,
        {},
        { sex: true, birthday: true, height: true },
        false,
        CustomText,
      );

      expect(result).toBeNull();
    });
  });

  describe("[getCalorieNecessityMessage]", () => {
    const CustomText = ({ children }) => children;

    test("returns null when there are field errors", () => {
      expect(
        getCalorieNecessityMessage(
          SEX.MALE,
          new Date("1995-06-15"),
          180,
          80,
          ACTIVITY_LEVEL.ACTIVE.title,
          { sex: "error" },
          false,
          CustomText,
        ),
      ).toBeNull();
    });

    test("returns null when any required value is missing", () => {
      expect(
        getCalorieNecessityMessage(
          SEX.MALE,
          new Date("1995-06-15"),
          180,
          null,
          ACTIVITY_LEVEL.ACTIVE.title,
          {},
          false,
          CustomText,
        ),
      ).toBeNull();
    });

    test("returns JSX message for valid inputs", () => {
      jest.spyOn(BmiUtils, "getBMR").mockReturnValue(1730);
      jest.spyOn(BmiUtils, "getCalorieNeeds").mockReturnValue(2680);

      const result = getCalorieNecessityMessage(
        SEX.MALE,
        new Date("1995-06-15"),
        180,
        80,
        ACTIVITY_LEVEL.ACTIVE.title,
        {},
        false,
        CustomText,
      );

      expect(result).not.toBeNull();
    });

    test("returns null when getBMR throws", () => {
      jest.spyOn(BmiUtils, "getBMR").mockImplementation(() => {
        throw new Error("Invalid");
      });

      const result = getCalorieNecessityMessage(
        SEX.MALE,
        new Date("1995-06-15"),
        180,
        80,
        ACTIVITY_LEVEL.ACTIVE.title,
        {},
        false,
        CustomText,
      );

      expect(result).toBeNull();
    });
  });

  describe("[getGoalPlanMessage]", () => {
    const CustomText = ({ children }) => children;

    test("returns null when there are field errors", () => {
      expect(
        getGoalPlanMessage(
          SEX.MALE,
          new Date("1995-06-15"),
          180,
          80,
          ACTIVITY_LEVEL.ACTIVE.title,
          70,
          2200,
          { goalWeight: "error" },
          false,
          CustomText,
        ),
      ).toBeNull();
    });

    test("returns null when any required value is missing", () => {
      expect(
        getGoalPlanMessage(
          SEX.MALE,
          new Date("1995-06-15"),
          180,
          80,
          ACTIVITY_LEVEL.ACTIVE.title,
          null,
          2200,
          {},
          false,
          CustomText,
        ),
      ).toBeNull();
    });

    test("returns JSX message for maintain plan", () => {
      jest.spyOn(BmiUtils, "getBMR").mockReturnValue(1730);
      jest.spyOn(BmiUtils, "getCalorieNeeds").mockReturnValue(2680);
      jest
        .spyOn(BmiUtils, "getLossOrGainPlan")
        .mockReturnValue({ plan: GOALS.MAINTAIN });

      const result = getGoalPlanMessage(
        SEX.MALE,
        new Date("1995-06-15"),
        180,
        80,
        ACTIVITY_LEVEL.ACTIVE.title,
        80,
        2680,
        {},
        false,
        CustomText,
      );

      expect(result).not.toBeNull();
    });

    test("returns JSX message for loss/gain plan", () => {
      jest.spyOn(BmiUtils, "getBMR").mockReturnValue(1730);
      jest.spyOn(BmiUtils, "getCalorieNeeds").mockReturnValue(2680);
      jest.spyOn(BmiUtils, "getLossOrGainPlan").mockReturnValue({
        plan: GOALS.LOOSE,
        weeklyRate: 0.45,
        goalDate: "2025-07-01T00:00:00.000Z",
      });
      jest
        .spyOn(DateUtils, "getDateStringFormat")
        .mockReturnValue("Jul 1, 2025");

      const result = getGoalPlanMessage(
        SEX.MALE,
        new Date("1995-06-15"),
        180,
        90,
        ACTIVITY_LEVEL.ACTIVE.title,
        80,
        2200,
        {},
        false,
        CustomText,
      );

      expect(result).not.toBeNull();
    });

    test("returns null when getLossOrGainPlan throws", () => {
      jest.spyOn(BmiUtils, "getBMR").mockReturnValue(1730);
      jest.spyOn(BmiUtils, "getCalorieNeeds").mockReturnValue(2680);
      jest.spyOn(BmiUtils, "getLossOrGainPlan").mockImplementation(() => {
        throw new Error("Invalid");
      });

      const result = getGoalPlanMessage(
        SEX.MALE,
        new Date("1995-06-15"),
        180,
        90,
        ACTIVITY_LEVEL.ACTIVE.title,
        80,
        2200,
        {},
        false,
        CustomText,
      );

      expect(result).toBeNull();
    });
  });

  describe("[getMacrosMessage]", () => {
    const CustomText = ({ children }) => children;

    test("returns null when there are field errors", () => {
      expect(
        getMacrosMessage(
          SEX.MALE,
          new Date("1995-06-15"),
          180,
          80,
          ACTIVITY_LEVEL.ACTIVE.title,
          70,
          2200,
          30,
          40,
          30,
          { goalProtein: "error" },
          false,
          CustomText,
        ),
      ).toBeNull();
    });

    test("returns null when any required value is missing", () => {
      expect(
        getMacrosMessage(
          SEX.MALE,
          new Date("1995-06-15"),
          180,
          80,
          ACTIVITY_LEVEL.ACTIVE.title,
          70,
          2200,
          null,
          40,
          30,
          {},
          false,
          CustomText,
        ),
      ).toBeNull();
    });

    test("returns JSX message for valid inputs", () => {
      jest.spyOn(BmiUtils, "getMacroGramm").mockReturnValue(100);

      const result = getMacrosMessage(
        SEX.MALE,
        new Date("1995-06-15"),
        180,
        80,
        ACTIVITY_LEVEL.ACTIVE.title,
        70,
        2200,
        30,
        40,
        30,
        {},
        false,
        CustomText,
      );

      expect(result).not.toBeNull();
    });

    test("returns null when getMacroGramm throws", () => {
      jest.spyOn(BmiUtils, "getMacroGramm").mockImplementation(() => {
        throw new Error("Invalid");
      });

      const result = getMacrosMessage(
        SEX.MALE,
        new Date("1995-06-15"),
        180,
        80,
        ACTIVITY_LEVEL.ACTIVE.title,
        70,
        2200,
        30,
        40,
        30,
        {},
        false,
        CustomText,
      );

      expect(result).toBeNull();
    });
  });

  describe("[buildDeficitMessages]", () => {
    test("returns good message when all deficits are within acceptable range and using default Date", () => {
      jest.useFakeTimers().setSystemTime(new Date("2026-01-01T23:00:00.000Z"));
      const result = buildDeficitMessages(50, 0, 0, 0, 0, 0);

      expect(result).toHaveLength(1);
      expect(result[0].good).toEqual(true);
      expect(result[0].message).toEqual(
        "You're doing great, keep up the good work!",
      );
    });

    test("returns too little calories message with risks when deficit >= 500 and hour >= 20", () => {
      const result = buildDeficitMessages(500, 0, 0, 0, 0, 0, 21);

      expect(
        result.some((m) => m.message === "You consumed too little calories."),
      ).toBeTruthy();
      const msg = result.find(
        (m) => m.message === "You consumed too little calories.",
      );
      expect(msg.risks).toBeDefined();
    });

    test("returns too little calories message without risks when deficit > 0 and < 500 and hour >= 20", () => {
      const result = buildDeficitMessages(200, 0, 0, 0, 0, 0, 21);

      const msg = result.find(
        (m) => m.message === "You consumed too little calories.",
      );
      expect(msg).toBeDefined();
      expect(msg.risks).toBeUndefined();
    });

    test("does not return too little calories message when hour < 20", () => {
      const result = buildDeficitMessages(200, 0, 0, 0, 0, 0, 15);

      const msg = result.find(
        (m) => m.message === "You consumed too little calories.",
      );
      expect(msg).toBeUndefined();
    });

    test("returns too much calories message with risks when deficit <= -500", () => {
      const result = buildDeficitMessages(-500, 0, 0, 0, 0, 0, 12);

      const msg = result.find(
        (m) => m.message === "You consumed too much calories.",
      );
      expect(msg).toBeDefined();
      expect(msg.risks).toBeDefined();
    });

    test("returns too much calories message without risks when deficit is between -500 and -100", () => {
      const result = buildDeficitMessages(-200, 0, 0, 0, 0, 0, 12);

      const msg = result.find(
        (m) => m.message === "You consumed too much calories.",
      );
      expect(msg).toBeDefined();
      expect(msg.risks).toBeUndefined();
    });

    test("returns too little protein message with risks when deficit >= 50 and hour >= 20", () => {
      const result = buildDeficitMessages(0, 50, 0, 0, 0, 0, 21);

      const msg = result.find(
        (m) => m.message === "You consumed too little protein.",
      );
      expect(msg).toBeDefined();
      expect(msg.risks).toBeDefined();
    });

    test("returns too little protein message without risks when deficit > 0 and < 50 and hour >= 20", () => {
      const result = buildDeficitMessages(0, 20, 0, 0, 0, 0, 21);

      const msg = result.find(
        (m) => m.message === "You consumed too little protein.",
      );
      expect(msg).toBeDefined();
      expect(msg.risks).toBeUndefined();
    });

    test("does not return too little protein message when hour < 20", () => {
      const result = buildDeficitMessages(0, 50, 0, 0, 0, 0, 15);

      const msg = result.find(
        (m) => m.message === "You consumed too little protein.",
      );
      expect(msg).toBeUndefined();
    });

    test("returns too much carbs message with risks when deficit <= -50", () => {
      const result = buildDeficitMessages(0, 0, -50, 0, 0, 0, 12);

      const msg = result.find(
        (m) => m.message === "You consumed too much carbs.",
      );
      expect(msg).toBeDefined();
      expect(msg.risks).toBeDefined();
    });

    test("returns too much carbs message without risks when deficit is between -50 and 0", () => {
      const result = buildDeficitMessages(0, 0, -20, 0, 0, 0, 12);

      const msg = result.find(
        (m) => m.message === "You consumed too much carbs.",
      );
      expect(msg).toBeDefined();
      expect(msg.risks).toBeUndefined();
    });

    test("returns too much fat message with risks when deficit <= -40", () => {
      const result = buildDeficitMessages(0, 0, 0, -40, 0, 0, 12);

      const msg = result.find(
        (m) => m.message === "You consumed too much fat.",
      );
      expect(msg).toBeDefined();
      expect(msg.risks).toBeDefined();
    });

    test("returns too much fat message without risks when deficit is between -40 and 0", () => {
      const result = buildDeficitMessages(0, 0, 0, -20, 0, 0, 12);

      const msg = result.find(
        (m) => m.message === "You consumed too much fat.",
      );
      expect(msg).toBeDefined();
      expect(msg.risks).toBeUndefined();
    });

    test("returns too much sugar message with risks when deficit <= -30", () => {
      const result = buildDeficitMessages(0, 0, 0, 0, -30, 0, 12);

      const msg = result.find(
        (m) => m.message === "You consumed too much sugar.",
      );
      expect(msg).toBeDefined();
      expect(msg.risks).toBeDefined();
    });

    test("returns too much sugar message without risks when deficit is between -30 and 0", () => {
      const result = buildDeficitMessages(0, 0, 0, 0, -10, 0, 12);

      const msg = result.find(
        (m) => m.message === "You consumed too much sugar.",
      );
      expect(msg).toBeDefined();
      expect(msg.risks).toBeUndefined();
    });

    test("returns too much added sugar message with risks when deficit <= -20", () => {
      const result = buildDeficitMessages(0, 0, 0, 0, 0, -20, 12);

      const msg = result.find(
        (m) => m.message === "You consumed too much added sugar.",
      );
      expect(msg).toBeDefined();
      expect(msg.risks).toBeDefined();
    });

    test("returns too much added sugar message without risks when deficit is between -20 and 0", () => {
      const result = buildDeficitMessages(0, 0, 0, 0, 0, -10, 12);

      const msg = result.find(
        (m) => m.message === "You consumed too much added sugar.",
      );
      expect(msg).toBeDefined();
      expect(msg.risks).toBeUndefined();
    });

    test("returns multiple messages when multiple deficits are present", () => {
      const result = buildDeficitMessages(-600, 0, -60, -50, -40, -25, 21);

      expect(result.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe("[getWeightProggressChartData]", () => {
    test("returns data and chartConfig", () => {
      const result = getWeightProggressChartData({
        startingWeight: 90,
        goalWeight: 80,
        currentWeight: 85,
      });

      expect(result.data).toBeDefined();
      expect(result.chartConfig).toBeDefined();
    });

    test("data reflects progress calculation", () => {
      const result = getWeightProggressChartData({
        startingWeight: 90,
        goalWeight: 80,
        currentWeight: 85,
      });

      expect(result.data).toEqual(0.5);
    });

    test("chartConfig has expected properties", () => {
      const result = getWeightProggressChartData({
        startingWeight: 90,
        goalWeight: 80,
        currentWeight: 85,
      });

      expect(result.chartConfig.backgroundGradientFromOpacity).toEqual(0);
      expect(result.chartConfig.backgroundGradientToOpacity).toEqual(0);
      expect(result.chartConfig.color).toBeDefined();
    });
  });
});
