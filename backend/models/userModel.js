const {Schema, model} = require('../connection')

const userSchema = new Schema({
    name: String,
    email: {type: String, unique: true},
    password: String,
    createdAt: {type: Date, default: Date.now}
})

module.exports = model('users', userSchema);