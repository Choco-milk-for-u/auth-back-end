require('dotenv').config();
const mongoose = require('mongoose');



const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const router = require('./routers/index')
const errorMiddleWare = require('./middlewares/error-middleware');


const PORT = process.env.PORT || 7000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use('/api',router);
app.use(errorMiddleWare);

async function start(){
    
    try {
        await mongoose.connect(process.env.DB_URL);
        app.listen(PORT,()=>{
            console.log(`working on ${PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}
start();