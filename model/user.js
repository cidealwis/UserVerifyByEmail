import mongoose from "mongoose";
const Schema = mongoose.Schema;
import Joi from "joi";

const userSchema = new Schema({
  name: {
    type: String,
    min: 3,
    max: 255,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);


const validate = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255).required(),
    email: Joi.string().email().required(),
  });
  return schema.validate(user);
};

export { User, validate };

//Joi use to validate that email , and that name how mutch data use to that like 
