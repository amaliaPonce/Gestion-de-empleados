const { notFoundError } = require("../../services/errorService");

const notFound = (req, res, next) => {
  next(notFoundError());
};

module.exports = notFound;
