import createHttpError from "http-errors";
import * as contactServices from "../services/contacts.js";

// Get all contacts
export const getAllContactsController = async (req, res) => {
  const data = await contactServices.getAllContacts();
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
  const data = await contactServices.getContactById(contactId);

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
  const data = await contactServices.createContact(req.body);
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
    isNew,
    data
  } = await contactServices.updateContact({
      _id: contactId
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
  const result = await contactServices.updateContact({
    _id: contactId
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
  const data = await contactServices.deleteContact({
    _id: contactId
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
