
module.exports = (mongoose) => {
    const Conversation = new mongoose.Schema({
        title: {type: String, required: true, default: 'New conversation'},
        users: [{type: mongoose.Schema.ObjectId}],
        messages: [{type: mongoose.Schema.ObjectId}],
        creationDate: {type: Date, default: Date.now}
    })

    return Conversation
}