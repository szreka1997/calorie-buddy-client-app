import COLORS from "../../constants/colorConstants";
import {
  hexToRgba,
  getMacroColors,
  getDynamicColors,
  getHorizontalInputValueTextColor,
} from "../../utils/colorUtils";

describe("Color Utils", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("[getDynamicColors]", () => {
    test("returns primary shades by default", () => {
      expect(getDynamicColors()).toEqual({
        shade1000: COLORS.PRIMARY_1000,
        shade900: COLORS.PRIMARY_900,
        shade800: COLORS.PRIMARY_800,
        shade700: COLORS.PRIMARY_700,
        shade500: COLORS.PRIMARY_500,
        shade400: COLORS.PRIMARY_400,
        shade200: COLORS.PRIMARY_200,
        shade100: COLORS.PRIMARY_100,
        shade50: COLORS.PRIMARY_50,
      });
    });

    test("returns accent shades when accent flag is true", () => {
      expect(getDynamicColors(true)).toEqual({
        shade1000: COLORS.ACCENT_1000,
        shade900: COLORS.ACCENT_900,
        shade800: COLORS.ACCENT_800,
        shade700: COLORS.ACCENT_700,
        shade500: COLORS.ACCENT_500,
        shade400: COLORS.ACCENT_400,
        shade200: COLORS.ACCENT_200,
        shade100: COLORS.ACCENT_100,
        shade50: COLORS.ACCENT_50,
      });
    });
  });

  describe("[getMacroColors]", () => {
    test("returns default macro shades", () => {
      expect(getMacroColors()).toEqual({
        protein: COLORS.PROTEIN_500,
        carbs: COLORS.CARBS_500,
        fat: COLORS.FAT_500,
      });
    });

    test("returns light macro shades when requested", () => {
      expect(getMacroColors(true)).toEqual({
        protein: COLORS.PROTEIN_100,
        carbs: COLORS.CARBS_100,
        fat: COLORS.FAT_100,
      });
    });
  });

  describe("[getHorizontalInputValueTextColor]", () => {
    test("uses primary accent when value is set and accent is enabled", () => {
      expect(getHorizontalInputValueTextColor("value", false, true)).toEqual(
        COLORS.ACCENT_500,
      );
    });

    test("uses primary shade when touched and accent disabled", () => {
      expect(getHorizontalInputValueTextColor("", true, false)).toEqual(
        COLORS.PRIMARY_500,
      );
    });

    test("falls back to accent 800 when untouched and empty with accent", () => {
      expect(getHorizontalInputValueTextColor("", false, true)).toEqual(
        COLORS.ACCENT_800,
      );
    });

    test("falls back to primary 800 when untouched and empty without accent", () => {
      expect(getHorizontalInputValueTextColor()).toEqual(COLORS.PRIMARY_800);
    });
  });

  describe("[hexToRgba]", () => {
    test("converts six-digit hex color with opacity", () => {
      expect(hexToRgba("#1aacf0", 0.5)).toEqual("rgba(26, 172, 240, 0.5)");
    });

    test("normalizes three-digit hex shorthand", () => {
      expect(hexToRgba("0f0")).toEqual("rgba(0, 255, 0, 1)");
    });

    test("works without hash prefix", () => {
      expect(hexToRgba("ffffff", 0.25)).toEqual("rgba(255, 255, 255, 0.25)");
    });
  });
});
