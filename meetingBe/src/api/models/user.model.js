import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username: String,
    password: String,
    name: String,
    role: Number,
    phone: String,
    dob: Date,
    email: String
})

export default mongoose.model('user', userSchema);