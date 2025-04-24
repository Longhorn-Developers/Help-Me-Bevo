export function sendMessage(message: any): void {
  (async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        lastFocusedWindow: true,
      });
      if (tab && tab.id !== undefined) {
        await chrome.tabs.sendMessage(tab.id, message);
      }
    } catch (e) {
      // Optionally, handle the error here
    }
  })();
}

/**
 * Reads a value from chrome.storage.local for a given key.
 *
 * @param key - The key of the item to read.
 * @returns A promise that resolves to the value stored, or undefined if not found.
 */
export async function get<T>(key: string): Promise<T | undefined> {
  return new Promise<T | undefined>((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error reading from chrome.storage.local:",
          chrome.runtime.lastError.message
        );
        reject(chrome.runtime.lastError);
        return;
      }
      resolve(result[key]);
    });
  });
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max));
}

/**
 * Writes a key-value pair to chrome.storage.local.
 *
 * @param key - The key under which the value should be stored.
 * @param value - The value to store (must be JSON-serializable).
 * @returns A promise that resolves when the value has been stored.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function write(key: string, value: any): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (key === "volume" && value > 1) {
        value = clamp(value / 100, 0, 1);
      }

      if (chrome.runtime.lastError) {
        console.error(
          "Error writing to chrome.storage.local:",
          chrome.runtime.lastError.message
        );
        reject(chrome.runtime.lastError);
        return;
      }
      resolve();
    });
  });
}

/**
 * Removes a key (and its associated value) from chrome.storage.local.
 *
 * @param key - The key of the item to remove.
 * @returns A promise that resolves when the item has been removed.
 */
export async function remove(key: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    chrome.storage.local.remove(key, () => {
      if (chrome.runtime.lastError) {
        console.error(
          "Error removing from chrome.storage.local:",
          chrome.runtime.lastError.message
        );
        reject(chrome.runtime.lastError);
        return;
      }
      resolve();
    });
  });
}
