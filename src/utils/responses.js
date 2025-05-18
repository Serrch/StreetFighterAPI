export function OkResponse(res, title, message, status, content) {
  return res.status(status).json({
    title,
    message,
    status,
    content,
  });
}

export function badResponse(res, title, message, status, error) {
  return res.status(status).json({
    title,
    message,
    status,
    error,
  });
}
