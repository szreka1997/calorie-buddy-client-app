import { handleScrollY, calculateCenterOffset } from "../../utils/scrollUtils";

describe("Scroll Utils", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("[handleScrollY]", () => {
    test("returns y offset from a valid scroll event", () => {
      const event = { nativeEvent: { contentOffset: { y: 150 } } };

      expect(handleScrollY(event)).toEqual(150);
    });

    test("returns 0 when contentOffset is missing", () => {
      const event = { nativeEvent: {} };

      expect(handleScrollY(event)).toEqual(0);
    });

    test("returns 0 when nativeEvent is missing", () => {
      const event = {};

      expect(handleScrollY(event)).toEqual(0);
    });

    test("returns 0 when event is null", () => {
      expect(handleScrollY(null)).toEqual(0);
    });

    test("returns 0 when event is undefined", () => {
      expect(handleScrollY()).toEqual(0);
    });

    test("returns 0 when y is 0", () => {
      const event = { nativeEvent: { contentOffset: { y: 0 } } };

      expect(handleScrollY(event)).toEqual(0);
    });

    test("handles decimal y values", () => {
      const event = { nativeEvent: { contentOffset: { y: 75.5 } } };

      expect(handleScrollY(event)).toEqual(75.5);
    });
  });

  describe("[calculateCenterOffset]", () => {
    test("calculates offset for element positioning near screen center", () => {
      // 100 + (300 - 900 / 3) = 100 + (300 - 300) = 100
      expect(calculateCenterOffset(100, 300, 900)).toEqual(100);
    });

    test("returns correct offset when scrollY is 0", () => {
      // 0 + (200 - 600 / 3) = 0 + (200 - 200) = 0
      expect(calculateCenterOffset(0, 200, 600)).toEqual(0);
    });

    test("handles large scroll values", () => {
      // 500 + (400 - 900 / 3) = 500 + (400 - 300) = 600
      expect(calculateCenterOffset(500, 400, 900)).toEqual(600);
    });

    test("handles string inputs via validateNumberParam", () => {
      // 100 + (300 - 900 / 3) = 100 + (300 - 300) = 100
      expect(calculateCenterOffset("100", "300", "900")).toEqual(100);
    });

    test("returns negative offset when pageY is small relative to screen", () => {
      // 0 + (50 - 900 / 3) = 0 + (50 - 300) = -250
      expect(calculateCenterOffset(0, 50, 900)).toEqual(-250);
    });

    test("throws error when scrollY is null", () => {
      expect(() => calculateCenterOffset(null, 300, 900)).toThrow(
        "Missing required parameter: scrollY!",
      );
    });

    test("throws error when pageY is undefined", () => {
      expect(() => calculateCenterOffset(100, undefined, 900)).toThrow(
        "Missing required parameter: pageY!",
      );
    });

    test("throws error when screenHeight is not a valid number", () => {
      expect(() => calculateCenterOffset(100, 300, "abc")).toThrow(
        "Invalid parameter! screenHeight must be a number!",
      );
    });
  });
});
