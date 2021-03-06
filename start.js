const app = require('./server/Server');
const response = require('./server/controller/response');
const port = process.env.PORT || 5000;

app.route('/response').get(response.getResponse).post(response.createResponse).put(response.updateResponse).delete(response.deleteResponse);

app.listen(port, function() {
  console.log('server start at port ' + port);
});
