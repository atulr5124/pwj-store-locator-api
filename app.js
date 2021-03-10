const express = require('express')
const mongoose = require('mongoose')
const GoogleMapsService = require('./api/services/googleMapsService')
const { db } = require('./api/models/store')
const app = express()
const PORT = 3000
const Store = require('./api/models/store')
const googleMapsService = new GoogleMapsService
require('dotenv').config()

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin','*')
    next()
})

mongoose.connect(`mongodb+srv://atul_pwj:${process.env.ATLAS_PASSWORD}@pwjatul.lqeaq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})

app.use(express.json({limit: '50mb'}))

app.get('/api/stores', (req, res) => {
    const zipCode = req.query.zip_code
    googleMapsService.getCoordinates(zipCode)   
        .then((coordinates) => {
            Store.find({
                location: {
                    $near: {
                        $maxDistance: 3218,
                        $geometry: {
                            type: "Point",
                            coordinates: coordinates
                        }
                    }
                }
            }, (err, stores) => {
                if(err) {
                    res.status(500).send(err)
                } else {
                    res.status(200).send(stores)
                }
            })
        }).catch((error) => {
            console.log(error)
        })
})

app.post('/api/stores', (req, res) => {
    let dbStores = []
    let stores = req.body
    stores.forEach((store) => {
        dbStores.push({
            storeName: store.name,
            phoneNumber: store.phoneNumber,
            address: store.address,
            openStatusText: store.openStatusText,
            addressLines: store.addressLines,
            location: {
                type: 'Point',
                coordinates: [
                    store.coordinates.longitude,
                    store.coordinates.latitude
                ]
            }
        })
    })
    Store.create(dbStores, (err, result) => {
        if(err) {
            res.status(500).send(err)
        } else{
            res.status(200).send(result)
        }
    })
})

app.delete('/api/stores', (req, res) => {
    Store.deleteMany({}, (err) => {
        res.status(200).send(200)
    })
})

app.listen(PORT, () => {
    console.log(`Store Locator API listening at http://localhost:${PORT}`)
})
