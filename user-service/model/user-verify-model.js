import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserVerifyModelSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
    required: true,
    unique: false, // multiple verification tokens can be generated for the same user
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true, // index the token field for faster lookups
    minlength: 16, // ensure the token has a minimum length for security
    maxlength: 64, // ensure the token has a maximum length to prevent excessively long tokens
  },
  createdAt: {
    type: Date,
    default: Date.now, // Setting default to the current date/time
    expires: 3600, // Token will automatically be removed after 1 hour (3600 seconds)
  }
});

export default mongoose.model("UserVerifyModel", UserVerifyModelSchema);
