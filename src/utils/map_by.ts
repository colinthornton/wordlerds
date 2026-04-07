export function mapBy<T, K extends keyof T>(list: T[], key: K) {
  const map = new Map<T[K], T>();
  for (const item of list) {
    map.set(item[key], item);
  }
  return map;
}
