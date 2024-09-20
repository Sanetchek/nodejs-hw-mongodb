import ContactCollection from "../db/models/Contact.js";

// Get all contacts
export const getAllContacts = () => ContactCollection.find();

// Get contact by ID
export const getContactById = (contactId) => ContactCollection.findById(contactId);

// Create a new contact
export const createContact = (payload) => ContactCollection.create(payload);

// Update or upsert contact
export const updateContact = async (filter, data, options = {}) => {
  const updatedContact = await ContactCollection.findOneAndUpdate(filter, data, {
    new: true,
    upsert: options.upsert || false,
    ...options,
  });

  if (!updatedContact) return null;

  // If upserted, Mongoose does not return a flag, so you can handle this with some custom logic
  const isNew = options.upsert ? updatedContact.isNew || false : false;

  return {
    data: updatedContact,
    isNew: isNew,
  };
}

// Delete contact by filter
export const deleteContact = async (filter) => {
  const result = await ContactCollection.deleteOne(filter);

  if (result.deletedCount === 0) {
    return null; // If no contact was deleted (i.e., not found)
  }

  return result;
}
