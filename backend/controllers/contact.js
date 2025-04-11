import Contact from "../models/contact.js";
import { errorHandler } from "../util/error.js";

export const contactUs = async (req, res, next) => {
  try {
    const contact = await Contact.create(req.body);
    return res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};
