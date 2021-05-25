const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();
const fileUpload = require("express-fileupload");
const usersRouter = require("./routes/usersRouter");
const homeRouter = require("./routes/homeRouter");
const itemsRouter = require("./routes/itemsRouter");

mongoose.connect(process.env.MONGO_URI, {useUnifiedTopology:true,useNewUrlParser:true});
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));

app.set("view engine","ejs");
app.use(session({secret: "secret", resave: true, saveUninitialized: true}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : "imageUploadTemp"
}));

app.use("/users",usersRouter);
app.use("/home",homeRouter);
app.use("/items",itemsRouter);

app.listen(3000, () => console.log("Server running on port 3000"));