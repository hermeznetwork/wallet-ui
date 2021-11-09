/**
 * Converts a milliseconds time to a corresponding 'Xh Xd Xm left' string
 */
function getTimeLeft(milliseconds: number): string {
  const m = Math.floor((milliseconds / (1000 * 60)) % 60);
  const h = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
  const d = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

  return `${d}d ${h}h ${m}m left`;
}

export { getTimeLeft };
