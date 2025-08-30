import { getAuthToken } from "./auth";

export interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

// GET
export async function getNotes(): Promise<Note[]> {
  const token = getAuthToken();
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/notes`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error("Failed to fetch notes");

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

// CREATE
export async function createNote(title: string, content: string): Promise<Note> {
  const token = getAuthToken();
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, content }),
  });

  if (!res.ok) throw new Error("Failed to create note");
  return (await res.json()) as Note;
}

// UPDATE
export async function updateNote(id: string, title: string, content: string): Promise<Note> {
  const token = getAuthToken();
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title, content }),
  });

  if (!res.ok) throw new Error("Failed to update note");
  return (await res.json()) as Note;
}

// DELETE
export async function deleteNote(id: string): Promise<void> {
  const token = getAuthToken();
  if (!token) throw new Error("Unauthorized");

  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to delete note");
}
