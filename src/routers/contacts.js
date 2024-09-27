import {
  Router
} from "express";
import * as contactControllers from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js"
import { contactAddSchema, contactPatchSchema } from "../validation/contacts.js";
import isValidId from "../middlewares/isValidId.js";

const contactsRouter = Router();

// Route to get all contacts
contactsRouter.get('/', ctrlWrapper(contactControllers.getAllContactsController));

// Route to get a contact by ID
contactsRouter.get('/:contactId', isValidId, ctrlWrapper(contactControllers.getContactByIdController));

// Route to create a new contact
contactsRouter.post('/', validateBody(contactAddSchema), ctrlWrapper(contactControllers.addContactController));

// Route to update or upsert a contact
contactsRouter.put('/:contactId', isValidId, validateBody(contactAddSchema), ctrlWrapper(contactControllers.upsertContactController));

// Route to partially update a contact (PATCH)
contactsRouter.patch('/:contactId', isValidId, validateBody(contactPatchSchema), ctrlWrapper(contactControllers.patchContactController));

// Route to delete a contact
contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(contactControllers.deleteContactController));

export default contactsRouter;
