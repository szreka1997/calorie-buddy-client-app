/**
 * Creates an Authorization header with a Bearer token.
 *
 * @param {string} token
 * @returns {{ Authorization: string }}
 */
export function createAuthorizationHeader(token) {
  return { Authorization: `Bearer ${token}` };
}

/**
 * Filters and maps a payload object using a key mapping.
 *
 * Keeps only keys defined in `mapConstant`, optionally removes falsy values,
 * and renames keys based on the mapping.
 *
 * @param {Object} payload
 * @param {Object} mapConstant
 * @param {boolean} [shouldFilterOutUndefined=false]
 * @returns {Object}
 */
export function formatData(
  payload,
  mapConstant,
  shouldFilterOutUndefined = false,
) {
  const onlyAllowedFields = Object.entries(payload).filter(([key, value]) =>
    Object.keys(mapConstant).includes(key),
  );
  const onlyFieldsWithValue = shouldFilterOutUndefined
    ? onlyAllowedFields.filter(
        ([_, value]) => value !== undefined && value !== null,
      )
    : onlyAllowedFields;
  return Object.fromEntries(
    onlyFieldsWithValue.map(([key, value]) => [mapConstant[key], value]),
  );
}
