const HttpStatusCode = {
  NOT_FOUND: 404
}

async function extractJSON (request) {
  const response = await request

  return response.data
}

export { HttpStatusCode, extractJSON }
