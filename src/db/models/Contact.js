import {
  Schema,
  model
} from "mongoose";

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
  isFavorite: {
    type: Boolean,
    default: false
  },
  contactType: {
    type: String,
    enum: ["work", "home", "personal"],
    default: "personal",
    required: true
  }
}, {
  timestamps: true,
  versionKey: false
});

const ContactCollection = model("contact", contactSchema);
// "contact" - назва колекції в однині в базі данних до якої треба підключитись
// MongoDB - base: my-contacts -> collection: contacts

export default ContactCollection;
