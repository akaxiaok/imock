const { insertResponse, findResponse } = require('../db/mongodb');
const app = require('../Server');

exports.createResponse = function(req, res) {
  const { status, verb, body, path, } = req.body;
  const encoding = req.body['Content-Encoding'];
  const type = req.body['Content-Type'];
  insertResponse({
    verb,
    path,
    status,
    headers: {
      'Content-Encoding': encoding,
      'Content-Type': type,
    },
    body: body
  }).then(result => {
    console.log('insert success: ' + result.insertedId);
    const { headers, verb, path, status, body, } = result.ops[0];
    console.log(verb + ' ' + path + ' start');
    app[verb.toLowerCase()]('/' + path, function(req, res, next) {
      res.set(headers).status(status).json(body);
    });
    res.status(status).json(result.ops[0]);
  }).catch(err => {
    res.status(400).json(err);
    console.log(err);
  });
};
exports.getResponse = function getResponse(req, res) {
  findResponse().then(response => {
    res.json(response.map(v => {
      const { headers, ...rest } = v;
      return { ...rest, ...headers };
    }));
  }).catch(err => {
    console.log(err);
  });
};
