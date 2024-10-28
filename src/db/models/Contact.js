import {
  Schema,
  model
} from "mongoose";
import { contactTypeList } from "../../constants/contacts.js";
import {
  handleSaveError,
  setUpdateOptions
} from "./hooks.js";
import { string } from "joi";

const contactSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  email: String,
  isFavourite: {
    type: Boolean,
    default: false
  },
  contactType: {
    type: String,
    enum: contactTypeList,
    default: "personal",
    required: true
  },
  photo: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", setUpdateOptions);

contactSchema.post("findOneAndUpdate", handleSaveError);

const ContactCollection = model("contact", contactSchema);
// "contact" - назва колекції в однині в базі данних до якої треба підключитись
// MongoDB - base: my-contacts -> collection: contacts

export const sortFields = ['name', 'phoneNumber', 'email', 'isFavourite', 'contactType', 'createdAt', 'updatedAt'];

export default ContactCollection;
