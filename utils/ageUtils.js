/**
 * Calculates the age in years based on a birthday Date object.
 *
 * @param {Date} birthdayDate - The birthday represented as a Date object.
 * @param {Date} [referenceDate=new Date()] - The date to compare against when calculating the age.
 * @returns {number} Age in years.
 */
export function calculateAge(birthdayDate, referenceDate = new Date()) {
  const today = referenceDate;
  let age = today.getFullYear() - birthdayDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthdayDate.getMonth() ||
    (today.getMonth() === birthdayDate.getMonth() &&
      today.getDate() >= birthdayDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return age;
}
