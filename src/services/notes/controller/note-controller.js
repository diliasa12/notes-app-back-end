import InvariantError from "../../../exceptions/invariant-error.js";
import response from "../../../utils/response.js";
import NotFoundError from "../../../exceptions/not-found-error.js";
import NoteRepositories from "../repositories/note-repositories.js";
import AuthorizationError from "../../../exceptions/authorization-error.js";

export const createNote = async (req, res, next) => {
  const { title, body, tags } = req.validated;
  const { id: owner } = req.user;
  const note = await NoteRepositories.createNote({ title, body, tags, owner });
  if (!note) {
    return next(new InvariantError("Catatan gagal ditambahkan"));
  }

  return response(res, 201, "Catatan berhasil ditambahkan", { noteId: note });
};
export const getNotes = async (req, res) => {
  const { id: owner } = req.user;
  const notes = await NoteRepositories.getNotes(owner);
  const responseNotes = notes.map((note) => {
    return {
      id: note.id,
      title: note.title,
      body: note.body,
      tags: note.tags,
      createdAt: note.created_at,
      updatedAt: note.updated_at,
      owner,
    };
  });

  return response(res, 200, "Catatan sukses ditampilkan", {
    notes: responseNotes,
  });
};
export const getNotesById = async (req, res, next) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  const note = await NoteRepositories.getNote(id);
  if (!note) {
    return next(new NotFoundError("Catatan tidak ditemukan"));
  }
  const isOwner = await NoteRepositories.verifyNoteOwner(id, owner);
  if (!isOwner) {
    return next(
      new AuthorizationError("Anda tidak berhak mengakses resource ini"),
    );
  }

  const { id: noteId, title, body, tags, created_at, updated_at } = note;
  const responseNote = {
    id: noteId,
    title,
    body,
    tags,
    createdAt: created_at,
    updatedAt: updated_at,
    owner,
  };
  return response(res, 200, "Catatan sukses ditampilkan", {
    note: responseNote,
  });
};
export const editNoteById = async (req, res, next) => {
  const { id } = req.params;
  const { title, tags, body } = req.validated;
  const { id: owner } = req.user;
  const noteIsExist = await NoteRepositories.getNote(id);
  if (!noteIsExist) next(new NotFoundError("Catatan tidak ditemukan"));
  const isOwner = await NoteRepositories.verifyNoteOwner(id, owner);
  if (!isOwner)
    return next(
      new AuthorizationError("Anda tidak berhak mengakses resource ini"),
    );

  const note = await NoteRepositories.editNote({ id, title, body, tags });
  return response(res, 200, "Catatan berhasil diperbarui", { note: note });
};

export const deleteNoteById = async (req, res, next) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  const isOwner = await NoteRepositories.verifyNoteOwner(id, owner);
  if (!isOwner) {
    return next(
      new AuthorizationError("Anda tidak berhak mengakses resource ini"),
    );
  }

  const deletedNote = await NoteRepositories.deleleteNote(id);
  if (!deletedNote) {
    return next(new NotFoundError("Catatan tidak ditemukan"));
  }
  return response(res, 200, "Catatan berhasil dihapus");
};
