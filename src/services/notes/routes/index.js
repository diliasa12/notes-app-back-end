import express from "express";
import {
  createNote,
  getNotes,
  getNotesById,
  editNoteById,
  deleteNoteById,
} from "../controller/note-controller.js";
import { validate, validateQuery } from "../../../middlewares/validate.js";
import { notePayloadSchema, noteQuerySchema } from "../validator/schema.js";
const router = express.Router();
router.post("/notes", validate(notePayloadSchema), createNote);
router.get("/notes", validateQuery(noteQuerySchema), getNotes);
router.get("/notes/:id", getNotesById);
router.put("/notes/:id", validate(notePayloadSchema), editNoteById);
router.delete("/notes/:id", deleteNoteById);
export default router;
