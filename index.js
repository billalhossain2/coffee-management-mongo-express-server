const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const app = express();


//Middlewares
app.use(cors())
app.use(express.json())

const port = process.env.PORT || 9000;


//Routes
app.get("/", (req, res)=>{
    res.send(`Coffee management server is running on port ${port}`)
})

app.listen(port, ()=>{
    console.log(`Coffee management server is listening on port ${port}`)
})
