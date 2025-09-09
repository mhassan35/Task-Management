export async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options);
    const contentType = response.headers.get("Content-Type") || "";

    if (!response.ok) {
      const message = await getErrorMessage(response, contentType);
      throw new Error(`API error: ${response.status} - ${message}`);
    }

    return contentType.includes("application/json")
      ? await response.json()
      : (await response.text()) as unknown as T;

  } catch (error) {
    console.error("API request failed:", error);
    throw error instanceof Error
      ? error
      : new Error("An unknown error occurred during the request");
  }
}

async function getErrorMessage(response: Response, contentType: string): Promise<string> {
  try {
    if (contentType.includes("application/json")) {
      const data = await response.json();
      return data.message || JSON.stringify(data);
    }
    return await response.text();
  } catch {
    return "Unable to parse error response";
  }
}
