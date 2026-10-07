import { calculateAge } from "../../utils/ageUtils";

describe("Age Utils", () => {
  describe("[calculateAge]", () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    test("returns correct age when birthday already occurred this year", () => {
      const birthday = new Date("1990-01-15T00:00:00.000Z");
      const referenceDate = new Date("2025-06-01T00:00:00.000Z");

      expect(calculateAge(birthday, referenceDate)).toEqual(35);
    });

    test("subtracts a year when birthday has not occurred yet this year", () => {
      const birthday = new Date("1990-12-01T00:00:00.000Z");
      const referenceDate = new Date("2025-02-10T00:00:00.000Z");

      expect(calculateAge(birthday, referenceDate)).toEqual(34);
    });

    test("calculates age correctly for leap day birthdays in non-leap years", () => {
      const birthday = new Date("2000-02-29T00:00:00.000Z");
      const referenceDate = new Date("2025-02-28T00:00:00.000Z");

      expect(calculateAge(birthday, referenceDate)).toEqual(24);
    });

    test("uses the current date when referenceDate is not provided", () => {
      const birthday = new Date("2000-04-12T00:00:00.000Z");
      const today = new Date("2025-04-12T00:00:00.000Z");

      jest.useFakeTimers().setSystemTime(today);

      expect(calculateAge(birthday)).toEqual(25);
    });
  });
});
