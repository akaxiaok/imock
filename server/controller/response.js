const { insertResponse, findResponse } = require('../db/mongodb');

exports.createResponse = function(req, res) {
  const { status, verb, body, path, } = req.body;
  const encoding = req.body['Content-Encoding'];
  const type = req.body['Content-Type'];
  res.status(status).json(req.body);
  insertResponse({
    verb,
    path,
    status,
    headers: {
      'Content-Encoding': encoding,
      'Content-Type': type,
    },
    body: JSON.parse(body)
  }).then(res => {
    console.log(res);
  }).catch(err => {
    console.log(err);
  });
};
exports.getResponse = function(req, res) {
  findResponse().then(response => {
    res.json(response.map(v => {
      const { headers, ...rest } = v;
      return { ...rest, ...headers };
    }));
  }).catch(err => {
    console.log(err);
  });
};
