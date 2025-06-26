export async function apiRequest<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options)

    const contentType = response.headers.get("Content-Type") || ""

    if (!response.ok) {
      const errorMessage = await extractErrorMessage(response, contentType)
      throw new Error(
        `API error! Status: ${response.status} - ${errorMessage}`
      )
    }

    // If response is JSON, parse it
    if (contentType.includes("application/json")) {
      return (await response.json()) as T
    }

    // Otherwise, return text (if needed, adjust as per your API)
    const text = await response.text()
    return text as unknown as T
  } catch (error) {
    console.error("apiRequest failed:", error)
    throw error instanceof Error
      ? error
      : new Error("Unknown error occurred during API request")
  }
}

// Helper to extract error message from response
async function extractErrorMessage(
  response: Response,
  contentType: string
): Promise<string> {
  try {
    if (contentType.includes("application/json")) {
      const errorData = await response.json()
      return errorData.message || JSON.stringify(errorData)
    } else {
      return await response.text()
    }
  } catch {
    return "Unable to parse error response"
  }
}


