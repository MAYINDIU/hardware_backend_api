const calculatePagination = (options) => {
  const page = Number(options?.page || 1);
  const limit = Number(options?.limit || 10);
  return {
    page,
    limit,
    skip: (page - 1) * limit,
    sortBy: options?.sortBy || "created_at",
    sortOrder: options?.sortOrder || "DESC",
  };
};

module.exports = calculatePagination;
