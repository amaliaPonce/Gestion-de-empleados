const { notFoundError } = require("../../services/errorservice");

const notFound = (req, res, next) => {
  next(notFoundError());
};

module.exports = notFound;
