const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const uri = 'mongodb+srv://admin:toor@cluster0-7nogt.azure.mongodb.net/test?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let connect = client.connect();

function connectDB(method) {
  if (!client.isConnected()) {
    connect = client.connect();
  }
  return connect.then(async() => {
    const db = client.db('test');
    // perform actions on the collection object
    let result;
    try {
      result = await method(db);
      // await findDocuments(db);
    } catch (e) {
      return Promise.reject(e);
    }
    return Promise.resolve(result);
  }).catch(err => {
    return Promise.reject(err);
  });
}

exports.connectDB = connectDB;

async function insertResponse(response) {
  return connectDB(async(db) => {
    return await db
      .collection('response')
      .insertOne(response);
  });
}

exports.insertResponse = insertResponse;

async function findResponse(baseURL, path, verb) {
  return connectDB(async(db) => {
    const collection = db.collection('response');
    return collection.findOne({ baseURL, path, verb });
  });
}

exports.findResponse = findResponse;

async function findAllResponse(params) {
  const { baseURL, currentPage, pageSize } = params;
  const current = parseInt(currentPage, 10);
  const size = parseInt(pageSize, 10);
  return connectDB(async(db) => {
    const collection = db.collection('response');
    const data = await collection.find({ baseURL }).skip((current - 1) * size).limit(size).toArray();
    const total = await collection.find({ baseURL }).count();
    return { data, total };
  });
}

exports.findAllResponse = findAllResponse;

async function findUsers() {
  return connectDB(async(db) => {
    const collection = db.collection('user');
    return collection.find({}).toArray();
  });
}

exports.findUsers = findUsers;

async function updateOneResponse(res) {
  return connectDB(async(db) => {
    const collection = db.collection('response');
    const { _id, ...rest } = res;
    return collection.updateOne({ _id: ObjectId(_id) }, { $set: rest });
  });
}

exports.updateOneResponse = updateOneResponse;

async function deleteOneResponse(_id) {
  return connectDB(async(db) => {
    const collection = db.collection('response');
    return collection.deleteOne({ _id: ObjectId(_id) });
  });
}

exports.deleteOneResponse = deleteOneResponse;
