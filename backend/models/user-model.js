import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema({
   phone: { type: String, required: true} ,
   name : {type: String, required: false} , 
   avatar: {type: String, required: false, get: (avatar) => {
      return `${process.env.BASE_URL}${avatar}`
   }},
   activated: {type: Boolean, required: false, default: false},
}, {timestamps: true, toJSON: {getters: true}} );

const UserModel = mongoose.model('User', userSchema, 'users');
export default UserModel;

