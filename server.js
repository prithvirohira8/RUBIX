const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken")


//Middle - wares 
app.use(express.urlencoded({
    extended: true
}))
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());
app.use(express.json());
app.set('views', './views');
app.set('view engine', 'ejs');


// Routing 
app.get("/", (req, res) => {
    const name = "Abhishek Sharma"
    const pic = "Something"

    res.render('face', { name: name, pic: pic });

})

app.listen(3000, () => {
    console.log("Listening on port 3000");
})