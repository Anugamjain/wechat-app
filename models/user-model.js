import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   phone: { type: String, required: true} ,
   activated: {type: Boolean, required: false, default: false},
}, {timestamps: true} );


const UserModel = mongoose.model('User', userSchema, 'users');
export default UserModel;

