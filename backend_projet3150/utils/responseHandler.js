exports.success = (res, data = null, message = "Succès", statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

exports.error = (res, error, message = "Erreur", statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error?.message || error
  });
};