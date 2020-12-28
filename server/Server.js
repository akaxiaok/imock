const { findResponse, findUsers } = require('./db/mongodb');
const express = require('express');
const multiparty = require('multiparty');
const util = require('util');
const Mock = require('mockjs');
const path = require('path');
const compression = require('compression');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());

function addRoute(user) {
  app.all('/' + user.baseURL + '*', function(req, res, next) {
    console.log(req.params.url);
    const path = req.params[0];
    const verb = req.method;
    findResponse(user.baseURL, path, verb).then(response => {
      if (response) {
        const { headers, verb, path, status, body } = response;
        console.log(verb + ' ' + path + ' start');
        res.set(headers).status(status).json(Mock.mock(body));
      } else {
        console.log(verb + ' ' + path + ' not found');
        if (verb === 'OPTIONS') {
          res.status(200).end();
        } else {
          res.status(404).json({ message: verb + ' ' + path + ' not found' });
        }
      }
    });
  });
}

findUsers().then(users => {
  users.forEach(user => {
    addRoute(user);
  });
}).catch(err => {
  console.log(err);
});

app.use(express.static(path.join(__dirname, '../dist')));
app.post('/form', function(req, res, next) {
  // 生成multiparty对象，并配置上传目标路径
  const form = new multiparty.Form({ uploadDir: './' });
  // 上传完成后处理
  // fields 一般的表单元素
  // files 文件
  form.parse(req, function(err, fields, files) {
    const filesTmp = JSON.stringify(files, null, 2);
    if (err) {
      console.log('parse error: ' + err);
    } else {
      console.log('parse files: ' + filesTmp);
      const key = Object.keys(files)[0];
      const inputFile = files[key][0];

      const uploadedPath = inputFile.path;
      const dstPath = './' + inputFile.originalFilename;
      // 重命名为真实文件名
      fs.rename(uploadedPath, dstPath, function(err) {
        if (err) {
          console.log('rename error: ' + err);
        } else {
          console.log('rename ok');
        }
      });
    }
    res.writeHead(200, { 'content-type': 'text/plain;charset=utf-8' });
    res.write('received upload:\n\n');
    res.end(util.inspect({ fields: fields, files: filesTmp }));
  });
});

app.post('/post', function(req, res, next) {
  res.writeHead(200, { 'content-type': 'text/plain;charset=utf-8' });
  res.write('received post\n\n');
  res.end();
});
app.get('/get', function(req, res, next) {
  res.writeHead(200, { 'content-type': 'text/plain;charset=utf-8' });
  res.write('received get\n\n');
  res.end();
});

app.get('/script.js', function(req, res, next) {
  res.writeHead(req.header('If-None-Match') ? 304 : 200, {
    'content-type': 'text/javascript;charset=utf-8',
    'Cache-Control': 'max-age=10',
    'Expires': (new Date(Date.now() + 5000)).toGMTString(),
    'Last-modified': (new Date()).toGMTString(),
    'Etag': 'myTag',
  });
  res.write('received get\n\n');
  res.end();
});

module.exports = app;
exports.addRoute = addRoute;

const crossDomainApp = express();

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*'); // 允许哪些域进行跨域请求
  res.header('Access-Control-Allow-Headers', '*'); // 允许哪些自定义头部字段
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS'); // 支持哪些跨域方法
  // Access-Control-Allow-Credentials 是否允许携带 Cookie,允许携带 Cookie 的域必须在 Access-Control-Allow-Origin 明确指定，不能是 *，同时还需要在客户端 XHR 里指定 withCredentials:true
  // res.header('Access-Control-Allow-Credentials', true);
  // res.cookie('express-cookie', 'myCookie');
  // Access-Control-Expose-Headers XMLHttpRequest 对象 getResponseHeader 方法能够读取的响应头部字段 默认为 Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma
  // res.header('Access-Control-Expose-Headers', 'Date');
  res.header('Access-Control-Max-Age', 0); // 在 n 秒时间内不必再次预检
  // res.header('X-Powered-By', ' 3.2.1');
  // 这段仅仅为了方便返回json而已
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

crossDomainApp.post('/post', function(req, res, next) {
  res.writeHead(200, { 'content-type': 'text/plain;charset=utf-8' });
  res.write('crossDomainApp received post\n\n');
  res.end();
});

crossDomainApp.get('/get', function(req, res, next) {
  res.writeHead(200, { 'content-type': 'text/plain;charset=utf-8' });
  res.write('crossDomainApp received get\n\n');
  res.end();
});

// crossDomainApp.listen(3001, function () {
//   console.log('crossDomainApp start at port 3001\n');
// });
