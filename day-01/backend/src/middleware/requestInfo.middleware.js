const requestInfo = (req, res, next) => {
  req.requestTime = new Date();

  next();
};

export default requestInfo;