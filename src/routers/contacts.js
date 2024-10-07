import {
  Router
} from "express";
import * as contactControllers from "../controllers/contacts.js";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import validateBody from "../utils/validateBody.js";
import { contactAddSchema, contactPatchSchema } from "../validation/contacts.js";
import isValidId from "../middlewares/isValidId.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";

const contactsRouter = Router();

contactsRouter.use(authenticate);

// Route to get all contacts
contactsRouter.get('/', ctrlWrapper(contactControllers.getAllContactsController));

// Route to get a contact by ID
contactsRouter.get('/:contactId', isValidId, ctrlWrapper(contactControllers.getContactByIdController));

// Route to create a new contact
contactsRouter.post('/', upload.single("photo"), validateBody(contactAddSchema), ctrlWrapper(contactControllers.addContactController));

// Route to update or upsert a contact
contactsRouter.put('/:contactId', upload.single("photo"), isValidId, validateBody(contactAddSchema), ctrlWrapper(contactControllers.upsertContactController));

// Route to partially update a contact (PATCH)
contactsRouter.patch('/:contactId', upload.single("photo"), isValidId, validateBody(contactPatchSchema), ctrlWrapper(contactControllers.patchContactController));

// Route to delete a contact
contactsRouter.delete('/:contactId', isValidId, ctrlWrapper(contactControllers.deleteContactController));

export default contactsRouter;
