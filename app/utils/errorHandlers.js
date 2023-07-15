const handleNotFound = (req, res, next) => {
  res.status(404).json({ error:true, message: "Not found"});
};

const handleErrors = (error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({ error: true, message: error.message , details: error.details });
};

module.exports = { handleNotFound, handleErrors };
