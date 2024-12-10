import express from 'express'
import Status from 'http-status'
import router from './src/router.js'
const app = express()
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(express.urlencoded({ extended: false }));


// Middleware to route requests based on the path
app.use('/api', router); 

// A simple health check route
app.get('/', (req, res) => {
    res.send('API is working!');
});

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'content-type')
    res.setHeader('Access-Control-Allow-Credentials', true)
    next()
})

app.listen(PORT, () => logger.info(`Server is listening at PORT ${PORT}`));