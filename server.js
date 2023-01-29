const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500
const {logger} = require('./middleware/logger')
const errorHandler = require("./middleware/errorHandler")
const cookieParser = require('cookie-parser')

//logger to log the progress and the intermediate steps
//req logs are present in the logs folder and also in the terminal while the server in running
app.use(logger)

//enables the app to send and receieve json data
app.use(express.json())

app.use(cookieParser())

// used build in middle-ware
// whenever we need contents form the public folder we do not need to specify the whole path as we have it static
app.use('/',express.static(path.join(__dirname,'/public')))

//to open the root route
app.use('/',require('./routes/root'))

//to cater to eror 404
app.all('*', (req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'views','404.html'))
    }else if(req.accepts('json')){
        res.json({message: "error 404 not found"})
    }else{
        res.type('txt').send("error 404 not found")
    }
})

//for logging the error events (custom middleware)
app.use(errorHandler)

//for setting the port and statement signifying the backend is running
app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`)
})