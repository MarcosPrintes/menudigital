export function getApiUrl(): string {
  const apiUrl = process.env.API_URL;
  console.log("apiUrl", process.env.NEXT_PUBLIC_API_URL);
  if (!apiUrl) {
    throw new Error("Missing API_URL environment variable.");
  }

  return apiUrl.replace(/\/$/, "");
}
