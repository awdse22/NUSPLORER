const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 16,
        unique: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    }, 
    password: {
        type: String,
        required: true, 
        minLength: 8
    }
});

userSchema.statics.isUsernameAvailable = async function(username) {
    try {
        const user = await this.findOne({ username: username});
        return !user;
    } catch (error) {
        console.log('error checking for users registered with username', error.message);
        return false;
    }
}

userSchema.statics.isEmailAvailable = async function(email) {
    try {
        const user = await this.findOne({ email: email});
    return !user;
    } catch (error) {
        throw new Error('Error checking for available email: ' + error.message)
    }
}

userSchema.methods.comparePassword = async function(password) {
    try {
        const result = await bcrypt.compare(password, this.password);
        return result;
    } catch (error) {
        throw new Error('Error comparing password: ' + error.message);
    }
}

module.exports = mongoose.model('User', userSchema)