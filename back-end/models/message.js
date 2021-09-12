
module.exports = (mongoose) => {
    const Message = new mongoose.Schema({
        content: {type: String, required: true},
        creation_date: {type: Date, default: Date.now},
        conversation_id: {type: mongoose.Schema.ObjectId, required: true},
        user_id: {type: mongoose.Schema.ObjectId, required: true}
    })

    return Message
}