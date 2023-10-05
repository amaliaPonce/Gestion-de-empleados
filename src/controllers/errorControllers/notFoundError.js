const errorService = require("../../services/errorService");

const notFound = (req, res, next) => {
  next(errorService.notFoundError());
};

module.exports = notFound;
