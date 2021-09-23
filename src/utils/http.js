const HttpStatusCode = {
  NOT_FOUND: 404,
  DUPLICATED: 409,
};

/**
 * Extracts the JSON content of an Axios request
 * @param {Object} request - Axios request
 * @returns {Object} - JSON data extracted from the request
 */
async function extractJSON(request) {
  return request.then((response) => response.data);
}

export { HttpStatusCode, extractJSON };
