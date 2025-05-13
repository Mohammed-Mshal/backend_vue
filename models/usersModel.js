import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    imageId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export const usersModel = mongoose.models.User || mongoose.model('User', userSchema)