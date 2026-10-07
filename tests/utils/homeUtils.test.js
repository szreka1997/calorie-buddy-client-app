import COLORS from "../../constants/colorConstants";
import {
  calculateTotalWeightChange,
  calculateAvaregeWeightChange,
  getSignedValueText,
  prepareWeightChartData,
  getCaloriesAndMacrosChartData,
  getCaloriesAndMacrosExplanatoryTextsData,
  getAddWeightFormFieldsConfig,
} from "../../utils/homeUtils";
import * as Validation from "../../constants/validationConstants";
import * as DateUtils from "../../utils/dateUtils";

describe("Home Utils", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("[calculateTotalWeightChange]", () => {
    test("returns positive change when last weight is greater than first", () => {
      expect(calculateTotalWeightChange([70, 72, 75])).toEqual(5);
    });

    test("returns negative change when last weight is less than first", () => {
      expect(calculateTotalWeightChange([80, 78, 75])).toEqual(-5);
    });

    test("returns 0 when first and last weights are equal", () => {
      expect(calculateTotalWeightChange([70, 72, 70])).toEqual(0);
    });

    test("handles string inputs", () => {
      expect(calculateTotalWeightChange(["70.5", "72", "75.5"])).toEqual(5);
    });

    test("handles a two-element array", () => {
      expect(calculateTotalWeightChange([60, 65])).toEqual(5);
    });
  });

  describe("[calculateAvaregeWeightChange]", () => {
    test("returns average change between consecutive entries", () => {
      // diffs: 2, 3 -> total 5 / 2 = 2.5
      expect(calculateAvaregeWeightChange([70, 72, 75])).toEqual(2.5);
    });

    test("returns negative average for decreasing weights", () => {
      // diffs: -2, -3 -> total -5 / 2 = -2.5
      expect(calculateAvaregeWeightChange([80, 78, 75])).toEqual(-2.5);
    });

    test("returns 0 when all weights are the same", () => {
      expect(calculateAvaregeWeightChange([70, 70, 70])).toEqual(0);
    });

    test("handles a two-element array", () => {
      // diff: 5 / 1 = 5
      expect(calculateAvaregeWeightChange([60, 65])).toEqual(5);
    });

    test("handles mixed increases and decreases", () => {
      // diffs: 5, -3 -> total 2 / 2 = 1
      expect(calculateAvaregeWeightChange([70, 75, 72])).toEqual(1);
    });
  });

  describe("[getSignedValueText]", () => {
    test("returns positive prefix for positive values", () => {
      expect(getSignedValueText(5)).toEqual("+ 5");
    });

    test("returns negative prefix for negative values", () => {
      expect(getSignedValueText(-3)).toEqual("- 3");
    });

    test("returns positive prefix for zero", () => {
      expect(getSignedValueText(0)).toEqual("+ 0");
    });

    test("handles decimal values", () => {
      expect(getSignedValueText(2.5)).toEqual("+ 2.5");
      expect(getSignedValueText(-1.75)).toEqual("- 1.75");
    });
  });

  describe("[prepareWeightChartData]", () => {
    test("returns chart data with labels and weight values", () => {
      jest
        .spyOn(DateUtils, "getDateLabelName")
        .mockImplementation((date) => date);

      const weights = [
        { date: "01.15.", weight: "70" },
        { date: "01.16.", weight: "71" },
        { date: "01.17.", weight: "72" },
      ];

      const result = prepareWeightChartData(weights);

      expect(result.chartData.labels).toEqual(["01.15.", "01.16.", "01.17."]);
      expect(result.chartData.data).toEqual([70, 71, 72]);
    });

    test("calculates net change and average log for multiple entries", () => {
      jest.spyOn(DateUtils, "getDateLabelName").mockReturnValue("label");

      const weights = [
        { date: "2025-01-01", weight: "70" },
        { date: "2025-01-02", weight: "72" },
        { date: "2025-01-03", weight: "75" },
      ];

      const result = prepareWeightChartData(weights);

      expect(result.statInfo.netChange).toEqual("5.00");
      expect(result.statInfo.avaregeLog).toEqual("2.50");
    });

    test("returns zero stats for a single entry", () => {
      jest.spyOn(DateUtils, "getDateLabelName").mockReturnValue("label");

      const weights = [{ date: "2025-01-01", weight: "70" }];

      const result = prepareWeightChartData(weights);

      expect(result.statInfo.netChange).toEqual(0);
      expect(result.statInfo.avaregeLog).toEqual(0);
    });

    test("limits data to numberOfData parameter", () => {
      jest.spyOn(DateUtils, "getDateLabelName").mockReturnValue("label");

      const weights = [
        { date: "2025-01-01", weight: "70" },
        { date: "2025-01-02", weight: "71" },
        { date: "2025-01-03", weight: "72" },
        { date: "2025-01-04", weight: "73" },
        { date: "2025-01-05", weight: "74" },
      ];

      const result = prepareWeightChartData(weights, 3);

      expect(result.chartData.data).toHaveLength(3);
      expect(result.chartData.labels).toHaveLength(3);
    });

    test("defaults to 7 entries when numberOfData is not provided", () => {
      jest.spyOn(DateUtils, "getDateLabelName").mockReturnValue("label");

      const weights = Array.from({ length: 10 }, (_, i) => ({
        date: `2025-01-${String(i + 1).padStart(2, "0")}`,
        weight: String(70 + i),
      }));

      const result = prepareWeightChartData(weights);

      expect(result.chartData.data).toHaveLength(7);
    });

    test("handles fewer entries than numberOfData", () => {
      jest.spyOn(DateUtils, "getDateLabelName").mockReturnValue("label");

      const weights = [
        { date: "2025-01-01", weight: "70" },
        { date: "2025-01-02", weight: "71" },
      ];

      const result = prepareWeightChartData(weights, 7);

      expect(result.chartData.data).toHaveLength(2);
    });
  });

  describe("[getCaloriesAndMacrosChartData]", () => {
    const data = {
      consumedKcal: 1000,
      consumedProtein: 50,
      consumedCarbs: 100,
      consumedFat: 30,
      maxKcal: 2000,
      maxProtein: 100,
      maxCarbs: 200,
      maxFat: 60,
    };

    test("returns array with four chart entries for kcal, protein, carbs, and fat", () => {
      const result = getCaloriesAndMacrosChartData(data);

      expect(result).toHaveLength(4);
      expect(result[0].key).toEqual("kcal");
      expect(result[1].key).toEqual("protein");
      expect(result[2].key).toEqual("carbs");
      expect(result[3].key).toEqual("fat");
    });

    test("calculates consumed percentages correctly", () => {
      const result = getCaloriesAndMacrosChartData(data);

      expect(result[0].data).toEqual([0.5]);
      expect(result[1].data).toEqual([0.5]);
      expect(result[2].data).toEqual([0.5]);
      expect(result[3].data).toEqual([0.5]);
    });

    test("caps consumed percentages at 1 when exceeding max", () => {
      const result = getCaloriesAndMacrosChartData({
        ...data,
        consumedKcal: 3000,
        consumedProtein: 150,
        consumedCarbs: 300,
        consumedFat: 90,
      });

      expect(result[0].data).toEqual([1]);
      expect(result[1].data).toEqual([1]);
      expect(result[2].data).toEqual([1]);
      expect(result[3].data).toEqual([1]);
    });

    test("assigns correct radius to each entry", () => {
      const result = getCaloriesAndMacrosChartData(data);

      expect(result[0].radius).toEqual(80);
      expect(result[1].radius).toEqual(60);
      expect(result[2].radius).toEqual(40);
      expect(result[3].radius).toEqual(20);
    });

    test("uses dynamic primary color for kcal when accent is false", () => {
      const result = getCaloriesAndMacrosChartData(data);

      expect(result[0].color).toEqual(COLORS.PRIMARY_500);
    });

    test("uses dynamic accent color for kcal when accent is true", () => {
      const result = getCaloriesAndMacrosChartData({
        ...data,
        accent: true,
      });

      expect(result[0].color).toEqual(COLORS.ACCENT_500);
    });

    test("uses fixed macro colors for protein, carbs, and fat", () => {
      const result = getCaloriesAndMacrosChartData(data);

      expect(result[1].color).toEqual(COLORS.PROTEIN_500);
      expect(result[2].color).toEqual(COLORS.CARBS_500);
      expect(result[3].color).toEqual(COLORS.FAT_500);
    });
  });

  describe("[getCaloriesAndMacrosExplanatoryTextsData]", () => {
    const data = {
      consumedKcal: 1000,
      consumedProtein: 50,
      consumedCarbs: 100,
      consumedFat: 30,
      maxKcal: 2000,
      maxProtein: 100,
      maxCarbs: 200,
      maxFat: 60,
    };

    test("returns array with four entries for kcal, protein, carbs, and fat", () => {
      const result = getCaloriesAndMacrosExplanatoryTextsData(data);

      expect(result).toHaveLength(4);
      expect(result[0].key).toEqual("kcal");
      expect(result[1].key).toEqual("protein");
      expect(result[2].key).toEqual("carbs");
      expect(result[3].key).toEqual("fat");
    });

    test("formats value strings as consumed / max", () => {
      const result = getCaloriesAndMacrosExplanatoryTextsData(data);

      expect(result[0].value).toEqual("1000 / 2000");
      expect(result[1].value).toEqual("50 / 100");
      expect(result[2].value).toEqual("100 / 200");
      expect(result[3].value).toEqual("30 / 60");
    });

    test("assigns correct labels", () => {
      const result = getCaloriesAndMacrosExplanatoryTextsData(data);

      expect(result[0].label).toEqual("Kcal: ");
      expect(result[1].label).toEqual("Protein: ");
      expect(result[2].label).toEqual("Carbs: ");
      expect(result[3].label).toEqual("Fat: ");
    });

    test("assigns correct icons", () => {
      const result = getCaloriesAndMacrosExplanatoryTextsData(data);

      expect(result[0].icon).toEqual("flame");
      expect(result[1].icon).toEqual("fish");
      expect(result[2].icon).toEqual("nutrition");
      expect(result[3].icon).toEqual("egg");
    });

    test("uses primary dynamic colors for kcal when accent is false", () => {
      const result = getCaloriesAndMacrosExplanatoryTextsData(data);

      expect(result[0].textColor).toEqual(COLORS.PRIMARY_50);
      expect(result[0].highlightColor).toEqual(COLORS.PRIMARY_500);
      expect(result[0].iconColor).toEqual(COLORS.PRIMARY_500);
    });

    test("uses accent dynamic colors for kcal when accent is true", () => {
      const result = getCaloriesAndMacrosExplanatoryTextsData({
        ...data,
        accent: true,
      });

      expect(result[0].textColor).toEqual(COLORS.ACCENT_50);
      expect(result[0].highlightColor).toEqual(COLORS.ACCENT_500);
      expect(result[0].iconColor).toEqual(COLORS.ACCENT_500);
    });

    test("uses fixed macro colors for protein, carbs, and fat", () => {
      const result = getCaloriesAndMacrosExplanatoryTextsData(data);

      expect(result[1].textColor).toEqual(COLORS.PROTEIN_100);
      expect(result[1].highlightColor).toEqual(COLORS.PROTEIN_500);
      expect(result[2].textColor).toEqual(COLORS.CARBS_100);
      expect(result[2].highlightColor).toEqual(COLORS.CARBS_500);
      expect(result[3].textColor).toEqual(COLORS.FAT_100);
      expect(result[3].highlightColor).toEqual(COLORS.FAT_500);
    });
  });

  describe("[getAddWeightFormFieldsConfig]", () => {
    test("returns object with weightConfig", () => {
      const result = getAddWeightFormFieldsConfig();

      expect(result.weightConfig).toBeDefined();
    });

    test("weightConfig has correct name and label", () => {
      const result = getAddWeightFormFieldsConfig();

      expect(result.weightConfig.name).toEqual("weight");
      expect(result.weightConfig.label).toEqual("Today's weight (kg)");
      expect(result.weightConfig.placeholderText).toEqual(
        "Enter today's weight",
      );
    });

    test("weightConfig has correct validation bounds", () => {
      const result = getAddWeightFormFieldsConfig();

      expect(result.weightConfig.rules.min.value).toEqual(
        Validation.MIN_WEIGHT,
      );
      expect(result.weightConfig.rules.max.value).toEqual(
        Validation.MAX_WEIGHT,
      );
    });

    test("weightConfig has required rule", () => {
      const result = getAddWeightFormFieldsConfig();

      expect(result.weightConfig.rules.required).toEqual(
        "Today's weight (kg) is required!",
      );
    });
  });
});
