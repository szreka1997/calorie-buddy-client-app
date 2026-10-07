import { createAuthorizationHeader, formatData } from "../../utils/fetchUtils";

describe("Fetch Utils", () => {
  describe("[createAuthorizationHeader]", () => {
    test("returns bearer authorization header", () => {
      expect(createAuthorizationHeader("token123")).toEqual({
        Authorization: "Bearer token123",
      });
    });
  });

  describe("[formatData]", () => {
    const mapConstant = {
      name: "full_name",
      age: "years",
      email: "contact_email",
    };

    test("maps and filters to only allowed fields", () => {
      const payload = {
        name: "Alice",
        age: 30,
        email: "alice@example.com",
        extra: "ignored",
      };

      expect(formatData(payload, mapConstant)).toEqual({
        full_name: "Alice",
        years: 30,
        contact_email: "alice@example.com",
      });
    });

    test("excludes null values when shouldFilterOutUndefined is true", () => {
      const payload = {
        name: "Bob",
        age: 0,
        email: null,
      };

      expect(formatData(payload, mapConstant, true)).toEqual({
        full_name: "Bob",
        years: 0,
      });
    });

    test("excludes undefined values when shouldFilterOutUndefined is true", () => {
      const payload = {
        name: "Bob",
        age: undefined,
        email: "",
      };

      expect(formatData(payload, mapConstant, true)).toEqual({
        full_name: "Bob",
        contact_email: "",
      });
    });

    test("preserves falsy values when shouldFilterOutUndefined is false", () => {
      const payload = {
        name: "Carol",
        age: undefined,
        email: null,
      };

      expect(formatData(payload, mapConstant, false)).toEqual({
        full_name: "Carol",
        years: undefined,
        contact_email: null,
      });
    });

    test("handles empty payload gracefully", () => {
      expect(formatData({}, mapConstant)).toEqual({});
    });
  });
});
