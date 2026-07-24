export const extractAsinFromUrl = (url: string): string | null => {
  const asinMatch = url.match(/\/dp\/([A-Za-z0-9]{10})/);
  return asinMatch ? asinMatch[1] : null;
};
