import axios from "axios";
import { UpstreamError, RateLimitedError } from "./errors.js";

const baseURL =
  process.env.AMADEUS_BASE_URL ?? "https://test.api.amadeus.com";

const clientId = process.env.AMADEUS_CLIENT_ID;
const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("Amadeus credentials are missing");
}

let accessToken: string | null = null;
let tokenExpiresAt = 0;

async function fetchAccessToken(): Promise<string> {
  const response = await axios.post(
    `${baseURL}/v1/security/oauth2/token`,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId as string,
      client_secret: clientSecret as string
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    }
  );

  accessToken = response.data.access_token;
  tokenExpiresAt = Date.now() + response.data.expires_in * 1000;

  if (!accessToken) {
    throw new UpstreamError("Did not receive access token from Amadeus");
  }

  return accessToken;
}

async function getAccessToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiresAt - 30_000) {
    return accessToken;
  }

  return fetchAccessToken();
}

export async function amadeusGet<T>(
  path: string,
  params: Record<string, unknown>
): Promise<T> {
  try {
    const token = await getAccessToken();

    const response = await axios.get<T>(`${baseURL}${path}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (err: any) {
    if (err.response?.status === 429) {
      throw new RateLimitedError("Amadeus rate limit exceeded");
    }

    const details = err.response?.data?.errors || err.response?.data || err.message;
    console.error("Amadeus API Error:", JSON.stringify(details, null, 2));
    throw new UpstreamError("Amadeus request failed", details);
  }
}
