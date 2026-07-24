/**
 * Sends a standardized success response.
 * Keeps every endpoint's response shape consistent for the frontend.
 */
export const apiResponse = (res, statusCode = 200, message = "Success", data = null, meta = null) => {
  const payload = {
    success: true,
    message,
    data,
  };

  if (meta) payload.meta = meta;

  return res.status(statusCode).json(payload);
};
