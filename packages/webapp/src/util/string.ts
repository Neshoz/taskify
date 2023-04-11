export function toQueryParams<T extends object>(input: T | undefined): string {
  if (!input) {
    return "";
  }
  const params = new URLSearchParams();
  Object.entries(input).forEach(([key, value]) => {
    if (!value) {
      return;
    }
    if (Array.isArray(value)) {
      params.append(key, value.map((v) => String(v)).join(","));
    } else {
      params.append(key, String(value));
    }
  });

  return `?${params.toString()}`;
}
