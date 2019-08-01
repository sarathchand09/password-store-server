const mongo = require('mongodb').MongoClient;
const mongodb = require('mongodb');
let cors = require('cors');
const url = 'mongodb://mongo';

mongo.connect(url, (err1, client) => {
  if (err1) {
    console.error(err1);
    return;
  }
  const db = client.db('password_store');

  let express = require('express');
  let bodyParser = require('body-parser');
  const app = express();
  const port = 5000;
  app.use(cors({
	  origin: '*'
	  }));
  app.use(bodyParser.json());
  app.listen(port, () => console.log('express app on port 5000 is up and running !!!'));

  app.get('/passwords', (req, res) => {
	  const origin = req.get('origin');

  // TODO Add origin validation
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');

    db.collection('passwords').find().toArray((err, docs) => {
      res.send(JSON.stringify(docs));
    });
  });

  app.delete('/delete/:id', (req, res) => {
	  const origin = req.get('origin');

  // TODO Add origin validation
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');

   
    db.collection('passwords').deleteOne({
      _id: mongodb.ObjectID(req.params.id)
    }, function(err, results) {
      console.log(results.result);
      res.send({});
    });
  });

  app.get('/search/:text', (req, res) => {
	  const origin = req.get('origin');

  // TODO Add origin validation
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');

    let text = req.params.text;
    db.collection('passwords').find({
      title: {
        "$regex": new RegExp(text, 'i')
      }
    }).toArray( (err, docs) => {
      if (err) {
        console.log(err)
      }
      res.send(docs);
    })
  });

  app.post('/update', (req, res) => {
	  const origin = req.get('origin');

  // TODO Add origin validation
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');

    req.body.lastUpdated = new Date().toDateString();
    if (req.body._id) {
      db.collection('passwords').deleteOne({
        _id: mongodb.ObjectID(req.body._id)
      }, function(err) {});
    }
    delete req.body._id;
    db.collection('passwords').save(req.body, (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send({});
    })
  })

  const err = (error) => {
    if (error) {
      console.log(err);
    }
  }

});
