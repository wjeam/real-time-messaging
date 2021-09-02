
module.exports = (app) => {
    app.get('/messages', (req, res) => {
        console.log('GET: MESSAGES')
        res.send(200)
    })
}