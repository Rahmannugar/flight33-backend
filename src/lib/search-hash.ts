import { createHash } from "crypto";

type SearchHashInput = {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  travelClass: string;
};

export function createSearchHash(input: SearchHashInput): string {
  const normalized = {
    origin: input.origin.toUpperCase(),
    destination: input.destination.toUpperCase(),
    departureDate: input.departureDate,
    returnDate: input.returnDate ?? null,
    adults: input.adults,
    travelClass: input.travelClass
  };

  const serialized = JSON.stringify(normalized);

  const hash = createHash("sha256")
    .update(serialized)
    .digest("hex");

  return hash.slice(0, 8);
}
