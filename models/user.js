
module.exports  = (mongoose) => {
    const User = new mongoose.Schema({
        email: {type: String, required: true, unique: true},
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        profileImageSrc: {type: String, default: 'default.png'},
        creationDate: {type: Date, default: Date.now}
    })

    return User
}