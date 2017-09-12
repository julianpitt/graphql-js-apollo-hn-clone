const {MongoClient} = require('mongodb');

// 1
const MONGO_URL = 'mongodb://localhost:27017/hackernews';

// 2
module.exports = () => {
  return MongoClient.connect(MONGO_URL).then((db)=>{
    return {
        Links: db.collection('links'),
        Users: db.collection('users'),
        Votes: db.collection('votes'),
    };
  });
}