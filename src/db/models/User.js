import {
  Schema,
  model
} from "mongoose";
import { emailRegexp } from "../../constants/users.js";

import {
  handleSaveError,
  setUpdateOptions
} from "./hooks.js";

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    match: emailRegexp,
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", setUpdateOptions);

userSchema.post("findOneAndUpdate", handleSaveError);

const userCollection = model("user", userSchema);

export default userCollection;
