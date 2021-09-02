
module.exports = (app) => {
    app.get('/conversations', (req, res) => {
        console.log('GET: CONVERSATIONS')
        res.send(200)
    })
}