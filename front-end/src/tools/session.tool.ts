export function setSS(key: string, value: any): any {
  if (typeof window === "undefined") return value;
  if (typeof value === 'undefined' || value === null) {
      console.warn(`Attempted to set sessionStorage key '${key}' with undefined or null value.`);
      return value;
  }
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
    return value;
  } catch (error) {
    console.error(`Error setting sessionStorage key '${key}':`, error);
    return value;
  }
}

export function getSS(key: string, defaultValue: any = null): any {
  if (typeof window === "undefined") return defaultValue;
  try {
    const storedValue = sessionStorage.getItem(key);
    if (!storedValue) {
      sessionStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(storedValue);
  } catch (error) {
    console.error(`Error getting sessionStorage key '${key}':`, error);
    return defaultValue;
  }
}

export function removeSS(key: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing sessionStorage key '${key}':`, error);
  }
}