import mongoose from "mongoose";

const refreshSchema = mongoose.Schema({
   token: { type: String, required: true},
   userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

const RefreshModel = mongoose.model('Refresh',refreshSchema, 'refreshTokens');

export default RefreshModel;