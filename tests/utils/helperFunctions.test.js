import COLORS from "../../constants/colorConstants";
import {
  calculatePercentage,
  sumDictElements,
  sumListElements,
  avaregeListElements,
  parseNumeric,
  calculateConsumedPercent,
  getChartConfigColor,
  getChartConfig,
  getCustomChartData,
  getCustomLineChartData,
} from "../../utils/helperFunctions";
import * as ColorUtils from "../../utils/colorUtils";

describe("Helper Functions", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("[calculatePercentage]", () => {
    test("returns correct percentage for simple values", () => {
      expect(calculatePercentage(50, 200)).toEqual(25);
    });

    test("returns 100 when number equals total", () => {
      expect(calculatePercentage(200, 200)).toEqual(100);
    });

    test("rounds the result to the nearest integer", () => {
      expect(calculatePercentage(1, 3)).toEqual(33);
    });

    test("handles string inputs via validateNumberParam", () => {
      expect(calculatePercentage("75", "300")).toEqual(25);
    });

    test("returns 0 when number is 0", () => {
      expect(calculatePercentage(0, 100)).toEqual(0);
    });

    test("throws error when total is zero", () => {
      expect(() => calculatePercentage(50, 0)).toThrow(
        "Invalid parameter! total must not be zero!",
      );
    });

    test("throws error when number is null", () => {
      expect(() => calculatePercentage(null, 100)).toThrow(
        "Missing required parameter: number!",
      );
    });

    test("throws error when total is undefined", () => {
      expect(() => calculatePercentage(50, undefined)).toThrow(
        "Missing required parameter: total!",
      );
    });

    test("throws error when number is not a valid number", () => {
      expect(() => calculatePercentage("abc", 100)).toThrow(
        "Invalid parameter! number must be a number!",
      );
    });
  });

  describe("[sumDictElements]", () => {
    test("sums all values in a dictionary", () => {
      expect(sumDictElements({ a: 10, b: 20, c: 30 })).toEqual(60);
    });

    test("returns 0 for an empty dictionary", () => {
      expect(sumDictElements({})).toEqual(0);
    });

    test("handles a single entry", () => {
      expect(sumDictElements({ only: 42 })).toEqual(42);
    });

    test("handles negative values", () => {
      expect(sumDictElements({ a: -10, b: 20 })).toEqual(10);
    });

    test("handles decimal values", () => {
      expect(sumDictElements({ a: 1.5, b: 2.5 })).toEqual(4);
    });
  });

  describe("[sumListElements]", () => {
    test("sums list elements as floats by default", () => {
      expect(sumListElements([1.5, 2.5, 3])).toEqual(7);
    });

    test("sums list elements as integers when isInt is true", () => {
      expect(sumListElements(["1.9", "2.7", "3.1"], true)).toEqual(6);
    });

    test("returns 0 for an empty list", () => {
      expect(sumListElements([])).toEqual(0);
    });

    test("handles string number inputs as floats", () => {
      expect(sumListElements(["1.5", "2.5"])).toEqual(4);
    });

    test("handles a single element", () => {
      expect(sumListElements([10])).toEqual(10);
    });
  });

  describe("[avaregeListElements]", () => {
    test("calculates the average and rounds up", () => {
      expect(avaregeListElements([10, 20, 30])).toEqual(20);
    });

    test("rounds up using Math.ceil", () => {
      // (10 + 20) / 2 = 15 -> ceil(15) = 15
      expect(avaregeListElements([10, 20])).toEqual(15);
    });

    test("rounds up fractional averages", () => {
      // (1 + 2) / 2 = 1.5 -> ceil(1.5) = 2
      expect(avaregeListElements([1, 2])).toEqual(2);
    });

    test("calculates average with integer parsing when isInt is true", () => {
      // parseInt("1.9") + parseInt("2.7") = 1 + 2 = 3, 3/2 = 1.5 -> ceil = 2
      expect(avaregeListElements(["1.9", "2.7"], true)).toEqual(2);
    });

    test("handles a single element", () => {
      expect(avaregeListElements([7])).toEqual(7);
    });
  });

  describe("[parseNumeric]", () => {
    test("parses all values as integers by default", () => {
      expect(parseNumeric({ data: { a: "10", b: "20.5" } })).toEqual({
        a: 10,
        b: 20,
      });
    });

    test("parses all values as floats when isDecimal is true", () => {
      expect(
        parseNumeric({ data: { a: "10.5", b: "20.7" }, isDecimal: true }),
      ).toEqual({ a: 10.5, b: 20.7 });
    });

    test("handles an empty object", () => {
      expect(parseNumeric({ data: {} })).toEqual({});
    });

    test("handles already numeric values", () => {
      expect(parseNumeric({ data: { a: 5, b: 10 } })).toEqual({
        a: 5,
        b: 10,
      });
    });

    test("preserves all keys from the original object", () => {
      const result = parseNumeric({
        data: { calories: "200", protein: "30", fat: "15" },
      });

      expect(Object.keys(result)).toEqual(["calories", "protein", "fat"]);
    });
  });

  describe("[calculateConsumedPercent]", () => {
    test("returns correct ratio for consumed less than max", () => {
      expect(calculateConsumedPercent(50, 100)).toEqual(0.5);
    });

    test("returns 1 when consumed equals max", () => {
      expect(calculateConsumedPercent(100, 100)).toEqual(1);
    });

    test("caps at 1 when consumed exceeds max", () => {
      expect(calculateConsumedPercent(150, 100)).toEqual(1);
    });

    test("returns 0 when consumed is 0", () => {
      expect(calculateConsumedPercent(0, 100)).toEqual(0);
    });

    test("handles string inputs", () => {
      expect(calculateConsumedPercent("75", "200")).toEqual(0.375);
    });
  });

  describe("[getChartConfigColor]", () => {
    test("returns an object with a color function", () => {
      const result = getChartConfigColor({ color: "#1aacf0" });

      expect(result).toHaveProperty("color");
      expect(typeof result.color).toBe("function");
    });

    test("color function returns rgba string with given opacity", () => {
      const result = getChartConfigColor({ color: "#1aacf0" });

      expect(result.color(0.5)).toEqual("rgba(26, 172, 240, 0.5)");
    });

    test("color function defaults to opacity 1", () => {
      const result = getChartConfigColor({ color: "#1aacf0" });

      expect(result.color()).toEqual("rgba(26, 172, 240, 1)");
    });
  });

  describe("[getChartConfig]", () => {
    test("returns config with transparent background gradients", () => {
      const result = getChartConfig({ color: "#1aacf0" });

      expect(result.backgroundGradientFromOpacity).toEqual(0);
      expect(result.backgroundGradientToOpacity).toEqual(0);
    });

    test("includes color function from getChartConfigColor", () => {
      const result = getChartConfig({ color: "#1aacf0" });

      expect(result).toHaveProperty("color");
      expect(typeof result.color).toBe("function");
      expect(result.color(0.5)).toEqual("rgba(26, 172, 240, 0.5)");
    });
  });

  describe("[getCustomChartData]", () => {
    test("returns data array and chartConfig for primary colors", () => {
      const result = getCustomChartData({
        actualAmount: 50,
        totalAmount: 100,
        accent: false,
      });

      expect(result.data).toEqual([0.5]);
      expect(result.chartConfig).toHaveProperty("color");
      expect(result.chartConfig.backgroundGradientFromOpacity).toEqual(0);
      expect(result.chartConfig.backgroundGradientToOpacity).toEqual(0);
    });

    test("caps data at 1 when actual exceeds total", () => {
      const result = getCustomChartData({
        actualAmount: 150,
        totalAmount: 100,
        accent: false,
      });

      expect(result.data).toEqual([1]);
    });

    test("uses accent colors when accent is true", () => {
      const getDynamicColorsSpy = jest
        .spyOn(ColorUtils, "getDynamicColors")
        .mockReturnValue({
          shade500: COLORS.ACCENT_500,
        });

      const result = getCustomChartData({
        actualAmount: 50,
        totalAmount: 100,
        accent: true,
      });

      expect(getDynamicColorsSpy).toHaveBeenCalledWith(true);
      expect(result.chartConfig.color(1)).toEqual(
        ColorUtils.hexToRgba(COLORS.ACCENT_500, 1),
      );
    });

    test("uses primary colors when accent is false", () => {
      const getDynamicColorsSpy = jest
        .spyOn(ColorUtils, "getDynamicColors")
        .mockReturnValue({
          shade500: COLORS.PRIMARY_500,
        });

      const result = getCustomChartData({
        actualAmount: 75,
        totalAmount: 200,
        accent: false,
      });

      expect(getDynamicColorsSpy).toHaveBeenCalledWith(false);
      expect(result.data).toEqual([0.375]);
    });
  });

  describe("[getCustomLineChartData]", () => {
    test("returns data with labels, datasets, and legend", () => {
      const rawData = { labels: ["Mon", "Tue"], data: [100, 200] };
      const result = getCustomLineChartData({ rawData, legend: "Calories" });

      expect(result.data.labels).toEqual(["Mon", "Tue"]);
      expect(result.data.datasets).toHaveLength(1);
      expect(result.data.datasets[0].data).toEqual([100, 200]);
      expect(result.data.legend).toEqual(["Calories"]);
    });

    test("uses ACCENT_500 for dataset color and PRIMARY_500 for chart config when accent is false", () => {
      const rawData = { labels: ["A"], data: [10] };
      const result = getCustomLineChartData({
        rawData,
        legend: "Test",
        accent: false,
      });

      expect(result.data.datasets[0].color(1)).toEqual(
        ColorUtils.hexToRgba(COLORS.ACCENT_500, 1),
      );
      expect(result.chartConfig.color(1)).toEqual(
        ColorUtils.hexToRgba(COLORS.PRIMARY_500, 1),
      );
    });

    test("uses PRIMARY_500 for dataset color and ACCENT_500 for chart config when accent is true", () => {
      const rawData = { labels: ["A"], data: [10] };
      const result = getCustomLineChartData({
        rawData,
        legend: "Test",
        accent: true,
      });

      expect(result.data.datasets[0].color(1)).toEqual(
        ColorUtils.hexToRgba(COLORS.PRIMARY_500, 1),
      );
      expect(result.chartConfig.color(1)).toEqual(
        ColorUtils.hexToRgba(COLORS.ACCENT_500, 1),
      );
    });

    test("chart config includes strokeWidth, barPercentage, and useShadowColorFromDataset", () => {
      const rawData = { labels: ["A"], data: [10] };
      const result = getCustomLineChartData({ rawData, legend: "Test" });

      expect(result.chartConfig.strokeWidth).toEqual(2);
      expect(result.chartConfig.barPercentage).toEqual(0.5);
      expect(result.chartConfig.useShadowColorFromDataset).toEqual(false);
    });

    test("chart config includes transparent background gradients", () => {
      const rawData = { labels: ["A"], data: [10] };
      const result = getCustomLineChartData({ rawData, legend: "Test" });

      expect(result.chartConfig.backgroundGradientFromOpacity).toEqual(0);
      expect(result.chartConfig.backgroundGradientToOpacity).toEqual(0);
    });
  });
});
