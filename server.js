const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app =express();

const url = 'mongodb://127.0.0.1:27017'

const dbName = 'database-2'
let db

app.listen(3000, function() {
    console.log("port 3000");
})
// Read operation through get method.
//app.get(endpoint, callback)

//app.get('/', function(req, res) {
  //  res.send('Hello world!')
//})

app.get('/', function (req,res) {
    res.sendFile(__dirname + '/index.html');
})


/*app.post('/quotes', function(req,res) {
    console.log('helloooo');
})*/

app.get('/', function(req,res) {
    {/*...*/}
})

app.post('/', function(req,res) {
    {/*...*/}
})

//app.post('/quotes', function(req,res) {
  //  console.log(req.body)
//})

MongoClient.connect(url, { useNewUrlParser: true}, function (err,client){
    if(err) return console.log(err)

    app.set('view engine', 'ejs')
    app.use(bodyParser.urlencoded({ extended: true}))
    app.use(bodyParser.json())
    app.use(express.static('public'))

    db=client.db(dbName)
    console.log(`Connected MongoDB: ${url}`)
    console.log(`Database:${dbName}`)
    const quotesCollection = db.collection('quotes')
    app.post('/quotes', function(req,res) {
        quotesCollection.insertOne(req.body)
        .then(result => {
            res.redirect('/')
        })
        .catch(error => console.error(error))
    })
    app.get('/getData', (req, res) => {
        db.collection('quotes').find().toArray()
          .then(results => {
            res.render('index.ejs', { quotes: results })
          })
          .catch(error => console.error(error))
      })
 
      app.put('/quotes', (req, res) => {
          quotesCollection.findOneAndUpdate( 
              {name: 'Ram'},
              {
                $set: {
                    name: req.body.name,
                    quote: req.body.quote
                }    
              },
              {
                  upsert: true
              }
          )
          .then(result => {
              console.log(result)
          })
          .catch(error => console.error(error))
        })

    app.delete ('/quotes', function(req,res) {
        quotesCollection.deleteOne(
            {name: req.body.name},
        )
        .then(result => {
            if (result.deletedCount === 0) {
                return res.json('No quote to delete')
            }
            res.join(`Deleted Ram's quote`)
        })
        .catch(error => console.errpr(error))
    })
})


