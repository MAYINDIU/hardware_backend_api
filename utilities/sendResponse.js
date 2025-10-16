const sendResponse = (res, data) => {
  const response = {
    success: data.success,
    message: data.message || null,
  };
  if (data.meta) {
    response.meta = data.meta;
  }
  if (data.data) {
    response.result = data.data;
  }
  res.status(data.statusCode).json(response);
};

module.exports = sendResponse;
