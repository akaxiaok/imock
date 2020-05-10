const { insertResponse, findAllResponse, updateOneResponse, findResponse, deleteOneResponse } = require('../db/mongodb');

exports.createResponse = function(req, res) {
  const { _id, status, verb, body, path, baseURL } = req.body;
  const encoding = req.body['Content-Encoding'];
  const type = req.body['Content-Type'];
  findResponse(baseURL, path, verb).then(response => {
    if (response) {
      res.status(409).json({ message: 'same verb baseURL path exist' });
    } else {
      insertResponse({
        baseURL,
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
        res.status(status).json(result.ops[0]);
      }).catch(err => {
        res.status(400).json(err);
        console.log(err);
      });
    }
  });
};
exports.getResponse = function getResponse(req, res) {
  const baseURL = req.query.baseURL;
  findAllResponse(baseURL).then(response => {
    res.json(response.map(v => {
      const { headers, ...rest } = v;
      return { ...rest, ...headers };
    }));
  }).catch(err => {
    console.log(err);
  });
};
exports.updateResponse = function updateResponse(req, res) {
  const { _id, status, verb, body, path, baseURL } = req.body;
  const encoding = req.body['Content-Encoding'];
  const type = req.body['Content-Type'];
  if (_id) {
    updateOneResponse({
      _id,
      baseURL,
      verb,
      path,
      status,
      headers: {
        'Content-Encoding': encoding,
        'Content-Type': type,
      },
      body: body
    }).then(result => {
      console.log('update success');
      res.status(status).json({ message: 'update success' });
    }).catch(err => {
      res.status(400).json(err);
      console.log(err);
    });
  }
};
exports.deleteResponse = function deleteResponse(req, res) {
  const { _id } = req.body;
  if (_id) {
    deleteOneResponse(_id).then(result => {
      console.log(_id + ' delete success');
      res.status(200).json({ message: _id + ' delete success' });
    }).catch(err => {
      res.status(400).json(err);
      console.log(err);
    });
  } else {
    res.status(400).json({ message: 'no id specified' });
  }
};
