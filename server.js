const express = require('express') // express 모듈 참조
const app = express(); // express 서버 객체 생성

/* 서버 실행 */
require("dotenv").config();

app.use(express.json());

app.use(express.urlencoded({ extended: true}));

const MongoClient = require("mongodb").MongoClient;

const URL = "mongodb+srv://admin:gachon12@traveler.xbwcx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

let _db;
let reviews;

MongoClient.connect(process.env.MONGODB_URL, { useUnifiedTopology: true}, (error, database) => {
    if (error) return console.log(error);

    _db = database.db("reviewDB");
    reviews = _db.collection("reviews");

    app.listen(process.env.PORT, () => {
        console.log('Server listening at http://localhost:${process.env.PORT}');  
    });
})


app.get("/review", (req, res)=> {
    res.sendFile(__dirname + "/review.html");
}); 

app.post("/add", (req, res) =>{
    const { review } = req.body;

    reviews.insertOne({ review }).then(
        (results) => {
            console.log("DB insert result: ", results);
        },
        (error) => {
            console.log("DB insert failed: ", error);
        }
    );
});

app.get("/list", (req, res) => {
    reviews
        .find()
        // .find({}, { projection: { projection: { _id: 0, reviews: 1 } } })
        .toArray((error,docs) => {
            if (error) return console.log(error);

            docs.forEach((doc) =>{
                if (doc) {
                    console.log(doc);
                } else {
                    res.end();
                }
            });
        });
});