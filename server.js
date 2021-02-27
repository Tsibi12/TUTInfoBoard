const express =require('express');
const bodyParser= require('body-parser');
const engine = require('ejs-mate');
const admin = require("firebase-admin");

const app = express();
const serviceAccount = require("./admin.json");
const PORT = 3001;


admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://nodemcu-3453c-default-rtdb.firebaseio.com"
});

const db=admin.database();

app.use(express.static('public'));
app.engine('ejs', engine);
app.set('view engine', 'ejs')
app.use(express.static('views'));
app.use(bodyParser.urlencoded({ extended: true }))

const books = [{
    title: 'Cryptonomicon',
    isbn10: '0060512806',
    author: 'Neil Stephenson',
    bookId: '816',
    cover: 'http://ecx.images-amazon.com/images/I/414L%2BIbzcvL._SX317_BO1,204,203,200_.jpg',
    read: true
}, {
    title: 'Leviathan Wakes',
    isbn10: '0316129089',
    author: 'James S.A. Corey',
    bookId: '9533361',
    cover: 'http://ecx.images-amazon.com/images/I/51QvTzb2vYL._SX322_BO1,204,203,200_.jpg',
    read: false
}, {
    title: 'The Lord of the Rings',
    isbn10: '0395193958',
    author: 'J.R.R. Tolkien',
    bookId: '569465',
    cover: 'http://ecx.images-amazon.com/images/I/51eq24cRtRL._SX331_BO1,204,203,200_.jpg',
    read: true
}, {
    title: 'Norwegian Wood',
    isbn10: '0375704027',
    author: 'Haruki Murakami',
    bookId: '11297',
    cover: 'http://ecx.images-amazon.com/images/I/512ZgaaHjIL._SX322_BO1,204,203,200_.jpg',
    read: false
}, {
    title: 'Microserfs',
    isbn10: '0006548598',
    author: 'Douglas Coupland',
    bookId: '2751',
    cover: 'http://ecx.images-amazon.com/images/I/512ZD5DVC4L._SX345_BO1,204,203,200_.jpg',
    read: true
}, {
    title: 'Up Country',
    isbn10: '0446611913',
    author: 'Nelson Demille',
    bookId: '33820',
    cover: 'http://ecx.images-amazon.com/images/I/512Jrk-RopL._SX290_BO1,204,203,200_.jpg',
    read: true
}, {
    title: 'Night over Water',
    isbn10: '0451173139',
    author: 'Ken Follett',
    bookId: '967690',
    cover: 'http://ecx.images-amazon.com/images/I/51OON2-%2BI-L._SX297_BO1,204,203,200_.jpg',
    read: true
}, {
    title: 'The Stand',
    isbn10: '0307947300',
    author: 'Stephen King',
    bookId: '13155183',
    cover: 'http://ecx.images-amazon.com/images/I/41IzCMjxPWL._SX320_BO1,204,203,200_.jpg',
    read: true
}];

// Send message for default route
app.get('/', function(req, res){
    res.render('index', {title: 'Library Books Collections', books});
});

// Save book id to firebase
app.post('/send-book-id', function(req, res){
    const bookRef=db.ref("logs");
    const oneBookRef=bookRef.child("tag_ref");

    const data = {
        tagId: req.body.bookId,
    }

    // update or save new tag id
    oneBookRef.update(data,(err)=>{
        if(err){
            // res.status(300).json({"msg":"Something went wrong","error":err});
            console.log("Something went wrong","error",err);
        }
        else{
            // res.status(200).json({"msg":"user created sucessfully"});
            res.render('index', {title: 'Library Books Collections', books});
        }
    })
    
});

app.get('/book/:id', function(req, res){
    const id = req.params.id;
    const book = books.find(b => b.bookId == id);
    res.render('book', {title: 'Library Books Collections', book});
});
  
// Listen to specified port(always keep this at bottom of the file)
app.listen(PORT, () => {
    console.log("Server has started on port " + PORT);
});

