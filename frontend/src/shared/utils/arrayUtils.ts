// Utility functions for array operations

/**
 * Removes duplicates from an array
 */
export const unique = <T>(arr: T[]): T[] => {
  return Array.from(new Set(arr));
};

/**
 * Removes duplicates based on a key selector
 */
export const uniqueBy = <T, K>(arr: T[], keySelector: (item: T) => K): T[] => {
  const seen = new Set<K>();
  return arr.filter((item) => {
    const key = keySelector(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/**
 * Groups array items by a key
 */
export const groupBy = <T, K extends string | number>(
  arr: T[],
  keySelector: (item: T) => K
): Record<K, T[]> => {
  return arr.reduce((result, item) => {
    const key = keySelector(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<K, T[]>);
};

/**
 * Sorts array by a property
 */
export const sortBy = <T>(
  arr: T[],
  keySelector: (item: T) => any,
  order: "asc" | "desc" = "asc"
): T[] => {
  return [...arr].sort((a, b) => {
    const aVal = keySelector(a);
    const bVal = keySelector(b);
    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
};

/**
 * Chunks array into smaller arrays of specified size
 */
export const chunk = <T>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

/**
 * Flattens a nested array
 */
export const flatten = <T>(arr: any[]): T[] => {
  return arr.reduce(
    (acc, val) =>
      Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val),
    []
  );
};

/**
 * Gets the first n items from an array
 */
export const take = <T>(arr: T[], n: number): T[] => {
  return arr.slice(0, n);
};

/**
 * Skips the first n items and returns the rest
 */
export const skip = <T>(arr: T[], n: number): T[] => {
  return arr.slice(n);
};

/**
 * Finds the intersection of two arrays
 */
export const intersection = <T>(arr1: T[], arr2: T[]): T[] => {
  const set2 = new Set(arr2);
  return arr1.filter((item) => set2.has(item));
};

/**
 * Finds the difference between two arrays (items in arr1 not in arr2)
 */
export const difference = <T>(arr1: T[], arr2: T[]): T[] => {
  const set2 = new Set(arr2);
  return arr1.filter((item) => !set2.has(item));
};

/**
 * Checks if array is empty
 */
export const isEmpty = <T>(arr: T[] | null | undefined): boolean => {
  return !arr || arr.length === 0;
};

/**
 * Checks if array is not empty
 */
export const isNotEmpty = <T>(arr: T[] | null | undefined): boolean => {
  return !isEmpty(arr);
};

/**
 * Gets a random item from an array
 */
export const randomItem = <T>(arr: T[]): T | undefined => {
  if (isEmpty(arr)) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Shuffles an array randomly
 */
export const shuffle = <T>(arr: T[]): T[] => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

/**
 * Sums numeric values in an array
 */
export const sum = (arr: number[]): number => {
  return arr.reduce((acc, val) => acc + val, 0);
};

/**
 * Gets the average of numeric values
 */
export const average = (arr: number[]): number => {
  if (isEmpty(arr)) return 0;
  return sum(arr) / arr.length;
};

/**
 * Gets the minimum value from an array
 */
export const min = (arr: number[]): number | undefined => {
  if (isEmpty(arr)) return undefined;
  return Math.min(...arr);
};

/**
 * Gets the maximum value from an array
 */
export const max = (arr: number[]): number | undefined => {
  if (isEmpty(arr)) return undefined;
  return Math.max(...arr);
};

/**
 * Counts occurrences of each item in an array
 */
export const countBy = <T>(arr: T[]): Map<T, number> => {
  return arr.reduce((map, item) => {
    map.set(item, (map.get(item) || 0) + 1);
    return map;
  }, new Map<T, number>());
};

/**
 * Partitions an array based on a predicate
 */
export const partition = <T>(
  arr: T[],
  predicate: (item: T) => boolean
): [T[], T[]] => {
  const pass: T[] = [];
  const fail: T[] = [];
  arr.forEach((item) => {
    (predicate(item) ? pass : fail).push(item);
  });
  return [pass, fail];
};
