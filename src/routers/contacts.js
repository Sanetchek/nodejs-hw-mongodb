import {
  Router
} from "express";
import * as contactControllers from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";

const contactsRouter = Router();

// Route to get all contacts
contactsRouter.get('/', ctrlWrapper(contactControllers.getAllContactsController));

// Route to get a contact by ID
contactsRouter.get('/:contactId', ctrlWrapper(contactControllers.getContactByIdController));

// Route to create a new contact
contactsRouter.post('/', ctrlWrapper(contactControllers.addContactController));

// Route to update or upsert a contact
contactsRouter.put('/:contactId', ctrlWrapper(contactControllers.upsertContactController));

// Route to partially update a contact (PATCH)
contactsRouter.patch('/:contactId', ctrlWrapper(contactControllers.patchContactController));

// Route to delete a contact
contactsRouter.delete('/:contactId', ctrlWrapper(contactControllers.deleteContactController));

export default contactsRouter;
