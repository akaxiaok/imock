const MongoClient = require('mongodb').MongoClient;
const Mock = require('mockjs');
const uri = 'mongodb+srv://admin:toor@cluster0-7nogt.azure.mongodb.net/test?retryWrites=true&w=majority';


function connectDB(method) {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  return client.connect().then(async() => {
    const db = client.db('test');
    // perform actions on the collection object
    let result;
    try {
      result = await method(db);
      // await findDocuments(db);
    } catch (e) {
      return Promise.reject(e);
    }
    await client.close();
    return Promise.resolve(result);
  }).catch(err => {
    return Promise.reject(err);
  });
}

exports.connectDB = connectDB;


async function insertDocuments(db, callback) {
  const categories = [
    'Bagels',
    'Cookies',
    'Pizza',
    'Pasta',
    'Italian',
    'Coffee',
    'Sandwiches'
  ];

  const one = () => Mock.mock({
    'name': '@title(2, 6)',
    'stars|0-5': 1,
    'categories': Mock.Random.shuffle(categories).slice(0, Mock.Random.integer(1, categories.length))
  });

  const count = Mock.Random.integer(1, 5);
  const restaurants = Array(count).fill(0);
  restaurants.forEach((v, i) => {
    restaurants[i] = one();
  });
  const results = await db
    .collection('restaurants')
    .insertMany(restaurants);
  console.log(restaurants.length);

  return results;
}

async function findDocuments(db) {
  // Get the documents collection
  const collection = db.collection('restaurants');
  const docs = await collection.find({ stars: { $gt: 3 } }).toArray();
  console.log('Found the following records');
  console.log(docs);
  return docs;
}

async function insertResponse(response) {
  return connectDB(async(db) => {
    await db
      .collection('response')
      .insertOne(response);
  });
}

exports.insertResponse = insertResponse;

async function findResponse(db) {
  return connectDB(async(db) => {
    const collection = db.collection('response');
    return collection.find({}).toArray();
    // return new Promise((resolve, reject) => {
    //   collection.find({}).toArray().then(docs => {
    //       resolve(docs);
    //   }).catch(err=>{
    //     reject(err)
    //   });
    // });
  });
}

exports.findResponse = findResponse;
