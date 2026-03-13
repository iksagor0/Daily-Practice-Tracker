export function getBDTime(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 6);
}

export function getEffectiveBDDateStr(): string {
  const bdTime = getBDTime();
  if (bdTime.getHours() < 6) {
    bdTime.setDate(bdTime.getDate() - 1);
  }
  return `${bdTime.getFullYear()}-${String(bdTime.getMonth() + 1).padStart(2, "0")}-${String(
    bdTime.getDate(),
  ).padStart(2, "0")}`;
}
