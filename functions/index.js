// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions')

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin')
admin.initializeApp()

const express = require('express')
const app = express()

const cors = require('cors')({ origin: true })
app.use(cors)

const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const router = express.Router()

const db = admin.firestore().collection('user')

function login(req, res, next) {
    const { username, password } = req.body
    db.doc(username)
        .get()
        .then(user => {
            if (user.exists) {
                const data = user.data()
                if (data.password === password) {
                    req.user = data
                    next()
                    return
                } else {
                    res.json({
                        status: 'fail',
                        msg: 'wrong password!'
                    })
                    return
                }
            } else {
                res.json({
                    status: 'fail',
                    msg: 'user does not exists!'
                })
                return
            }
        })
        .catch(err => {
            console.log('Error getting user:', err)
        })
}

router.post('/login', login, (req, res) => {
    res.json({
        status: 'success',
        msg: ''
    })
})

const waitTime = 5000

router.post('/treasure', login, (req, res) => {
    const diffTime = Date.now() - req.user.lastGet
    if (diffTime < waitTime) {
        res.json({
            status: 'fail',
            waitTime: waitTime - diffTime,
            msg: 'you have to wait!'
        })
        return
    }

    const { username, passHint } = req.body
    req.user.lastGet = Date.now()
    db.doc(username)
        .set(req.user)
        .then(() => {
            if (passHint === req.user.passHint) {
                res.json({
                    status: 'success',
                    treasure: req.user.treasure,
                    msg: ''
                })
                return
            } else {
                res.json({
                    status: 'fail',
                    waitTime: waitTime,
                    msg: 'wrong password hint!'
                })
                return
            }
        })
        .catch(err => {
            console.log('Error setting user:', err)
        })
})

router.get('/addUser', (req, res) => {
    const csv = require('csvtojson')

    const filename = 'chest_password.csv'
    csv()
        .fromFile(filename)
        .then(data => {
            const p = data.map(({ username, password, chest_password }) => {
                const db = admin.firestore().collection('user')
                return db.doc(username).set({
                    lastGet: Date.now(),
                    password: password,
                    passHint: chest_password,
                    treasure: ''
                })
            })
            Promise.all(p)
                .then(() => {
                    console.log('complete!')
                    res.send('Complete!')
                    return
                })
                .catch(err => console.log(err))
            return
        })
        .catch(err => {
            console.log(err)
        })
})
app.use('/api', router)

exports.app = functions.https.onRequest(app)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//     response.send('Hello from Firebase!')
// })
