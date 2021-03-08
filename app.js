const express = require('express')
const mongoose = require('mongoose')
const app = express()
const PORT = 3000

mongoose.connect('mongodb+srv://atul_pwj:Cupertino@10@pwjatul.lqeaq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})

app.use(express.json({limit: '50mb'}))

app.get('/', (req, res) => {
    res.send('Hello world!')
})

app.post('/api/stores', (req, res) => {
    let dbStores = req.body
    console.log(dbStores)
})

app.listen(PORT, () => {
    console.log(`Store Locator API listening at http://localhost:${PORT}`)
})
