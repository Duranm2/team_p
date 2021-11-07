const express = require('express'); // express 모듈 참조
const app = express(); // express 서버 객체 생성
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const mongodb = require('mongodb');
const { cursorTo } = require('readline');

var MongoClient = require('mongodb').MongoClient;

app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
app.engine('html', require('ejs').renderFile);

const port = 3000;

const MONGO_URI = "mongodb+srv://admin:gachon12@traveler.xbwcx.mongodb.net/restaurantDB?retryWrites=true&w=majority"


let client;

app.use(express.json()); //json parsing
app.use(express.urlencoded({extended: true }));
//png, css 경로 문제해결
app.use(express.static(__dirname + '/css/'));
app.use(express.static('files'));
app.use(express.static(__dirname + '/assets/'));
app.use(express.static(__dirname + '/js/'));


MongoClient.connect(MONGO_URI, { useUnifiedTopology: true}, (error, database) => {
    if (error) return console.log(error);
    
    console.log("MONGODB CONNECTED");

    client = database.db("restaurantDB");     
    
})



    app.get("/", (req, res) => {
        res.render('index2.html');
    });
    

    app.get('/search', async(req,res)=>{
        const name = req.query.name;
        const food = req.query.food;

        var result = client.collection("restaurants");
        if (!name){
            res.render('search.ejs', {documents: [] });
            return 0;
        }
        const docs = await result.find({ name : {$regex : name }}).toArray();

        const docs2 = docs.filter((el)=> el.classify === food );
        if(!docs2){
            res.render('search.ejs', {documents: docs});
            return 0;
        }
        console.log(docs);
        res.render('search.ejs', {documents: docs2});
    });


   

    app.get("/locsearch", async(req, res) => {
        const address = req.query.address;
        const food2 = req.query.food2;

        var result2 = client.collection("restaurants");

        if (!address && !food2){
            res.render('restaurant_locsearch.ejs', {documents2: [], documents3: [] });
            return 0;
        }

        //식당
        const docs3 = await result2.find({'$and': [ { address : {$regex : address }}, { name : {$regex : food2 }}] }).toArray();

        const nums = docs3.length;
        const randoms = Math.floor(Math.random()*nums);
        
        const docs4 = await result2.find({'$and': [ { address : {$regex : address }}, { name : {$regex : food2 }}] }).limit(1).skip(randoms).toArray();
        
        //디저트
        const docs5 = await result2.find({'$and': [ { address : {$regex : address }}, { classify : '디저트' }] }).toArray();

        const nums2 = docs5.length;
        const randoms2 = Math.floor(Math.random()*nums2);

        const docs6 = await result2.find({'$and': [ { address : {$regex : address }}, { classify : '디저트' }] }).limit(1).skip(randoms2).toArray();
    
       res.render('restaurant_locsearch.ejs', {documents2: docs4, documents3: docs6});
    });
    


    app.get("/info", (req, res) => {

        res.render("restaurant_info.ejs")
    });
    
    app.get("/service", (req, res) => {
        res.render("service.html")
    });

    


app.listen(port, () => {
    console.log("Server listening on port 3000.");
});

  



