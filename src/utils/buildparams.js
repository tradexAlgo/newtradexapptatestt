export function buildSearchParams(params) {
  const searchParams = new URLSearchParams(params);
  return searchParams.toString();
}
