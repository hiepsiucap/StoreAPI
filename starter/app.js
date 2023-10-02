require('dotenv').config()
const express = require('express');
const app = express();
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler')
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')
//middleware
app.use(express.json());
// rootes
app.get('/', (req, res) => {
    res.send('<h1> Store API </h1><a href="/api/v1/products">products route</a>')
})
app.use('/api/v1/products', productsRouter)
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)
const port = 4000
const url = process.env.MONGO_URI
const start = async () => {
    try {
        await connectDB(url)
        app.listen(port, console.log(`Server is listening port ${port}...`))
    } catch (error) {
        console.log(error)
    }
}
start();