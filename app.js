require('dotenv').config();
require('express-async-errors')
const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect')
const productsRouter = require('./routes/rproducts')



//async errors



const express = require ('express');
const app = express();


//middleware
app.use(express.json());


//routes
app.get('/', (req, res) => {
    res.send('<h1>Store Api</h1><a href="/api/v1/products">Products Route</a>')
}); 

app.use('/api/v1/products', productsRouter)
//products route


app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT || 3000;

const start = async () => {
    try{
        //connect DB
        await connectDB(process.env.MONGO_URI)
        app.listen(port, console.log (`Server is listening on port ${port}...`))
    } catch (error){
        console.log(error);
    }
}

start()