import createHttpError from "http-errors";
import * as contactServices from "../services/contacts.js";
import parsePaginationParams from "../utils/parsePaginationParams.js";
import parseSortParams from "../utils/parseSortParams.js";
import {
  sortFields
} from '../db/models/Contact.js';
import parseContactFilterParams from "../utils/filters/parseContactParams.js";

// Get all contacts
export const getAllContactsController = async (req, res) => {
  const {
    perPage,
    page
  } = parsePaginationParams(req.query);
  const {
    sortBy,
    sortOrder
  } = parseSortParams({ ...req.query, sortFields });
  const { _id: userId } = req.user;
  const filter = parseContactFilterParams(req.query);

  const data = await contactServices.getContacts({
    perPage,
    page,
    sortBy,
    sortOrder,
    filter: {...filter, userId}
  });
  res.json({
    status: 200,
    message: "Successfully found contacts!",
    data
  });
};

// Get contact by ID
export const getContactByIdController = async (req, res) => {
  const {
    contactId
  } = req.params;
  const {
    _id: userId
  } = req.user;
  const data = await contactServices.getContact({_id: contactId, userId});

  if (!data) {
    throw createHttpError(404, {
      status: 404,
      message: 'Contact not found',
      data: null
    });
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data
  });
};

// Add a new contact
export const addContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const data = await contactServices.createContact({...req.body, userId});
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

// Upsert (update or insert) a contact
export const upsertContactController = async (req, res) => {
  const {
    contactId
  } = req.params;
  const {
    _id: userId
  } = req.user;
  const {
    isNew,
    data
  } = await contactServices.updateContact({
      _id: contactId,
      userId
    },
    req.body, {
      upsert: true
    }
  );

  const status = isNew ? 201 : 200;
  res.status(status).json({
    status,
    message: "Successfully upserted a contact!",
    data,
  });
};

// PATCH contact by ID
export const patchContactController = async (req, res) => {
  const {
    contactId
  } = req.params;
  const {
    _id: userId
  } = req.user;
  const result = await contactServices.updateContact({
    _id: contactId,
    userId
  }, req.body);

  if (!result) {
    throw createHttpError(404, {
      status: 404,
      message: 'Contact not found',
      data: null
    });
  }

  res.json({
    status: 200,
    message: "Successfully patched a contact!",
    data: result.data,
  });
};

// DELETE contact by ID
export const deleteContactController = async (req, res) => {
  const {
    contactId
  } = req.params;
  const {
    _id: userId
  } = req.user;
  const data = await contactServices.deleteContact({
    _id: contactId,
    userId
  });

  if (!data) {
    throw createHttpError(404, {
      status: 404,
      message: 'Contact not found',
      data: null
    });
  }

  res.status(204).send();
};
