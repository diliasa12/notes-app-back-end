import InvariantError from "../../../exceptions/invariant-error.js";
import response from "../../../utils/response.js";
import NotFoundError from "../../../exceptions/not-found-error.js";
import NoteRepositories from "../repositories/note-repositories.js";

export const createNote = async (req, res, next) => {
  const { title, body, tags } = req.validated;
  const note = await NoteRepositories.createNote({ title, body, tags });
  if (!note) {
    return next(new InvariantError("Catatan gagal ditambahkan"));
  }

  return response(res, 201, "Catatan berhasil ditambahkan", { noteId: note });
};
export const getNotes = async (req, res) => {
  const notes = await NoteRepositories.getNotes();
  const responseNotes = notes.map((note) => {
    return {
      id: note.id,
      title: note.title,
      body: note.body,
      tags: note.tags,
      createdAt: note.created_at,
      updatedAt: note.updated_at,
    };
  });
  console.log(notes);
  return response(res, 200, "Catatan sukses ditampilkan", {
    notes: responseNotes,
  });
};
export const getNotesById = async (req, res, next) => {
  const { id } = req.params;

  const note = await NoteRepositories.getNote(id);
  if (!note) {
    return next(new NotFoundError("Catatan tidak ditemukan"));
  }
  const { id: noteId, title, body, tags, created_at, updated_at } = note;
  const responseNote = {
    id: noteId,
    title,
    body,
    tags,
    createdAt: created_at,
    updatedAt: updated_at,
  };
  return response(res, 200, "Catatan sukses ditampilkan", {
    note: responseNote,
  });
};
export const editNoteById = async (req, res, next) => {
  const { id } = req.params;
  const { title, tags, body } = req.validated;
  const note = await NoteRepositories.editNote({ id, title, body, tags });
  if (!note) next(new NotFoundError("Catatan tidak ditemukan"));
  return response(res, 200, "Catatan berhasil diperbarui", note);
};

export const deleteNoteById = async (req, res, next) => {
  const { id } = req.params;
  const deletedNote = await NoteRepositories.deleleteNote(id);
  if (!deletedNote) {
    return next(new NotFoundError("Catatan tidak ditemukan"));
  }
  return response(res, 200, "Catatan berhasil dihapus");
};
