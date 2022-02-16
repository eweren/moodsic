/**
 * A function that returns a promise that resolves after a given time.
 * @param ms The time in milliseconds.
 */
 export async function sleep(ms = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(() => {
    resolve();
  }, ms));
}
