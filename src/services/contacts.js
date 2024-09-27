import { SORT_ORDER } from "../constants/index.js";
import ContactCollection from "../db/models/Contact.js";
import calculatePaginationData from "../utils/calculatePaginationData.js";
import parseContactFilterParams from "../utils/filters/parseContactParams.js";

// Get all contacts
export const getContacts = async ({
  perPage,
  page,
  sortBy = '_id',
  sortOrder = SORT_ORDER[0],
  filter = {}
}) => {
  const skip = (page - 1) * perPage;

  // Start building the query
  let contactQuery = ContactCollection.find();

  // Apply filters if they exist
  if (filter.type) {
    contactQuery = contactQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite) {
    contactQuery = contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  // Fetch the paginated data with sorting, skipping, and limiting
  const data = await contactQuery
    .skip(skip)
    .limit(perPage)
    .sort({
      [sortBy]: sortOrder
    });

  // Fetch the total count of documents (without pagination)
  const count = await ContactCollection.countDocuments();

  // Calculate total pages and boolean flags
  const paginationData = calculatePaginationData({
    count,
    perPage,
    page
  });

  return {
    data,
    page,
    perPage,
    totalItems: count,
    ...paginationData
  };
};

// Get contact by ID
export const getContactById = (contactId) => ContactCollection.findById(contactId);

// Create a new contact
export const createContact = (payload) => ContactCollection.create(payload);

// Update or upsert contact
export const updateContact = async (filter, data, options = {}) => {
  const updatedContact = await ContactCollection.findOneAndUpdate(filter, data, {
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
