const app = require('./server/Server');
const port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log('server start at port ' + port);
});
