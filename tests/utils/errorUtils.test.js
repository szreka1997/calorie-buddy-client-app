import {
  getErrorMessage,
  handleFetchResponseErrorsAndData,
  normalizeMessage,
} from "../../utils/errorUtils";
import {
  FIREBASE_HTTP_ERROR_MESSAGES,
  HTTP_ERROR_MESSAGES,
} from "../../constants/alertConstants";

describe("Error Utils", () => {
  describe("[getErrorMessage]", () => {
    test("returns default message when error is falsy", () => {
      expect(getErrorMessage(undefined)).toEqual(HTTP_ERROR_MESSAGES.DEFAULT);
    });

    test("prioritizes firebase mapped messages", () => {
      expect(getErrorMessage({ message: "EMAIL_EXISTS" })).toEqual(
        FIREBASE_HTTP_ERROR_MESSAGES.EMAIL_EXISTS,
      );
    });

    test.each([
      [{ status: 404 }, HTTP_ERROR_MESSAGES[404]],
      [{ statusCode: 503 }, HTTP_ERROR_MESSAGES[503]],
      [{ response: { status: 500 } }, HTTP_ERROR_MESSAGES[500]],
      [{ response: { data: { status: 429 } } }, HTTP_ERROR_MESSAGES[429]],
    ])("maps HTTP status codes regardless of source", (error, expected) => {
      expect(getErrorMessage(error)).toEqual(expected);
    });

    test("falls back to default message for unknown status codes", () => {
      expect(getErrorMessage({ status: 418 })).toEqual(
        HTTP_ERROR_MESSAGES.DEFAULT,
      );
    });

    test("returns normalized response data error when available", () => {
      const error = {
        response: {
          data: {
            error: "  server error  ",
          },
        },
      };

      expect(getErrorMessage(error)).toEqual("server error");
    });

    test("returns normalized nested error property when other candidates empty", () => {
      const error = {
        response: { data: { error: "   ", message: "   " } },
        message: "   ",
        error: { message: " nested issue " },
      };

      expect(getErrorMessage(error)).toEqual("nested issue");
    });

    test("returns normalized primitive when provided", () => {
      expect(getErrorMessage("  raw message ")).toEqual("raw message");
    });

    test("falls back to default when no candidates resolve", () => {
      const error = {
        response: { data: { error: "   ", message: "   " } },
        message: "   ",
        error: "   ",
      };

      expect(getErrorMessage(error)).toEqual(HTTP_ERROR_MESSAGES.DEFAULT);
    });
  });

  describe("[handleFetchResponseErrorsAndData]", () => {
    test("returns parsed data on successful response", async () => {
      const data = { success: true };
      const response = {
        ok: true,
        status: 200,
        json: jest.fn().mockResolvedValue(data),
      };

      await expect(handleFetchResponseErrorsAndData(response)).resolves.toEqual(
        data,
      );
      expect(response.json).toHaveBeenCalledTimes(1);
    });

    test("throws formatted error using firebase mapping when response is not ok", async () => {
      const data = { error: "EMAIL_EXISTS" };
      const response = {
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue(data),
      };

      await expect(handleFetchResponseErrorsAndData(response)).rejects.toThrow(
        FIREBASE_HTTP_ERROR_MESSAGES.EMAIL_EXISTS,
      );
      expect(response.json).toHaveBeenCalledTimes(1);
    });

    test("throws formatted error falling back to HTTP status message", async () => {
      const data = { message: "Something bad happened" };
      const response = {
        ok: false,
        status: 404,
        json: jest.fn().mockResolvedValue(data),
      };

      await expect(handleFetchResponseErrorsAndData(response)).rejects.toThrow(
        HTTP_ERROR_MESSAGES[404],
      );
      expect(response.json).toHaveBeenCalledTimes(1);
    });

    test("throws formatted error using raw payload when message unavailable", async () => {
      const data = "Unexpected failure";
      const response = {
        ok: false,
        status: 500,
        json: jest.fn().mockResolvedValue(data),
      };

      await expect(handleFetchResponseErrorsAndData(response)).rejects.toThrow(
        HTTP_ERROR_MESSAGES[500],
      );
      expect(response.json).toHaveBeenCalledTimes(1);
    });
  });

  describe("[normalizeMessage]", () => {
    test("returns undefined for nullish values", () => {
      expect(normalizeMessage(null)).toBeUndefined();
      expect(normalizeMessage(undefined)).toBeUndefined();
    });

    test("trims strings and ignores empty ones", () => {
      expect(normalizeMessage("  hello world  ")).toEqual("hello world");
      expect(normalizeMessage("   ")).toBeUndefined();
    });

    test("extracts string message from object", () => {
      expect(normalizeMessage({ message: "  message from object  " })).toEqual(
        "message from object",
      );
    });

    test("extracts nested message objects", () => {
      expect(
        normalizeMessage({
          message: { message: "  deep message  " },
        }),
      ).toEqual("deep message");
    });

    test("extracts string error from object", () => {
      expect(normalizeMessage({ error: "  error message  " })).toEqual(
        "error message",
      );
    });

    test("extracts nested error objects", () => {
      expect(
        normalizeMessage({
          error: { message: " nested error " },
        }),
      ).toEqual("nested error");
    });

    test("flattens arrays to comma separated values", () => {
      expect(
        normalizeMessage([
          "  first value  ",
          { message: "second" },
          "   ",
          null,
        ]),
      ).toEqual("first value, second");
    });

    test("stringifies arrays without meaningful parts", () => {
      expect(normalizeMessage([])).toEqual("[]");
    });

    test("returns JSON string for plain objects and omits empty ones", () => {
      expect(normalizeMessage({})).toBeUndefined();
      expect(normalizeMessage({ key: "value" })).toEqual('{"key":"value"}');
    });

    test("ignores nested message when normalization returns undefined", () => {
      expect(
        normalizeMessage({ message: { message: "   " }, fallback: "value" }),
      ).toEqual('{"message":{"message":"   "},"fallback":"value"}');
    });

    test("ignores nested error when normalization returns undefined", () => {
      expect(
        normalizeMessage({ error: { message: "   " }, fallback: true }),
      ).toEqual('{"error":{"message":"   "},"fallback":true}');
    });

    test("falls back to String conversion when JSON serialization fails", () => {
      const circular = {};
      circular.self = circular;

      expect(normalizeMessage(circular)).toEqual("[object Object]");
    });

    test("converts primitive values to strings", () => {
      expect(normalizeMessage(123)).toEqual("123");
      expect(normalizeMessage(false)).toEqual("false");
    });
  });
});
