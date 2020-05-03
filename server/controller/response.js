const { insertResponse, findResponse } = require('../db/mongodb');

exports.createResponse = function(req, res) {
  const { encoding, status, type, verb, body } = req.body;
  res.set({
    'Content-Encoding': encoding,
    'Content-Type': type,
  }).status(status).json(JSON.parse(body));
  insertResponse({
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
      return { body: v.body, ...v.headers };
    }));
  }).catch(err => {
    console.log(err);
  });
};
