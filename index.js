const express = require('express');
const cors = require('cors')
const dotenv = require('dotenv');
const session = require('express-session')
const Database = require("./config/db.js");
const morgan = require('morgan')
const userRoute = require("./routers/userRoute.js");
const excerciseRoute = require("./routers/exerciseRoute.js");
const workOutRoute = require("./routers/workOutRoute.js");
const toolsRoute = require("./routers/toolsRouter.js")
const progressRoute= require("./routers/progressRoute.js")
const app = express()



app.use(session({
    resave:false,
    saveUninitialized:true,
    secret:process.env.SESSION_SECRET
}));
app.use(cors());
app.set('view engine','ejs');
app.use(morgan('dev'));
app.use(express.static('public/temp'))
app.use(express.json());
app.use(express.urlencoded({extended:true}))
dotenv.config()

app.use('/user',userRoute);
app.use('/excercises',excerciseRoute);
app.use('/work',workOutRoute)
app.use('/tools',toolsRoute);
app.use('/progress',progressRoute);

app.get('/',(req,res)=>{
    res.send("<h1>welcome to fitness app<h1>")
})

const PORT = process.env.PORT || 8080
app.listen(PORT,()=>{
    console.log(`Node Server Running In ${process.env.DEV_MODE}mode on port no ${PORT}`)
});