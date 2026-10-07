import COLORS from "../../constants/colorConstants";
import {
  getAlertButtonLayout,
  getFoodOrMealImageStyle,
  getKcalTextStyle,
  getPressedStyle,
  getIconButtonInnerContainerStyle,
  getCommentTextStyle,
} from "../../utils/styleUtils";

describe("Style Utils", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("[getAlertButtonLayout]", () => {
    test("returns row layout with flex-end for a single button", () => {
      expect(getAlertButtonLayout(1)).toEqual({
        flexDirection: "row",
        justifyContent: "flex-end",
      });
    });

    test("returns row layout with space-evenly for two buttons", () => {
      expect(getAlertButtonLayout(2)).toEqual({
        flexDirection: "row",
        justifyContent: "space-evenly",
      });
    });

    test("returns column layout with center for three or more buttons", () => {
      expect(getAlertButtonLayout(3)).toEqual({
        flexDirection: "column",
        justifyContent: "center",
      });
    });

    test("returns column layout for large button count", () => {
      expect(getAlertButtonLayout(10)).toEqual({
        flexDirection: "column",
        justifyContent: "center",
      });
    });

    test("handles string inputs via validateNumberParam", () => {
      expect(getAlertButtonLayout("2")).toEqual({
        flexDirection: "row",
        justifyContent: "space-evenly",
      });
    });

    test("throws error when buttonCount is null", () => {
      expect(() => getAlertButtonLayout(null)).toThrow(
        "Missing required parameter: buttonCount!",
      );
    });

    test("throws error when buttonCount is below minimum", () => {
      expect(() => getAlertButtonLayout(0)).toThrow(
        "Invalid parameter! buttonCount must be greater than or equal to 1!",
      );
    });

    test("throws error when buttonCount exceeds maximum", () => {
      expect(() => getAlertButtonLayout(11)).toThrow(
        "Invalid parameter! buttonCount must be less than or equal to 10!",
      );
    });
  });

  describe("[getFoodOrMealImageStyle]", () => {
    test("returns default style with size 50 when isDetails is false", () => {
      const result = getFoodOrMealImageStyle();

      expect(result.height).toEqual(50);
      expect(result.width).toEqual(50);
      expect(result.borderRadius).toEqual(25);
      expect(result.borderWidth).toEqual(1);
    });

    test("returns detail style with size 60 when isDetails is true", () => {
      const result = getFoodOrMealImageStyle(true, false);

      expect(result.height).toEqual(60);
      expect(result.width).toEqual(60);
      expect(result.borderRadius).toEqual(30);
      expect(result.borderWidth).toEqual(2);
    });

    test("uses primary color for border when accent is false", () => {
      const result = getFoodOrMealImageStyle();

      expect(result.borderColor).toEqual(COLORS.PRIMARY_500);
    });

    test("uses accent color for border when accent is true", () => {
      const result = getFoodOrMealImageStyle(false, true);

      expect(result.borderColor).toEqual(COLORS.ACCENT_500);
    });
  });

  describe("[getKcalTextStyle]", () => {
    test("returns fontSize 18 when isDetails is false", () => {
      expect(getKcalTextStyle(false)).toEqual({ fontSize: 18 });
    });

    test("returns fontSize 24 when isDetails is true", () => {
      expect(getKcalTextStyle(true)).toEqual({ fontSize: 24 });
    });

    test("defaults to fontSize 18 when no argument provided", () => {
      expect(getKcalTextStyle()).toEqual({ fontSize: 18 });
    });
  });

  describe("[getPressedStyle]", () => {
    test("returns opacity 0.5 when not Android", () => {
      expect(getPressedStyle(false, false)).toEqual({ opacity: 0.5 });
      expect(getPressedStyle()).toEqual({ opacity: 0.5 });
    });

    test("returns opacity 0.5 when Android without ripple", () => {
      expect(getPressedStyle(true, false)).toEqual({ opacity: 0.5 });
    });

    test("returns opacity 1 when Android with ripple", () => {
      expect(getPressedStyle(true, true)).toEqual({ opacity: 1 });
    });

    test("returns opacity 0.5 when non-Android with ripple flag", () => {
      expect(getPressedStyle(false, true)).toEqual({ opacity: 0.5 });
    });
  });

  describe("[getIconButtonInnerContainerStyle]", () => {
    test("returns transparent background by default", () => {
      const result = getIconButtonInnerContainerStyle(1);

      expect(result.backgroundColor).toEqual("transparent");
      expect(result.borderWidth).toEqual(1);
    });

    test("returns colored background when useBackgroundColor is true", () => {
      const result = getIconButtonInnerContainerStyle(2, true, false);

      expect(result.backgroundColor).toEqual(COLORS.PRIMARY_900);
      expect(result.borderWidth).toEqual(2);
    });

    test("uses primary border color when accent is false", () => {
      const result = getIconButtonInnerContainerStyle(1, false, false);

      expect(result.borderColor).toEqual(COLORS.PRIMARY_500);
    });

    test("uses accent border color when accent is true", () => {
      const result = getIconButtonInnerContainerStyle(1, false, true);

      expect(result.borderColor).toEqual(COLORS.ACCENT_500);
    });

    test("uses accent background color when useBackgroundColor and accent are true", () => {
      const result = getIconButtonInnerContainerStyle(1, true, true);

      expect(result.backgroundColor).toEqual(COLORS.ACCENT_900);
      expect(result.borderColor).toEqual(COLORS.ACCENT_500);
    });
  });

  describe("[getCommentTextStyle]", () => {
    test("returns GOOD_500 color when item has good flag", () => {
      const result = getCommentTextStyle({ item: { good: true } });

      expect(result.color).toEqual(COLORS.GOOD_500);
    });

    test("returns ERROR_100 color when item has risks flag", () => {
      const result = getCommentTextStyle({
        item: { risks: "some risk" },
      });

      expect(result.color).toEqual(COLORS.ERROR_100);
    });

    test("returns dynamic shade100 color when item has no good or risks", () => {
      const result = getCommentTextStyle({
        item: {},
        accent: false,
      });

      expect(result.color).toEqual(COLORS.ACCENT_100);
    });

    test("returns primary shade100 when accent is true", () => {
      const result = getCommentTextStyle({
        item: {},
        accent: true,
      });

      expect(result.color).toEqual(COLORS.PRIMARY_100);
    });

    test("prioritizes good over risks when both are present", () => {
      const result = getCommentTextStyle({
        item: { good: true, risks: "risk" },
      });

      expect(result.color).toEqual(COLORS.GOOD_500);
    });

    test("defaults to accent shade100 when accent is not provided", () => {
      const result = getCommentTextStyle({ item: {} });

      expect(result.color).toEqual(COLORS.ACCENT_100);
    });
  });
});
