export function buildURL(req, filePath) {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const webPath = filePath.replace(/\\/g, "/");
  return `${baseUrl}/${webPath}`;
}
