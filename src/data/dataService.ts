import type { FeeData } from "./types";
import feeDataJson from "./fee-data.json";

const LOAD_DELAY_MS = 1200;

/**
 * Simulates an async data fetch with artificial delay.
 *
 * Dev error toggle: add `?error=1` to the URL to force a rejection,
 * so loading and error states can be demonstrated without a backend.
 */
export async function fetchFeeData(): Promise<FeeData> {
  const params = new URLSearchParams(window.location.search);
  const forceError = params.get("error") === "1";

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (forceError) {
        reject(
          new Error(
            "Simulated network error — add ?error=1 to the URL to toggle this.",
          ),
        );
      } else {
        resolve(feeDataJson as FeeData);
      }
    }, LOAD_DELAY_MS);
  });
}
