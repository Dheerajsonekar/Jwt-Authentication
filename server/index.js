const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

require("dotenv").config();
const { MONGO_URL } = process.env;
 PORT = 4000;


mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Mongodb connected successfully")).catch((err)=> console.error(err));


app.listen(PORT, ()=> {
    console.log(`Server is listening on port ${PORT}`)
});


app.use(cors({
    origin: ["http://localhost:4000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(express.json());
