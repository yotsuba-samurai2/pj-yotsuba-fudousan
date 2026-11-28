/** Four Leaves rental inventory only: this does not change school or mail intake scopes. */
const DIRECT_RENTAL_SEARCH_WARDS = ["文京区", "豊島区"] as const;

export const DIRECT_RENTAL_SEARCH_AREA_LABEL = DIRECT_RENTAL_SEARCH_WARDS.join("・");

export function isDirectRentalSearchAddressAllowed(address: string): boolean {
  const ward = /^東京都\s*([^\s区]+区)/.exec(address.normalize("NFKC"))?.[1];
  return DIRECT_RENTAL_SEARCH_WARDS.some((allowedWard) => allowedWard === ward);
}
