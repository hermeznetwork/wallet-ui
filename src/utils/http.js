const HttpStatusCode = {
  NOT_FOUND: 404
}

async function extractJSON (request) {
  return request.then(response => response.data)
}

export { HttpStatusCode, extractJSON }
