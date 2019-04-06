const admin = require('firebase-admin')
admin.initializeApp()

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
            .then(() => console.log('complete!'))
            .catch(err => console.log(err))
        return
    })
    .catch(err => {
        console.log(err)
    })
