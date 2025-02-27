import mongoose from "mongoose";
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
});

const Token = mongoose.model("Token", tokenSchema);

export default Token;

//use to token is check and user id 
