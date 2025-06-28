import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      unique: true,
      sparse: true, // Needed if it's optional
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple docs without email
    },
    name: { type: String },
    avatar: { type: String },
    activated: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

// Custom validator: at least one of phone or email is required
userSchema.pre("validate", function (next) {
  if (!this.phone && !this.email) {
    return next(new Error("Either phone or email is required."));
  }
  next();
});

const UserModel = mongoose.model("User", userSchema, "users");
export default UserModel;
