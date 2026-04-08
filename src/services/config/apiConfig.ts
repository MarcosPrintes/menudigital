export function getApiUrl(): string {
  const apiUrl = process.env.API_URL;

  if (!apiUrl) {
    throw new Error("Missing API_URL environment variable.");
  }

  return apiUrl.replace(/\/$/, "");
}

