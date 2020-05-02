exports.createResponse = function(req, res) {
  console.log(req);

  res.json({message:'create ok'});
};
exports.getResponse = function(req, res) {
  res.json({message:'get ok'});
};
