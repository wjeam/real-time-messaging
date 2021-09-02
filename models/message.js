
module.exports = (mongoose) => {
    const Message = new mongoose.Schema({
        content: {type: String, required: true},
        creationDate: {type: Date, default: Date.now},
        conversationId: {type: mongoose.Schema.ObjectId, required: true},
        userId: {type: mongoose.Schema.ObjectId, required: true}
    })

    return Message
}