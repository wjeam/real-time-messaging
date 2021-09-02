
module.exports = (app) => {
    app.get('/users', (req, res) => {
        console.log('GET: USERS')
        res.send(200)
    })
}