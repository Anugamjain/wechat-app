import mongoose from 'mongoose';

const roomSchema = mongoose.Schema({
   topic: {type: String, required: true},
   roomType: {type: String, required: true},
   speakers: {
      type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
      required: false,
   },
   adminId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
}, {timestamps: true});

const RoomModel = mongoose.model('Room',roomSchema,'rooms');

export default RoomModel;